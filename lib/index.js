import {readFileSync,writeFileSync,renameSync,mkdirSync,appendFileSync,existsSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import {dirname,basename} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createCenter,defaultSettings,validateSettings,normalizeSessionEvent,hostStrings,failure} from './core.js';

// [local patch][TEMP] tracing for the focus signal
// Optional diagnostics, OFF unless a `.debug` marker sits next to this package,
// so a published install never writes logs behind the user's back. Creating or
// deleting that file (then restarting DSH) toggles it.
const _dbgOn=(()=>{try{return existsSync(new URL('../.debug',import.meta.url));}catch{return false;}})();
const _dbgPath=(process.env.TEMP||process.env.TMP||'.')+String.fromCharCode(92)+'notify-card.log';
const _dbg=(m)=>{if(!_dbgOn)return;try{appendFileSync(_dbgPath,new Date().toISOString()+' '+m+String.fromCharCode(10));}catch{}};
export const name='dsh-notify-card';
export const inject=['webServer','connection','agents','jobs'];
export const PREFIX='/__dsh/notify-card';
function sessionOf(req){return req?.agent?.session;}
function sessionId(req){return String(sessionOf(req)?.id??sessionOf(req)?.header?.id??'');}
function sessionLabel(session){return String(session?.header?.title??(session?.header?.cwd?basename(session.header.cwd):session?.id??'DSH'));}
function json(res,status,value){res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'});res.end(JSON.stringify(value));}
async function readJson(req,t=hostStrings('zh')){
  if(!String(req.headers['content-type']??'').toLowerCase().startsWith('application/json'))throw failure(t.errors.jsonRequired,415);
  let size=0;const chunks=[];
  for await(const chunk of req){size+=chunk.length;if(size>128*1024)throw failure(t.errors.bodyTooLarge,413);chunks.push(chunk);}
  try {const value=JSON.parse(Buffer.concat(chunks).toString('utf8'));if(!value||typeof value!=='object'||Array.isArray(value))throw Error();return value;}catch{throw failure(t.errors.jsonInvalid);}
}
function sameOrigin(req){try{const o=new URL(req.headers.origin);return ['http:','https:'].includes(o.protocol)&&o.host===req.headers.host&&o.origin===req.headers.origin;}catch{return false;}}
function approvalOperation(req) {
  const callId=typeof req?.callId==='string'?req.callId:'';
  const session=sessionOf(req);
  if(!callId||callId.length>512||typeof req.toolName!=='string'||!req.toolName||typeof session?.snapshotEvents!=='function')return null;
  try {
    const events=session.snapshotEvents();
    if(!Array.isArray(events))return null;
    const call=events.findLast(event=>event?.type==='tool/call'&&event.data?.callId===callId);
    if(call?.data?.name!==req.toolName||typeof call.data.arguments!=='string'||!call.data.arguments)return null;
    const args=JSON.parse(call.data.arguments);
    if(!args||typeof args!=='object'||Array.isArray(args))return null;
    const detail=typeof args.command==='string'?args.command:call.data.arguments;
    if(!detail.trim()||detail.length>32000)return null;
    return {callId,detail};
  } catch {return null;}
}

export function createHost(ctx,{bridge,settingsPath,clock=Date.now,language='auto'}={}) {
  const instanceId=randomUUID();
  // 'auto' follows the dsh UI language: the `locale` settings namespace that
  // @deepseek-ai/dsh-client-locale registers Host-side keeps the user's picker
  // choice. With no provider and no stored preference the plugin stays Chinese.
  // Titles are localized when an event is published; stored history keeps the
  // language it was created with.
  const preference=()=>{try{const service=ctx.get?.('settings')??ctx.settings;const locale=service?.get?.('locale');return typeof locale?.preference==='string'?locale.preference:'';}catch{return '';}};
  const activeLanguage=()=>language==='zh'||language==='en'?language:(preference().toLowerCase().startsWith('en')?'en':'zh');
  const s=()=>hostStrings(activeLanguage());
  let settings=defaultSettings(),closed=false,nativeError='';
  if(settingsPath){try{settings=validateSettings(JSON.parse(readFileSync(settingsPath,'utf8')),undefined,activeLanguage());}catch(error){if(error.code!=='ENOENT')nativeError=s().settingsReadFailed;}}
  const subscribers=new Map(),visibility=new Map(),disposers=[],fallback=new Set(),dedup=new Map(),replies=new Map(),nativeInFlight=new Set();
  // [local patch] reported by the PowerShell helper (the page->host channel does
  // not work under the desktop shell, so focus comes from Win32 instead).
  let dshFocused=false; const memoryTurns=new Set();
  let center;
  const snapshot=()=>({instanceId,...center.snapshot(),native:{available:Boolean(bridge?.available),...(nativeError?{error:nativeError}:{})}});
  const broadcast=()=>{
    if(closed)return;
    const data=`event: state\ndata: ${JSON.stringify(snapshot())}\n\n`;
    for(const [res,stream] of subscribers){try{if(stream.blocked){stream.latest=data;}else{stream.blocked=!res.write(data);}}catch{subscribers.delete(res);}}
  };
  const foreground=id=>[...visibility.values()].some(v=>clock()-v.at<35000&&!v.hidden&&v.currentSessionId===id);
  center=createCenter({settings,clock,language:activeLanguage,onChange:broadcast,onSettle:event=>{nativeInFlight.delete(event.id);try{bridge?.close(event.id);}catch{}},onDeliver(event,prefs){
    event.nativeDelivered=false;
    if(event.channel==='browser'||!prefs.native)return;
      if(!event.requestId&&!event.isTest&&prefs.backgroundOnly&&(dshFocused||foreground(event.sessionId))){
        // [local patch] a plain notice (task finished, error, ...) serves no purpose
        // while the user is already looking at DSH: the result is right there on
        // screen. dshFocused is the reliable signal (reported by the native helper);
        // foreground() is the original session-visibility channel, kept as backup.
        _dbg('notice suppressed: kind='+String(event.kind||'?')+(dshFocused?' dshFocused':' foreground'));
        return;
      }
    try{
      event.nativeDelivered=bridge?.show(event,prefs,s().native)===true;
      if(event.nativeDelivered){nativeInFlight.add(event.id);if(nativeInFlight.size>256)nativeInFlight.delete(nativeInFlight.values().next().value);}
    }catch(error){nativeError=s().nativeLaunchFailed;}
  }});
  const persist=()=>{
    if(!settingsPath)return;
    mkdirSync(dirname(settingsPath),{recursive:true});
    const temp=`${settingsPath}.tmp`;
    writeFileSync(temp,JSON.stringify(center.snapshot().settings,null,2)+'\n',{mode:0o600});renameSync(temp,settingsPath);
  };
  const api={center,snapshot,
    respond(payload){return center.respond(payload);},
    nativeAction(action){
      if(action?.type==='focus'){dshFocused=action.focused===true;_dbg('focus='+dshFocused);if(dshFocused){try{for(const e of center.snapshot().pending){if(e.kind!=='approval'||!e.nativeDelivered)continue;fallback.add(e.id);_dbg('HAND-BACK '+e.id);center.cancel(e.id,'handed back to DSH');}}catch{}}return;}
      if(action?.type==='ready'){nativeError='';broadcast();return;}
      if(action?.type==='shown'){nativeInFlight.delete(action.id);return;}
      if(action?.type==='respond'){
        try{center.respond(action);nativeError='';broadcast();}
        catch(error){
          nativeError=error.status===409?s().nativeStaleAnswer:error.message;
          const pending=center.snapshot().pending.find(e=>e.id===action.id);
          if(pending){try{bridge?.show({...pending,error:nativeError},center.snapshot().settings,s().native);}catch{}}
          else {try{bridge?.close(action.id);}catch{}}
          broadcast();
        }
      }
      if(action?.type==='dismiss'){nativeInFlight.delete(action.id);center.markRead(action.id);}
    },
    nativeFailure(){
      nativeError=s().nativeUnavailable;
      for(const e of center.snapshot().pending){
        const needsReminder=nativeInFlight.has(e.id);
        fallback.add(e.id);center.cancel(e.id,'原生浮窗不可用');
        if(needsReminder)publish({kind:'error',sessionId:e.sessionId,title:s().fallbackTitle,body:s().fallbackBody,channel:'browser',dedupKey:`native-fallback:${e.id}`});
      }
      const history=new Map(center.snapshot().history.map(event=>[event.id,event]));
      for(const id of nativeInFlight){const event=history.get(id);if(event&&!event.requestId&&!event.read&&!event.resolved&&!event.cancelled)center.markNative(id,false);}
      nativeInFlight.clear();
      broadcast();
    },
    dispose(){closed=true;center.dispose();for(const res of subscribers.keys())res.end();subscribers.clear();for(const off of disposers)try{off();}catch{};bridge?.dispose();},
  };
  const publish=input=>{
    if(!input)return;
    if(input.dedupKey){if(dedup.has(input.dedupKey))return;dedup.set(input.dedupKey,clock());if(dedup.size>1000)dedup.delete(dedup.keys().next().value);}
    center.publish(input);
  };
  const ownRequest=async(kind,req,next)=>{
    const sid=sessionId(req),prefs=center.snapshot().settings;
    const origin=sessionOf(req)?.header?.origin;
    if(!sid||!prefs.enabled||!prefs.events[kind])return next();
    if(origin==='subagent'&&!prefs.includeSubagents)return next();
    if(!prefs.native){publish({kind,sessionId:sid,title:s().events[kind],body:sessionLabel(sessionOf(req))});return next();}
    let pending;
    try{
      const agents=ctx.get?.('agents')??ctx.agents;
      const isCurrent=()=>!agents||(agents.get(req.agent.id)===req.agent&&String(req.agent.id)===sid);
      if(!isCurrent())return next();
      // [local patch] When the user is actually looking at this session, hand the
      // request back so DSH's own approval card is shown; only take over (and pop the
      // floating window) when nobody is watching that session.
      if(kind==='approval'&&dshFocused){_dbg('approval -> delegate(focused)');return next();}
      const operation=kind==='approval'?approvalOperation(req):null;
      if(kind==='approval'&&!operation)return next();
      pending=center.openRequest({kind,sessionId:sid,title:s().events[kind],body:sessionLabel(sessionOf(req)),questions:req.questions,toolName:req.toolName,callId:operation?.callId,reason:req.reason,detail:operation?.detail,signal:req.signal,isCurrent,origin});
    }catch(error){if(req.signal?.aborted){if(kind==='approval')return 'cancelled';throw error;}return next();}
    _dbg('approval -> takeover, nativeDelivered='+pending.event.nativeDelivered);
    if(!pending.event.nativeDelivered){fallback.add(pending.event.id);center.cancel(pending.event.id,'原生浮窗不可用');}
    try{return await pending.promise;}
    catch(error){if(fallback.delete(pending.event.id)&&!req.signal?.aborted&&!closed)return next();if(kind==='approval')return 'cancelled';throw error;}
  };
  disposers.push(ctx.on('user-questions/request',(req,next)=>ownRequest(req.questions?.some(q=>q.intent?.kind==='plan-review')?'planReview':'question',req,next),{prepend:true}));
  disposers.push(ctx.on('approval/request',(req,next)=>ownRequest('approval',req,next),{prepend:true}));
  disposers.push(ctx.on('session/event',(session,event)=>{
    const sid=String(session?.id??'');
    // [local patch] a turn started by meow-memory (reflect/dream) raises no
    // completion notice; every other turn keeps its notice.
    if(event?.type==='user/message'){if(JSON.stringify(event?.data??'').includes('[meow-memory-'))memoryTurns.add(sid);else memoryTurns.delete(sid);}
    if(event?.type==='turn/start'){replies.set(sid,'');if(replies.size>200)replies.delete(replies.keys().next().value);}
    if(event?.type==='assistant/message'){
      const body=(event.data?.message?.content??[]).filter(b=>b.type==='text').map(b=>b.text).join('');
      replies.set(sid,((replies.get(sid)??'')+body).slice(0,1000));
    }
    const normalized=normalizeSessionEvent(session,event,activeLanguage());
    if(normalized){const silent=normalized.kind==='completed'&&memoryTurns.has(sid);if(silent){memoryTurns.delete(sid);}else{normalized.body=replies.get(sid)||sessionLabel(session);publish(normalized);}}
    if(event?.type==='turn/end')replies.delete(sid);
  }));
  disposers.push(ctx.on('goal/changed',({agent,change})=>{
    if(!['pause','complete','block'].includes(change?.operation))return;
    publish({kind:'goal',sessionId:String(agent?.session?.id??agent?.id??''),title:({pause:s().goalPaused,complete:s().goalCompleted,block:s().goalBlocked})[change.operation],body:sessionLabel(agent?.session),origin:agent?.session?.header?.origin});
  }));
  const jobs=ctx.get?.('jobs')??ctx.jobs;
  if(jobs?.onJobDone)disposers.push(jobs.onJobDone((job,owner)=>{
    const kind=({completed:'jobCompleted',failed:'jobFailed',killed:'jobKilled'})[job.status];
    if(kind)publish({kind,sessionId:String(owner?.id??job.ownerSession??''),title:s().events[kind],body:String(job.label??job.id??s().jobFallback),origin:owner?.session?.header?.origin});
  }));
  const pruneTimer=setInterval(()=>center.prune(),5000);pruneTimer.unref();disposers.push(()=>clearInterval(pruneTimer));
  const handler=(method,fn)=>async(req,res)=>{
    const rejection=ctx.connection.requestRejection(req);
    if(rejection!==undefined){json(res,rejection,{ok:false,error:rejection===401?s().errors.reauth:s().errors.untrustedOrigin});return;}
    if(req.method!==method){json(res,405,{ok:false,error:s().errors.methodNotAllowed});return;}
    if(method==='POST'&&!sameOrigin(req)){json(res,403,{ok:false,error:s().errors.sameOriginOnly});return;}
    try{await fn(req,res);}catch(error){if(!res.headersSent)json(res,error.status??500,{ok:false,error:error.status?error.message:s().errors.serviceError});else res.destroy();}
  };
  const route=(suffix,method,fn)=>{disposers.push(ctx.webServer.register({kind:'exact',path:PREFIX+suffix,handler:handler(method,fn)}));};
  route('/state','GET',async(_req,res)=>json(res,200,snapshot()));
  route('/events','GET',async(req,res)=>{
    if(subscribers.size>=20)throw failure(s().errors.tooManyStreams,429);
    res.writeHead(200,{'content-type':'text/event-stream','cache-control':'no-store','x-accel-buffering':'no'});
    const stream={blocked:false,latest:null};subscribers.set(res,stream);
    stream.blocked=!res.write(`event: state\ndata: ${JSON.stringify(snapshot())}\n\n`);
    res.on('drain',()=>{stream.blocked=false;if(stream.latest){const latest=stream.latest;stream.latest=null;stream.blocked=!res.write(latest);}});
    const heartbeat=setInterval(()=>{if(!stream.blocked)stream.blocked=!res.write(': keepalive\n\n');},20000);heartbeat.unref();
    const cleanup=()=>{clearInterval(heartbeat);subscribers.delete(res);};req.on('close',cleanup);res.on('close',cleanup);
  });
  route('/settings','POST',async(req,res)=>{const body=await readJson(req,s());const old=center.snapshot().settings;center.updateSettings(body.patch);try{persist();}catch(error){center.updateSettings(old);throw failure(s().errors.settingsSaveFailed,500);}json(res,200,{ok:true});});
  route('/answer','POST',async(req,res)=>json(res,200,api.respond(await readJson(req,s()))));
  route('/read','POST',async(req,res)=>{const body=await readJson(req,s());center.markRead(body.id);json(res,200,{ok:true});});
  route('/clear','POST',async(req,res)=>{await readJson(req,s());center.clearHistory();json(res,200,{ok:true});});
  route('/visibility','POST',async(req,res)=>{
    const body=await readJson(req,s());if(typeof body.clientId!=='string'||body.clientId.length>128||typeof body.hidden!=='boolean')throw failure(s().errors.visibilityInvalid);
    for(const [id,v] of visibility)if(clock()-v.at>35000)visibility.delete(id);
    if(visibility.size>=20&&!visibility.has(body.clientId))throw failure(s().errors.tooManyPages,429);
    visibility.set(body.clientId,{hidden:body.hidden,currentSessionId:typeof body.currentSessionId==='string'?body.currentSessionId:'',at:clock()});json(res,200,{ok:true});
  });
  route('/test','POST',async(req,res)=>{
    const body=await readJson(req,s());if(!['native','browser','question','approval'].includes(body.kind))throw failure(s().errors.testKindInvalid);
    if(body.kind==='question'||body.kind==='approval'){
      const t=s();
      const pending=center.openRequest({kind:body.kind,sessionId:'notify-card-test',isTest:true,title:body.kind==='question'?t.testQuestionTitle:t.testApprovalTitle,body:t.testBody,toolName:'notification_test',reason:t.testReason,detail:body.kind==='approval'?t.testApprovalDetail:undefined,questions:body.kind==='question'?[{id:'choice',question:t.testChoiceQuestion,options:t.testChoiceOptions.map(label=>({label}))},{id:'multi',question:t.testMultiQuestion,multiSelect:true,options:t.testMultiOptions.map(label=>({label}))}]:undefined});
      const timer=setTimeout(()=>center.cancel(pending.event.id,'測試已逾時'),600000);timer.unref();
      pending.promise.then(()=>publish({kind:'completed',sessionId:'notify-card-test',title:t.testDoneTitle,body:t.testDoneBody,isTest:true}),()=>{}).finally(()=>clearTimeout(timer));
      json(res,200,{ok:true,id:pending.event.id});
    }else{publish({kind:'completed',sessionId:'notify-card-test',title:s().testNoticeTitle,body:s().testNoticeBody,isTest:true,channel:body.kind});json(res,200,{ok:true});}
  });
  return api;
}
export async function apply(ctx,config){
  const {createNativeBridge}=await import('./native.js');let host;
  const bridge=createNativeBridge({onAction:action=>host?.nativeAction(action),onError:()=>host?.nativeFailure()});
  const settingsPath=fileURLToPath(new URL('notify-card.settings.json',ctx.baseUrl));
  const language=['auto','zh','en'].includes(config?.language)?config.language:'auto';
  host=createHost(ctx,{bridge,settingsPath,language});
  ctx.effect(()=>()=>host.dispose(),'dsh-notify-card: lifecycle');
}
