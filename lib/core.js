import { randomUUID, randomBytes, timingSafeEqual } from 'node:crypto';

// Every host-generated user-facing string, in both UI languages. Titles are
// localized when an event is published; history keeps the language it was
// created with, because stored events carry their rendered title.
export const HOST_STRINGS = Object.freeze({
  zh:Object.freeze({
    events:Object.freeze({completed:'任务完成',error:'执行失败',aborted:'任务已中止',interrupted:'任务遭中断',blocked:'任务受到阻塞',maxTokens:'已达输出上限',approval:'等待批准',question:'等待回答',planReview:'等待计画审阅',compaction:'上下文压缩完成',jobCompleted:'背景工作完成',jobFailed:'背景工作失败',jobKilled:'背景工作已停止',goal:'目标状态更新'}),
    compactionFailed:'上下文压缩失败',goalPaused:'目标已暂停',goalCompleted:'目标已完成',goalBlocked:'目标受到阻塞',jobFallback:'背景工作',
    settingsReadFailed:'通知设置读取失败，已使用预设值',nativeLaunchFailed:'原生浮窗启动失败',nativeStaleAnswer:'已忽略失效的浮窗回答',nativeUnavailable:'原生浮窗不可用，待回答请求将交回 DSH',
    fallbackTitle:'原生互动已切回 DSH',fallbackBody:'尚未回答的互动请求已交回 DSH，请返回 DSH 继续处理。',
    testQuestionTitle:'互动问答测试',testApprovalTitle:'一次性批准测试',testBody:'这是通知插件的测试，不会执行指令或调用模型。',testReason:'只确认通知卡片可回传一次性决定；不会修改文件。',testApprovalDetail:'模拟批准操作：不会执行任何工具或指令。',
    testChoiceQuestion:'请选择一个选项，或输入自己的回答。',testChoiceOptions:Object.freeze(['互动正常','需要调整']),testMultiQuestion:'测试多选，也可以补充文字。',testMultiOptions:Object.freeze(['选项显示正常','可以输入文字']),
    testDoneTitle:'互动测试已完成',testDoneBody:'答案已对应原始请求并成功接收。',testNoticeTitle:'Zeta 通知测试',testNoticeBody:'通知管道已收到测试消息。',
    // Every label the Windows card draws. The host sends this block with each
    // show so native/notify.ps1 needs no dictionary of its own.
    native:Object.freeze({header:'Zeta 通知',defaultTitle:'DSH 通知',questionPrefix:'问题 ',custom:'其他／补充',submit:'送出回答',later:'稍后处理',submitted:'已送出，等待确认…',allowOnce:'允许一次',reject:'拒绝',close:'关闭',
      pleaseComplete:'请完成「',closingQuote:'」。',exclusive:'单选题请选择选项或填写其他，不能同时使用。',customTooLong:'补充文字不可超过 16000 字元。',lastError:'上次送出未通过：',tool:'工具：',reason:'原因：'}),
    // Request validation the page can surface through /answer, /settings and the other routes.
    errors:Object.freeze({settingsNotObject:'设置必须是对象',eventSettingsInvalid:'事件设置无效',eventToggleInvalid:'事件开关无效',settingUnsupported:'不支持的设置',
      answerAll:'请回答每一道问题',answerIdInvalid:'回答识别码无效',answerSelectionInvalid:'回答选项无效',answerUnknownOption:'回答包含未知选项',customMustBeText:'自由回答必须是文字',customTooLong:'自由回答超过 16000 字元',answerRequired:'请选择选项或输入回答',singleChoiceOnly:'单选问题只能选一项或填写自由回答',
      answerPayloadInvalid:'回答格式无效',decisionInvalid:'只能明确允许这次或拒绝',kindInvalid:'通知类型无效',
      reauth:'请重新登录 DSH',untrustedOrigin:'请求来源不受信任',methodNotAllowed:'不支持的 HTTP 方法',sameOriginOnly:'只接受同来源操作',serviceError:'通知服务发生错误',tooManyStreams:'通知连接数已达上限',settingsSaveFailed:'无法保存通知设置',visibilityInvalid:'页面状态无效',tooManyPages:'页面数量已达上限',testKindInvalid:'测试类型无效',
      jsonRequired:'需要 JSON 请求',bodyTooLarge:'请求内容过大',jsonInvalid:'JSON 格式无效'}),
  }),
  en:Object.freeze({
    events:Object.freeze({completed:'Task completed',error:'Run failed',aborted:'Task aborted',interrupted:'Task interrupted',blocked:'Task blocked',maxTokens:'Output limit reached',approval:'Waiting for approval',question:'Waiting for an answer',planReview:'Waiting for plan review',compaction:'Context compacted',jobCompleted:'Background job finished',jobFailed:'Background job failed',jobKilled:'Background job stopped',goal:'Goal status changed'}),
    compactionFailed:'Context compaction failed',goalPaused:'Goal paused',goalCompleted:'Goal completed',goalBlocked:'Goal blocked',jobFallback:'Background job',
    settingsReadFailed:'Could not read the notification settings; the defaults are in use',nativeLaunchFailed:'The Windows card could not start',nativeStaleAnswer:'A stale card answer was ignored',nativeUnavailable:'Windows cards are unavailable; waiting requests go back to DSH',
    fallbackTitle:'Interaction moved back to DSH',fallbackBody:'Unanswered interactive requests were handed back to DSH. Return to DSH to continue.',
    testQuestionTitle:'Interactive question test',testApprovalTitle:'One-time approval test',testBody:'This is a notification plugin test; it runs no command and calls no model.',testReason:'It only confirms that a card can return a one-time decision; no file is modified.',testApprovalDetail:'Simulated approval: no tool or command will run.',
    testChoiceQuestion:'Pick an option, or type your own answer.',testChoiceOptions:Object.freeze(['Interaction works','Needs adjustment']),testMultiQuestion:'Test multiple choice; free text can be added too.',testMultiOptions:Object.freeze(['Options render correctly','Text input works']),
    testDoneTitle:'Interactive test finished',testDoneBody:'The answer was matched to its original request and received.',testNoticeTitle:'Zeta Notify test',testNoticeBody:'The notification channel received the test message.',
    // Every label the Windows card draws. The host sends this block with each
    // show so native/notify.ps1 needs no dictionary of its own.
    native:Object.freeze({header:'Zeta Notify',defaultTitle:'DSH notification',questionPrefix:'Question ',custom:'Other / more',submit:'Send answer',later:'Later',submitted:'Sent; waiting for confirmation…',allowOnce:'Allow once',reject:'Reject',close:'Close',
      pleaseComplete:'Answer “',closingQuote:'”.',exclusive:'A single-choice question takes one option or free text, not both.',customTooLong:'The free-text answer cannot exceed 16000 characters.',lastError:'The last answer was not accepted: ',tool:'Tool: ',reason:'Reason: '}),
    // Request validation the page can surface through /answer, /settings and the other routes.
    errors:Object.freeze({settingsNotObject:'Settings must be an object',eventSettingsInvalid:'Invalid event settings',eventToggleInvalid:'Invalid event switch',settingUnsupported:'Unsupported setting',
      answerAll:'Answer every question',answerIdInvalid:'Invalid answer id',answerSelectionInvalid:'Invalid answer selection',answerUnknownOption:'The answer contains an unknown option',customMustBeText:'A free-text answer must be text',customTooLong:'The free-text answer is longer than 16000 characters',answerRequired:'Select an option or type an answer',singleChoiceOnly:'A single-choice question takes one option or free text, not both',
      answerPayloadInvalid:'Invalid answer format',decisionInvalid:'Only an explicit allow-once or reject is accepted',kindInvalid:'Invalid notification kind',
      reauth:'Sign in to DSH again',untrustedOrigin:'The request origin is not trusted',methodNotAllowed:'Unsupported HTTP method',sameOriginOnly:'Only same-origin requests are accepted',serviceError:'The notification service failed',tooManyStreams:'Too many notification connections',settingsSaveFailed:'Could not save the notification settings',visibilityInvalid:'Invalid page state',tooManyPages:'Too many pages',testKindInvalid:'Invalid test type',
      jsonRequired:'A JSON request is required',bodyTooLarge:'The request body is too large',jsonInvalid:'Invalid JSON'}),
  }),
});
/** Host dictionary for a resolved language id; anything but English reads Chinese. */
export function hostStrings(language) { return String(language||'').toLowerCase().startsWith('en')?HOST_STRINGS.en:HOST_STRINGS.zh; }
/** Kind registry and the Chinese titles; kept as the validation surface for event kinds. */
export const EVENT_LABELS = HOST_STRINGS.zh.events;
export function defaultSettings() {
  return {enabled:true,native:true,browser:true,sound:true,backgroundOnly:true,preview:true,includeSubagents:false,events:Object.fromEntries(Object.keys(EVENT_LABELS).map(k=>[k,true]))};
}
export function failure(message,status=400,code) { return Object.assign(new Error(message),{status,...(code?{code}: {})}); }
/** Request-validation failure whose message is resolved in the host language at throw time. */
export function failureIn(language,key,status=400,code) { return failure(hostStrings(language).errors[key],status,code); }
const record=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const clone=value=>structuredClone(value);
function text(value,max=16000) { return typeof value==='string'?value.slice(0,max):''; }
export function validateSettings(patch,current=defaultSettings(),language='zh') {
  if(!record(patch))throw failureIn(language,'settingsNotObject');
  const next=clone(current);
  for(const [key,value] of Object.entries(patch)) {
    if(key==='events') {
      if(!record(value))throw failureIn(language,'eventSettingsInvalid');
      for(const [kind,enabled] of Object.entries(value)) {
        if(!Object.hasOwn(EVENT_LABELS,kind)||typeof enabled!=='boolean')throw failureIn(language,'eventToggleInvalid');
        next.events[kind]=enabled;
      }
    } else {
      if(!Object.hasOwn(defaultSettings(),key)||typeof value!=='boolean')throw failureIn(language,'settingUnsupported');
      next[key]=value;
    }
  }
  return next;
}
function validateQuestions(questions) {
  if(!Array.isArray(questions)||questions.length<1||questions.length>20)throw failure('问题数量不支持');
  const seen=new Set();
  for(const q of questions) {
    if(!record(q)||typeof q.id!=='string'||!q.id||q.id.length>512||seen.has(q.id)||typeof q.question!=='string')throw failure('问题格式无效');
    seen.add(q.id);
    if(q.options!==undefined&&(!Array.isArray(q.options)||q.options.length>100||q.options.some(o=>!record(o)||typeof o.label!=='string'||!o.label)))throw failure('选项格式无效');
    const labels=(q.options??[]).map(o=>o.label);
    if(new Set(labels).size!==labels.length)throw failure('选项不得重复');
    if(q.intent&&(q.intent.kind!=='plan-review'||!(q.options??[]).some(o=>o.label===q.intent.approve)||typeof q.detail!=='string'))throw failure('计画审阅格式无效');
  }
  if(Buffer.byteLength(JSON.stringify(questions))>96000)throw failure('问题内容超过通知中心限制');
  return clone(questions);
}
export function validateAnswers(questions,answers,language='zh') {
  if(!Array.isArray(answers)||answers.length!==questions.length)throw failureIn(language,'answerAll');
  const byId=new Map();
  for(const answer of answers) {
    if(!record(answer)||typeof answer.id!=='string'||byId.has(answer.id))throw failureIn(language,'answerIdInvalid');
    byId.set(answer.id,answer);
  }
  return questions.map(q=>{
    const a=byId.get(q.id);
    if(!a||!Array.isArray(a.selected)||a.selected.some(s=>typeof s!=='string')||new Set(a.selected).size!==a.selected.length)throw failureIn(language,'answerSelectionInvalid');
    const allowed=new Set((q.options??[]).map(o=>o.label));
    if(a.selected.some(s=>!allowed.has(s)))throw failureIn(language,'answerUnknownOption');
    if(a.custom!==undefined&&typeof a.custom!=='string')throw failureIn(language,'customMustBeText');
    const custom=a.custom?.trim();
    if(custom?.length>16000)throw failureIn(language,'customTooLong');
    if(!a.selected.length&&!custom)throw failureIn(language,'answerRequired');
    if(!q.multiSelect&&(a.selected.length>1||(a.selected.length&&custom)))throw failureIn(language,'singleChoiceOnly');
    return {id:q.id,selected:[...a.selected],...(custom?{custom}: {})};
  });
}
function matches(left,right) {
  if(typeof left!=='string'||typeof right!=='string'||left.length!==right.length)return false;
  const a=Buffer.from(left),b=Buffer.from(right);
  return a.length===b.length&&timingSafeEqual(a,b);
}
export function createCenter({settings,clock=Date.now,maxHistory=200,language='zh',onChange=()=>{},onDeliver=()=>{},onSettle=()=>{}}={}) {
  const lang=()=>typeof language==='function'?language():language;
  const labels=()=>hostStrings(lang()).events;
  let preferences=settings?validateSettings(settings,undefined,lang()):defaultSettings();
  let revision=0,history=[];
  const pending=new Map();
  const emit=()=>{revision++;onChange();};
  const api={
    snapshot(){return {revision,settings:clone(preferences),history:clone(history),pending:[...pending.values()].map(p=>clone(p.event))};},
    updateSettings(patch){preferences=validateSettings(patch,preferences,lang());emit();return clone(preferences);},
    publish(input){
      if(!Object.hasOwn(EVENT_LABELS,input.kind))throw failureIn(lang(),'kindInvalid');
      const event={id:randomUUID(),sessionId:text(input.sessionId,512),kind:input.kind,title:text(input.title||labels()[input.kind],512),body:text(input.body,4000),createdAt:clock(),read:false,...(input.isTest?{isTest:true}:{}),...(input.channel?{channel:input.channel}:{}),...(input.origin?{origin:input.origin}:{})};
      if(input.detail)event.detail=text(input.detail,32000);
      history.unshift(event);history=history.slice(0,maxHistory);
      if(preferences.enabled&&preferences.events[event.kind]&&(preferences.includeSubagents||event.origin!=='subagent'))onDeliver(event,clone(preferences));
      emit();return event;
    },
    openRequest(input){
      if(pending.size>=32)throw failure('待处理请求已达上限',503);
      if(input.signal?.aborted)throw failure('问题已取消',409,'ASK_ABORTED');
      if(!['question','planReview','approval'].includes(input.kind)||typeof input.sessionId!=='string'||!input.sessionId)throw failure('互动请求无效');
      const questions=input.kind==='approval'?undefined:validateQuestions(input.questions);
      const event={id:randomUUID(),requestId:randomUUID(),token:randomBytes(24).toString('hex'),sessionId:input.sessionId,kind:input.kind,title:text(input.title||labels()[input.kind],512),body:text(input.body,4000),createdAt:clock(),read:false,...(questions?{questions}:{}),...(input.toolName?{toolName:text(input.toolName,512)}:{}),...(input.callId?{callId:text(input.callId,512)}:{}),...(input.reason?{reason:text(input.reason,32000)}:{}),...(input.detail?{detail:text(input.detail,32000)}:{}),...(input.isTest?{isTest:true}:{}),...(input.origin?{origin:input.origin}:{})};
      let resolve,reject;
      const promise=new Promise((yes,no)=>{resolve=yes;reject=no;});
      const abort=()=>api.cancel(event.id,'问题已取消');
      pending.set(event.id,{event,resolve,reject,signal:input.signal,abort,isCurrent:input.isCurrent});
      input.signal?.addEventListener('abort',abort,{once:true});
      const safe={...event};delete safe.token;delete safe.questions;
      history.unshift(safe);history=history.slice(0,maxHistory);
      if(preferences.enabled&&preferences.events[event.kind])onDeliver(event,clone(preferences));
      safe.nativeDelivered=Boolean(event.nativeDelivered);
      emit();return {event,promise};
    },
    respond(payload){
      if(!record(payload))throw failureIn(lang(),'answerPayloadInvalid');
      const item=pending.get(payload.id);
      if(!item||item.event.sessionId!==payload.sessionId||item.event.requestId!==payload.requestId||!matches(item.event.token,payload.token))throw failure('这个请求已失效，请更新待办',409);
      if(item.signal?.aborted){api.cancel(payload.id);throw failure('这个请求已取消',409);}
      if(item.isCurrent&&!item.isCurrent()){api.cancel(payload.id);throw failure('原本的会话已结束，请更新待办',409);}
      let result;
      if(item.event.kind==='approval') {
        if(!['allowed-once','rejected'].includes(payload.decision))throw failureIn(lang(),'decisionInvalid');
        result=payload.decision;
      } else result={answers:validateAnswers(item.event.questions,payload.answers,lang())};
      pending.delete(payload.id);item.signal?.removeEventListener('abort',item.abort);
      const h=history.find(e=>e.id===payload.id);if(h){h.resolved=true;h.read=true;h.resolvedAt=clock();}
      onSettle(item.event);item.resolve(result);emit();return {ok:true};
    },
    cancel(id,message='问题已取消'){
      const item=pending.get(id);if(!item)return false;
      pending.delete(id);item.signal?.removeEventListener('abort',item.abort);
      const h=history.find(e=>e.id===id);if(h){h.cancelled=true;h.read=true;}
      onSettle(item.event);item.reject(failure(message,409,'ASK_ABORTED'));emit();return true;
    },
    markRead(id){const e=history.find(e=>e.id===id);if(e)e.read=true;emit();},
    clearHistory(){history=history.filter(e=>pending.has(e.id));emit();},
    prune(){for(const [id,item] of pending)if(item.isCurrent&&!item.isCurrent())api.cancel(id,'原本的会话已结束');},
    markNative(id,value){const p=pending.get(id);if(p)p.event.nativeDelivered=value;const h=history.find(e=>e.id===id);if(h)h.nativeDelivered=value;emit();},
    dispose(){for(const id of [...pending.keys()])api.cancel(id,'通知插件已停止');},
  };
  return api;
}
export function normalizeSessionEvent(session,event,language='zh') {
  const s=hostStrings(language),EVENT_LABELS=s.events;
  const sessionId=String(session?.id??session?.header?.id??'');
  if(!sessionId)return null;
  const base={sessionId,origin:session?.header?.origin,body:text(session?.header?.title||sessionId,512)};
  if(event?.type==='turn/end') {
    const kind=({'completed':'completed','error':'error','aborted':'aborted','interrupted':'interrupted','blocked':'blocked','max-tokens':'maxTokens'})[event.data?.reason?.kind];
    return kind?{...base,kind,title:EVENT_LABELS[kind],detail:text(event.data?.reason?.message||event.data?.reason?.error?.message),dedupKey:`${sessionId}:turn:${event.data?.turn}:${kind}`} :null;
  }
  if(event?.type==='compaction/end')return {...base,kind:event.data?.error?'error':'compaction',title:event.data?.error?s.compactionFailed:EVENT_LABELS.compaction,dedupKey:`${sessionId}:compact:${event.seq??event.timestamp??''}`};
  if(event?.type==='goal/change'&&['complete','completed','blocked','paused'].includes(event.data?.goal?.status??event.data?.status))return {...base,kind:'goal',title:EVENT_LABELS.goal};
  return null;
}
