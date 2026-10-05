window.__ModuleLoader__.load({
  id: 'dsh-notify-card',
  factory: (require) => {
    const module = { exports: {} }
    const exports = module.exports
    const React = require('react')
    const h = React.createElement

    const PREFIX = '/__dsh/notify-card'
    const STYLE_ID = 'dsh-notify-card-style'

    // Every user-facing string of the page. `zh` keeps the original Traditional
    // Chinese wording; the active dictionary follows the dsh UI language.
    const STRINGS = {
      en: {
        dateLocale: 'en-US',
        title: 'Zeta Notify',
        subtitle: 'Review notices, answer questions, or handle them straight from the Windows cards.',
        events: {
          completed: 'Task completed',
          error: 'Run error',
          aborted: 'Task aborted',
          interrupted: 'Task interrupted',
          blocked: 'Task blocked',
          maxTokens: 'Token limit reached',
          approval: 'Waiting for approval',
          question: 'Waiting for an answer',
          planReview: 'Plan review needed',
          compaction: 'Context compacted',
          jobCompleted: 'Background job finished',
          jobFailed: 'Background job failed',
          jobKilled: 'Background job stopped',
          goal: 'Goal status changed',
        },
        tests: {
          native: 'Test the Windows card',
          browser: 'Test browser notifications',
          question: 'Test an interactive question',
          approval: 'Test a one-time approval',
        },
        permission: { granted: 'granted', default: 'not granted', denied: 'blocked', unsupported: 'unsupported' },
        notifyFallbackTitle: 'DSH notification',
        notifyHidden: 'A new DSH notification is waiting. Open DSH to read it.',
        notifyBodyFallback: 'Open DSH to read it.',
        nativeFailing: (detail) => `Windows card problem: ${detail}`,
        nativeReady: 'Windows cards are available',
        nativeNotReady: 'Windows cards are not ready yet',
        errorAuth: 'Your DSH session is no longer valid. Reload DSH and try again.',
        errorStale: 'That request was already handled or has expired; the notification center has been refreshed.',
        errorFailed: (detail) => `Action failed: ${detail}`,
        errorGeneric: 'Action failed. Check the DSH connection and try again.',
        errorNoFetch: 'This browser cannot reach the DSH notification service',
        errorOffline: 'DSH is offline',
        errorNotifyFailed: (detail) => `Browser notification failed: ${detail}`,
        errorBadStream: 'Received a notification update that could not be parsed. Reload DSH.',
        settingsSaved: 'Settings saved.',
        invalidDecision: 'Invalid approval choice.',
        allowedOnce: 'Allowed this once.',
        rejected: 'Rejected.',
        answerSent: 'Answer sent.',
        unknownTest: 'Unknown test type.',
        notifyUnsupported: 'This browser does not support system notifications.',
        permissionMissing: 'Browser notifications are not allowed yet. Enable them in the site settings next to the address bar.',
        permissionFailed: (detail) => `Could not obtain browser notification permission: ${detail}`,
        testSent: (label) => `${label}: test sent.`,
        markedRead: 'Marked as read.',
        historyCleared: 'Recent notices cleared.',
        permissionGranted: 'Browser notifications are allowed.',
        permissionNotGranted: 'Browser notifications are not allowed.',
        answerUnknownOption: (id) => `Question ${id} contains an option that does not exist`,
        answerMissing: (id) => `Question ${id} has no answer yet`,
        answerConflict: (id) => `Question ${id} takes either one option or free text, not both`,
        answerTooLong: (id) => `The free text of question ${id} is longer than 16000 characters`,
        loading: 'Loading notification settings and inbox…',
        connected: 'Live',
        connecting: 'Connecting',
        disconnected: 'Disconnected',
        pendingCount: (count) => `${count} waiting`,
        unreadCount: (count) => `${count} unread`,
        pendingTitle: (count) => `Waiting (${count})`,
        pendingDesc: 'Once you answer, the same card closes on every other screen.',
        pendingEmpty: 'No question or approval is waiting.',
        pendingFallbackTitle: 'Waiting',
        openSession: 'Open session',
        toolLine: (tool, reason) => `Tool: ${tool}${reason ? ` · ${reason}` : ''}`,
        allowOnce: 'Allow once',
        reject: 'Reject',
        submitAll: 'Send all answers',
        submit: 'Send answer',
        otherReply: 'Other reply (optional)',
        reply: 'Reply',
        channelTitle: 'Delivery',
        channelDesc: 'Settings are saved automatically.',
        toggleEnabled: 'Enable Zeta Notify',
        toggleNative: 'Windows cards',
        toggleBrowser: 'Browser system notifications',
        togglePermission: (state) => `Permission: ${state}`,
        toggleSound: 'Sound',
        toggleSoundDesc: 'Play a sound with each notice. Windows cards use the system volume.',
        toggleBackgroundOnly: 'Skip ordinary notices for the session on screen',
        toggleBackgroundOnlyDesc: 'Questions and approvals are still delivered.',
        togglePreview: 'Show a content preview in notifications',
        togglePreviewDesc: 'Ordinary notices can hide their content; interactive cards keep the question and approval details.',
        toggleIncludeSubagents: 'Include child-agent events',
        toggleIncludeSubagentsDesc: 'Multi-agent work can produce many more notices.',
        permissionButton: 'Browser permission',
        triggerTitle: 'Triggers',
        triggerDesc: 'Switch off what you do not want to hear about; the host keeps its current settings.',
        testTitle: 'Test notifications',
        testDesc: 'Interactive tests create a safe demo card and never run a real tool.',
        historyTitle: 'Recent notices',
        historyDesc: (total, unread) => `${total} records, ${unread} unread.`,
        filter: 'Filter',
        filterAll: 'All',
        filterUnread: 'Unread',
        clearHistory: 'Clear recent notices',
        markRead: 'Mark as read',
        unread: 'Unread',
        historyEmpty: 'No notices recorded yet.',
        filterEmpty: 'No notice matches this filter.',
      },
      zh: {
        dateLocale: 'zh-TW',
        title: 'Zeta 通知',
        subtitle: '在这里查看通知、回答问题，或使用 Windows 浮窗直接处理。',
        events: {
          completed: '任务完成',
          error: '执行错误',
          aborted: '任务中止',
          interrupted: '任务被中断',
          blocked: '任务受到阻塞',
          maxTokens: '已达 Token 上限',
          approval: '等待批准',
          question: '等待回答',
          planReview: '等待检查计画',
          compaction: '内容已压缩',
          jobCompleted: '背景工作完成',
          jobFailed: '背景工作失败',
          jobKilled: '背景工作已终止',
          goal: '目标状态更新',
        },
        tests: {
          native: '测试 Windows 浮窗',
          browser: '测试浏览器通知',
          question: '测试互动问题',
          approval: '测试一次性批准',
        },
        permission: { granted: '已允许', default: '尚未允许', denied: '已封锁', unsupported: '不支持' },
        notifyFallbackTitle: 'DSH 通知',
        notifyHidden: '有新的 DSH 通知，请打开 DSH 查看。',
        notifyBodyFallback: '请打开 DSH 查看。',
        nativeFailing: (detail) => `Windows 浮窗异常：${detail}`,
        nativeReady: 'Windows 浮窗可用',
        nativeNotReady: 'Windows 浮窗尚未就绪',
        errorAuth: '登录或验证状态已失效，请重新整理 DSH 后再试。',
        errorStale: '这个要求已经处理或失效，已重新整理通知中心。',
        errorFailed: (detail) => `操作失败：${detail}`,
        errorGeneric: '操作失败，请检查 DSH 连接后再试。',
        errorNoFetch: '浏览器无法连到 DSH 通知服务',
        errorOffline: 'DSH 目前离线',
        errorNotifyFailed: (detail) => `浏览器通知失败：${detail}`,
        errorBadStream: '收到无法解析的通知更新，请重新整理 DSH。',
        settingsSaved: '设置已保存。',
        invalidDecision: '无效的批准选项。',
        allowedOnce: '已允许这一次。',
        rejected: '已拒绝。',
        answerSent: '回答已送出。',
        unknownTest: '未知的测试类型。',
        notifyUnsupported: '目前浏览器不支持系统通知。',
        permissionMissing: '浏览器通知权限尚未允许，请在地址栏的网站设置中打开。',
        permissionFailed: (detail) => `无法取得浏览器通知权限：${detail}`,
        testSent: (label) => `${label}：测试已送出。`,
        markedRead: '已标示为已读。',
        historyCleared: '最近通知已清除。',
        permissionGranted: '浏览器通知权限已允许。',
        permissionNotGranted: '浏览器通知权限尚未允许。',
        answerUnknownOption: (id) => `问题 ${id} 含有不存在的选项`,
        answerMissing: (id) => `问题 ${id} 尚未回答`,
        answerConflict: (id) => `问题 ${id} 的单选与自由回答只能择一`,
        answerTooLong: (id) => `问题 ${id} 的自由回答超过 16000 字元`,
        loading: '正在读取通知设置与收件匣…',
        connected: '即时连接',
        connecting: '正在连接',
        disconnected: '连接中断',
        pendingCount: (count) => `${count} 件待处理`,
        unreadCount: (count) => `${count} 则未读`,
        pendingTitle: (count) => `待处理（${count}）`,
        pendingDesc: '回答送出后，其他画面的同一张卡片会自动关闭。',
        pendingEmpty: '目前没有等待回答或批准的要求。',
        pendingFallbackTitle: '等待处理',
        openSession: '打开对话',
        toolLine: (tool, reason) => `工具：${tool}${reason ? ` · ${reason}` : ''}`,
        allowOnce: '仅允许这一次',
        reject: '拒绝',
        submitAll: '送出全部回答',
        submit: '送出回答',
        otherReply: '其他回覆（选填）',
        reply: '回覆',
        channelTitle: '通知方式',
        channelDesc: '设置会自动保存。',
        toggleEnabled: '启用 Zeta 通知',
        toggleNative: 'Windows 浮窗',
        toggleBrowser: '浏览器系统通知',
        togglePermission: (state) => `权限：${state}`,
        toggleSound: '提示音',
        toggleSoundDesc: '提醒时播放提示音。Windows 浮窗使用系统音量。',
        toggleBackgroundOnly: '目前会话在眼前时，略过一般提醒',
        toggleBackgroundOnlyDesc: '待回答／批准仍会保留。',
        togglePreview: '在通知中显示内容预览',
        togglePreviewDesc: '一般提醒可隐藏内容；互动卡片保留题目与批准内容。',
        toggleIncludeSubagents: '包含子代理事件',
        toggleIncludeSubagentsDesc: '可能在多代理工作时产生较多通知。',
        permissionButton: '设置浏览器权限',
        triggerTitle: '通知时机',
        triggerDesc: '只调整需要提醒的事件；主机保留目前的实际设置。',
        testTitle: '测试通知',
        testDesc: '互动测试会建立安全的测试卡片，不会执行真实工具。',
        historyTitle: '最近通知',
        historyDesc: (total, unread) => `${total} 则纪录，其中 ${unread} 则未读。`,
        filter: '筛选',
        filterAll: '全部',
        filterUnread: '未读',
        clearHistory: '清除最近通知',
        markRead: '标示已读',
        unread: '未读',
        historyEmpty: '尚无通知纪录。',
        filterEmpty: '这个筛选条件目前没有通知。',
      },
    }
    const EVENT_FIELDS = Object.keys(STRINGS.en.events)
    const TEST_FIELDS = Object.keys(STRINGS.en.tests)

    /** Pick the dictionary for the active locale; anything not Chinese reads English. */
    function pickStrings(localeId) {
      return String(localeId || '').toLowerCase().startsWith('zh') ? STRINGS.zh : STRINGS.en
    }

    /** Read the active locale id from the client context; English when absent. */
    function localeIdOf(ctx) {
      const locale = ctx && ctx.locale
      if (!locale || typeof locale.getSnapshot !== 'function') return 'en'
      const snapshot = locale.getSnapshot()
      return (snapshot && snapshot.active) || 'en'
    }

    /** Subscribe to the locale runtime when it exists; otherwise stay English. */
    function useStrings(ctx) {
      const locale = ctx && ctx.locale
      const subscribe = React.useCallback(
        (listener) => (locale && typeof locale.subscribe === 'function' ? locale.subscribe(listener) : () => {}),
        [locale],
      )
      const getSnapshot = React.useCallback(() => localeIdOf(ctx), [locale])
      return pickStrings(React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot))
    }

    const CSS = `
.zeta_notify{display:flex;flex-direction:column;gap:18px;min-width:0;padding:2px 0 28px;color:var(--dsw-alias-label-primary);font-size:14px;line-height:1.5}
.zeta_notify *{box-sizing:border-box}
.zeta_notify_header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap}
.zeta_notify_title{margin:0;font-size:20px;line-height:28px;font-weight:650;text-wrap:balance}
.zeta_notify_subtitle{margin:3px 0 0;max-width:70ch;color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:20px;text-wrap:pretty}
.zeta_notify_summary{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.zeta_notify_badge{display:inline-flex;align-items:center;min-height:24px;padding:2px 9px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font-size:12px}
.zeta_notify_badge[data-state="connected"]{color:var(--dsw-alias-state-success-primary);background:var(--dsw-alias-state-success-tertiary)}
.zeta_notify_badge[data-state="disconnected"],.zeta_notify_badge[data-state="error"]{color:var(--dsw-alias-state-error-primary);background:var(--dsw-alias-interactive-bg-hover-danger)}
.zeta_notify_message{padding:10px 12px;border:1px solid var(--dsw-alias-border-l2);border-radius:9px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font-size:13px;overflow-wrap:anywhere}
.zeta_notify_message[data-error="true"]{color:var(--dsw-alias-state-error-primary);background:var(--dsw-alias-interactive-bg-hover-danger)}
.zeta_notify_section{display:flex;flex-direction:column;gap:10px;min-width:0;padding-top:2px}
.zeta_notify_sectionHead{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding-bottom:8px;border-bottom:1px solid var(--dsw-alias-border-l1)}
.zeta_notify_sectionTitle{margin:0;font-size:15px;line-height:22px;font-weight:650}
.zeta_notify_sectionDesc{margin:2px 0 0;max-width:70ch;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}
.zeta_notify_panel{display:flex;flex-direction:column;gap:12px;padding:14px;border:1px solid var(--dsw-alias-border-l2);border-radius:12px;background:var(--dsw-alias-bg-layer-1)}
.zeta_notify_toggleGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:8px 18px}
.zeta_notify_toggle{display:flex;align-items:flex-start;gap:9px;min-width:0;padding:5px 0;cursor:pointer}
.zeta_notify_toggle input{width:17px;height:17px;margin:2px 0 0;flex:none;accent-color:var(--dsw-alias-brand-primary);cursor:pointer}
.zeta_notify_toggle input:focus-visible,.zeta_notify_option input:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}
.zeta_notify_toggleText{display:flex;flex-direction:column;min-width:0}
.zeta_notify_toggleLabel{color:var(--dsw-alias-label-primary);font-size:13px;line-height:20px}
.zeta_notify_toggleDesc{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}
.zeta_notify_inline{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.zeta_notify_statusText{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px;overflow-wrap:anywhere}
.zeta_notify_button{display:inline-flex;align-items:center;justify-content:center;min-height:34px;padding:6px 13px;border:1px solid var(--dsw-alias-border-l2);border-radius:9px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:18px;cursor:pointer;transition:background .16s ease,color .16s ease,border-color .16s ease,opacity .16s ease}
.zeta_notify_button:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}
.zeta_notify_button:focus-visible,.zeta_notify_select:focus-visible,.zeta_notify_text:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}
.zeta_notify_button:disabled{opacity:.5;cursor:wait}
.zeta_notify_button[data-primary="true"]{border-color:transparent;background:var(--dsw-alias-button-primary-fill);color:var(--dsw-alias-label-primary-inverted)}
.zeta_notify_button[data-primary="true"]:hover:not(:disabled){background:var(--dsw-alias-button-primary-hover)}
.zeta_notify_button[data-danger="true"]{color:var(--dsw-alias-state-error-primary)}
.zeta_notify_pending{display:flex;flex-direction:column;gap:12px}
.zeta_notify_card{display:flex;flex-direction:column;gap:12px;min-width:0;padding:15px;border:1px solid var(--dsw-alias-border-l2);border-radius:12px;background:var(--dsw-alias-bg-layer-1);box-shadow:var(--dsw-shadow-lv1)}
.zeta_notify_cardHead{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.zeta_notify_cardTitle{margin:0;font-size:15px;line-height:22px;font-weight:650;overflow-wrap:anywhere}
.zeta_notify_cardMeta{margin-top:2px;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}
.zeta_notify_body{max-width:72ch;margin:0;color:var(--dsw-alias-label-secondary);white-space:pre-wrap;overflow-wrap:anywhere}
.zeta_notify_detail{max-height:260px;overflow:auto;padding:10px 12px;border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font-family:var(--dsw-font-mono);font-size:12px;line-height:18px;white-space:pre-wrap;overflow-wrap:anywhere}
.zeta_notify_question{min-width:0;margin:0;padding:12px;border:1px solid var(--dsw-alias-border-l1);border-radius:10px}
.zeta_notify_question legend{max-width:100%;padding:0 5px;color:var(--dsw-alias-label-primary);font-weight:600;overflow-wrap:anywhere}
.zeta_notify_questionDetail{margin:0 0 8px;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px;white-space:pre-wrap}
.zeta_notify_options{display:flex;flex-direction:column;gap:7px}
.zeta_notify_option{display:flex;align-items:flex-start;gap:8px;min-width:0;cursor:pointer}
.zeta_notify_option input{margin:3px 0 0;flex:none;accent-color:var(--dsw-alias-brand-primary)}
.zeta_notify_optionText{display:flex;flex-direction:column;min-width:0}
.zeta_notify_optionDesc{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}
.zeta_notify_text{width:100%;min-height:72px;margin-top:9px;padding:8px 10px;resize:vertical;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px}
.zeta_notify_empty{padding:16px 0;color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:20px;text-align:center}
.zeta_notify_historyTools{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.zeta_notify_select{min-height:34px;padding:5px 30px 5px 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:9px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px}
.zeta_notify_history{display:flex;flex-direction:column;border-top:1px solid var(--dsw-alias-border-l1)}
.zeta_notify_historyRow{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;min-width:0;padding:11px 2px;border-bottom:1px solid var(--dsw-alias-border-l1)}
.zeta_notify_historyText{min-width:0;flex:1}
.zeta_notify_historyTitle{display:flex;align-items:center;gap:7px;min-width:0;font-weight:600;overflow-wrap:anywhere}
.zeta_notify_unread{width:7px;height:7px;border-radius:50%;flex:none;background:var(--dsw-alias-state-business-primary)}
.zeta_notify_historyBody{margin-top:2px;max-width:72ch;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px;white-space:pre-wrap;overflow-wrap:anywhere}
.zeta_notify_historyActions{display:flex;gap:6px;flex:none;flex-wrap:wrap;justify-content:flex-end}
@media(max-width:640px){.zeta_notify_cardHead,.zeta_notify_historyRow{flex-direction:column}.zeta_notify_historyActions{justify-content:flex-start}.zeta_notify_button{min-height:40px}.zeta_notify_toggleGrid{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){.zeta_notify_button{transition:none}}
`

    function effectiveHidden(doc) {
      if (!doc) return true
      const unfocused = typeof doc.hasFocus === 'function' ? !doc.hasFocus() : false
      return Boolean(doc.hidden) || unfocused
    }

    function eventSettingKey(kind) {
      const aliases = {
        'max-tokens': 'maxTokens',
        'plan-review': 'planReview',
        'job-completed': 'jobCompleted',
        'job-failed': 'jobFailed',
        'job-killed': 'jobKilled',
      }
      return aliases[kind] || kind
    }

    function isOwnedPending(event) {
      return Boolean(event && event.requestId)
    }

    function browserDeliveryDecision(settings, event, environment) {
      if (!settings || !event || !environment) return false
      if (event.resolved === true || event.cancelled === true) return false
      if (!settings.enabled || !settings.browser) return false
      if (environment.permission !== 'granted') return false
      const key = eventSettingKey(event.kind)
      if (!settings.events || settings.events[key] !== true) return false
      if (!settings.includeSubagents && (event.origin === 'subagent' || event.isSubagent === true)) return false
      const browserTest = event.isTest === true && event.channel === 'browser'
      if (event.nativeDelivered === true && !browserTest) return false
      if (settings.backgroundOnly
        && !isOwnedPending(event)
        && !environment.hidden
        && environment.currentSessionId === event.sessionId) return false
      return true
    }

    function notificationTitle(settings, event, t = STRINGS.en) {
      const label = t.events[eventSettingKey(event.kind)] || t.notifyFallbackTitle
      return settings && settings.preview !== false && event.title ? String(event.title) : label
    }

    function notificationBody(settings, event, t = STRINGS.en) {
      if (!settings || settings.preview === false) return t.notifyHidden
      return String(event.body || event.detail || t.events[eventSettingKey(event.kind)] || t.notifyBodyFallback)
    }

    function nativeStatus(native, t = STRINGS.en) {
      if (native && native.error) return { text: t.nativeFailing(native.error), error: true }
      if (native && native.available) return { text: t.nativeReady, error: false }
      return { text: t.nativeNotReady, error: false }
    }

    function eventSettingsPatch(key, checked) {
      return { events: { [key]: checked } }
    }

    function eventList(snapshot) {
      const unique = new Map()
      for (const item of [...(snapshot.history || []), ...(snapshot.pending || [])]) {
        if (item && typeof item.id === 'string') unique.set(item.id, item)
      }
      return [...unique.values()]
    }

    function exactIdentity(event) {
      return {
        id: event.id,
        ...(event.requestId ? { requestId: event.requestId } : {}),
        ...(event.token ? { token: event.token } : {}),
        ...(event.sessionId ? { sessionId: event.sessionId } : {}),
      }
    }

    function buildAnswerPayload(event, draft, t = STRINGS.en) {
      const questions = Array.isArray(event.questions) ? event.questions : []
      const answers = questions.map((question) => {
        const value = draft && draft[question.id] ? draft[question.id] : {}
        let selected = Array.isArray(value.selected) ? value.selected.filter((item) => typeof item === 'string' && item !== '') : []
        if (!question.multiSelect && selected.length > 1) selected = selected.slice(0, 1)
        const labels = new Set((question.options || []).map((option) => option.label))
        if (selected.some((label) => !labels.has(label))) throw new Error(t.answerUnknownOption(question.id))
        const custom = typeof value.custom === 'string' ? value.custom.trim() : ''
        if (selected.length === 0 && custom === '') throw new Error(t.answerMissing(question.id))
        if (!question.multiSelect && selected.length > 0 && custom !== '') throw new Error(t.answerConflict(question.id))
        if (custom.length > 16000) throw new Error(t.answerTooLong(question.id))
        return { id: question.id, selected, ...(custom ? { custom } : {}) }
      })
      return { ...exactIdentity(event), answers }
    }

    class ClientHttpError extends Error {
      constructor(message, status) {
        super(message)
        this.name = 'ClientHttpError'
        this.status = status
      }
    }

    function friendlyError(error, t = STRINGS.en) {
      if (error && (error.status === 401 || error.status === 403)) return t.errorAuth
      if (error && error.status === 409) return t.errorStale
      if (error && error.message) return t.errorFailed(error.message)
      return t.errorGeneric
    }

    function createClientRuntime(options = {}) {
      // The runtime lives outside React, so every message resolves its dictionary
      // at use time through this accessor rather than at construction time.
      const getLocale = typeof options.getLocale === 'function' ? options.getLocale : () => 'en'
      const strings = () => pickStrings(getLocale())
      const browserWindow = options.window || (typeof window === 'undefined' ? undefined : window)
      const doc = options.document || (typeof document === 'undefined' ? undefined : document)
      const fetcher = options.fetch || (typeof fetch === 'undefined' ? undefined : fetch.bind(globalThis))
      const EventSourceApi = options.EventSource || (typeof EventSource === 'undefined' ? undefined : EventSource)
      const NotificationApi = Object.prototype.hasOwnProperty.call(options, 'NotificationApi')
        ? options.NotificationApi
        : (typeof Notification === 'undefined' ? undefined : Notification)
      const sessions = options.sessions
      const makeInterval = options.setInterval || (typeof setInterval === 'undefined' ? undefined : setInterval)
      const dropInterval = options.clearInterval || (typeof clearInterval === 'undefined' ? undefined : clearInterval)
      const randomUUID = options.randomUUID
        || (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function' ? () => crypto.randomUUID() : () => `zeta-${Date.now()}-${Math.random().toString(16).slice(2)}`)
      const clientId = randomUUID()
      let state = { snapshot: null, connection: 'loading', message: null, pendingAction: null }
      let listeners = new Set()
      let seen = new Set()
      let baselined = false
      let acceptedStateVersion = 0
      let currentInstanceId = null
      let stopped = false
      let source = null
      let heartbeat = null
      let sessionUnsubscribe = null
      let soundArmed = false
      const browserDelivered = new Set()
      const nativeFallbackCandidates = new Set()

      const emit = () => { for (const listener of [...listeners]) listener() }
      const setState = (patch) => { state = { ...state, ...patch }; emit() }
      const setMessage = (text, error = false) => setState({ message: { text, error } })

      async function request(path, method = 'GET', body) {
        if (typeof fetcher !== 'function') throw new ClientHttpError(strings().errorNoFetch, 0)
        let response
        try {
          response = await fetcher(PREFIX + path, {
            method,
            credentials: 'same-origin',
            cache: 'no-store',
            headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
            body: body === undefined ? undefined : JSON.stringify(body),
          })
        } catch (error) {
          throw new ClientHttpError(error && error.message ? error.message : strings().errorOffline, 0)
        }
        let payload = null
        try { payload = await response.json() } catch (_) {}
        if (!response.ok || !payload || payload.ok === false) {
          throw new ClientHttpError(payload && payload.error ? payload.error : `HTTP ${response.status}`, response.status)
        }
        return payload
      }

      function currentSessionId() {
        try {
          const list = sessions && sessions.list
          return list && typeof list.getSnapshot === 'function' ? list.getSnapshot().current : undefined
        } catch (_) {
          return undefined
        }
      }

      function playSound() {
        const AudioContextApi = options.AudioContextApi || (browserWindow && (browserWindow.AudioContext || browserWindow.webkitAudioContext))
        if (!soundArmed || typeof AudioContextApi !== 'function') return
        try {
          const audio = new AudioContextApi()
          const oscillator = audio.createOscillator()
          const gain = audio.createGain()
          oscillator.type = 'sine'
          oscillator.frequency.value = 740
          gain.gain.setValueAtTime(0.0001, audio.currentTime)
          gain.gain.exponentialRampToValueAtTime(0.08, audio.currentTime + 0.015)
          gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.16)
          oscillator.connect(gain)
          gain.connect(audio.destination)
          oscillator.start()
          oscillator.stop(audio.currentTime + 0.17)
          oscillator.addEventListener('ended', () => { void audio.close() }, { once: true })
        } catch (_) {}
      }

      function deliverBrowser(settings, event) {
        const permission = typeof NotificationApi === 'function' ? NotificationApi.permission : 'unsupported'
        const environment = {
          permission,
          hidden: effectiveHidden(doc),
          currentSessionId: currentSessionId(),
        }
        if (!browserDeliveryDecision(settings, event, environment)) return false
        try {
          const notice = new NotificationApi(notificationTitle(settings, event, strings()), {
            body: notificationBody(settings, event, strings()),
            tag: `dsh-zeta-${event.id}`,
            requireInteraction: isOwnedPending(event),
          })
          notice.onclick = () => {
            try { if (browserWindow && typeof browserWindow.focus === 'function') browserWindow.focus() } catch (_) {}
            try { if (event.sessionId && sessions && typeof sessions.open === 'function') sessions.open(event.sessionId) } catch (_) {}
            try { if (typeof notice.close === 'function') notice.close() } catch (_) {}
          }
          if (settings.sound) playSound()
          return true
        } catch (error) {
          setMessage(strings().errorNotifyFailed(error && error.message ? error.message : String(error)), true)
          return false
        }
      }

      function wasSuppressedOnlyByNative(settings, event) {
        if (event.nativeDelivered !== true || (event.isTest === true && event.channel === 'browser')) return false
        const permission = typeof NotificationApi === 'function' ? NotificationApi.permission : 'unsupported'
        return browserDeliveryDecision(settings, { ...event, nativeDelivered: false }, {
          permission,
          hidden: effectiveHidden(doc),
          currentSessionId: currentSessionId(),
        })
      }

      function acceptSnapshot(next, control = {}) {
        if (!next || typeof next !== 'object') return
        const nextInstanceId = typeof next.instanceId === 'string' ? next.instanceId : 'legacy'
        const previous = state.snapshot
        if (previous
          && currentInstanceId === nextInstanceId
          && typeof previous.revision === 'number'
          && typeof next.revision === 'number'
          && next.revision < previous.revision) return false
        const restarted = currentInstanceId !== null && currentInstanceId !== nextInstanceId
        if (restarted) {
          seen.clear()
          browserDelivered.clear()
          nativeFallbackCandidates.clear()
          baselined = false
        }
        const items = eventList(next)
        const seed = control.baseline === true || !baselined || restarted
        const fresh = seed ? [] : items.filter((item) => !seen.has(item.id))
        const fallback = seed ? [] : items.filter((item) => seen.has(item.id)
          && nativeFallbackCandidates.has(item.id)
          && item.nativeDelivered !== true)
        for (const item of items) seen.add(item.id)
        const current = new Set(items.map((item) => item.id))
        for (const id of [...seen]) if (!current.has(id)) seen.delete(id)
        for (const id of [...browserDelivered]) if (!current.has(id)) browserDelivered.delete(id)
        for (const id of [...nativeFallbackCandidates]) if (!current.has(id)) nativeFallbackCandidates.delete(id)
        baselined = true
        currentInstanceId = nextInstanceId
        acceptedStateVersion += 1
        setState({ snapshot: next })
        for (const item of fresh) {
          if (deliverBrowser(next.settings, item)) browserDelivered.add(item.id)
          else if (wasSuppressedOnlyByNative(next.settings, item)) nativeFallbackCandidates.add(item.id)
        }
        for (const item of fallback) {
          nativeFallbackCandidates.delete(item.id)
          if (!browserDelivered.has(item.id) && deliverBrowser(next.settings, item)) browserDelivered.add(item.id)
        }
        return true
      }

      async function refresh(control = {}) {
        const versionAtRequest = acceptedStateVersion
        try {
          const next = await request('/state')
          if (acceptedStateVersion !== versionAtRequest) return true
          acceptSnapshot(next, control)
          setState({ connection: 'connected' })
          return true
        } catch (error) {
          setState({ connection: 'error' })
          setMessage(friendlyError(error, strings()), true)
          return false
        }
      }

      async function mutate(path, body, successText, actionId) {
        setState({ pendingAction: actionId, message: null })
        try {
          const result = await request(path, 'POST', body)
          if (result.snapshot) acceptSnapshot(result.snapshot)
          else if (result.settings && state.snapshot) acceptSnapshot({ ...state.snapshot, settings: result.settings })
          setState({ pendingAction: null })
          if (successText) setMessage(successText, false)
          return true
        } catch (error) {
          setState({ pendingAction: null })
          setMessage(friendlyError(error, strings()), true)
          if (error && error.status === 409) await refresh()
          return false
        }
      }

      async function updateSettings(patch) {
        const ok = await mutate('/settings', { patch }, strings().settingsSaved, 'settings')
        if (ok && state.snapshot) {
          const merged = { ...state.snapshot.settings, ...patch }
          if (patch.events) merged.events = { ...state.snapshot.settings.events, ...patch.events }
          acceptSnapshot({ ...state.snapshot, settings: merged })
        }
        return ok
      }

      async function submitDecision(event, decision) {
        if (decision !== 'allowed-once' && decision !== 'rejected') {
          setMessage(strings().invalidDecision, true)
          return false
        }
        return mutate('/answer', { ...exactIdentity(event), decision }, decision === 'allowed-once' ? strings().allowedOnce : strings().rejected, event.id)
      }

      async function submitAnswers(event, draft) {
        let payload
        try { payload = buildAnswerPayload(event, draft, strings()) } catch (error) {
          setMessage(error.message, true)
          return false
        }
        return mutate('/answer', payload, strings().answerSent, event.id)
      }

      async function runTest(kind) {
        if (!TEST_FIELDS.includes(kind)) {
          setMessage(strings().unknownTest, true)
          return false
        }
        if (kind === 'browser' && typeof NotificationApi !== 'function') {
          setMessage(strings().notifyUnsupported, true)
          return false
        }
        if (kind === 'browser' && NotificationApi.permission !== 'granted' && typeof NotificationApi.requestPermission === 'function') {
          try {
            const permission = await NotificationApi.requestPermission()
            if (permission !== 'granted') {
              setMessage(strings().permissionMissing, true)
              return false
            }
          } catch (error) {
            setMessage(strings().permissionFailed(error && error.message ? error.message : String(error)), true)
            return false
          }
        }
        if (kind === 'browser' && NotificationApi.permission !== 'granted') {
          setMessage(strings().permissionMissing, true)
          return false
        }
        return mutate('/test', { kind }, strings().testSent(strings().tests[kind]), `test-${kind}`)
      }

      async function markRead(id) {
        return mutate('/read', { id }, strings().markedRead, `read-${id}`)
      }

      async function clearHistory() {
        return mutate('/clear', {}, strings().historyCleared, 'clear')
      }

      async function requestBrowserPermission() {
        if (typeof NotificationApi !== 'function') {
          setMessage(strings().notifyUnsupported, true)
          return 'unsupported'
        }
        try {
          const permission = NotificationApi.permission === 'granted'
            ? 'granted'
            : await NotificationApi.requestPermission()
          setMessage(permission === 'granted' ? strings().permissionGranted : strings().permissionNotGranted, permission !== 'granted')
          return permission
        } catch (error) {
          setMessage(strings().permissionFailed(error && error.message ? error.message : String(error)), true)
          return 'denied'
        }
      }

      async function sendVisibility() {
        try {
          await request('/visibility', 'POST', {
            clientId,
            hidden: effectiveHidden(doc),
            currentSessionId: currentSessionId(),
          })
        } catch (error) {
          setState({ connection: 'disconnected' })
          if (error && (error.status === 401 || error.status === 403)) setMessage(friendlyError(error, strings()), true)
        }
      }

      function connectEvents() {
        if (stopped || typeof EventSourceApi !== 'function') return
        source = new EventSourceApi(PREFIX + '/events')
        const onState = (message) => {
          try {
            acceptSnapshot(JSON.parse(message.data))
            setState({ connection: 'connected' })
          } catch (error) {
            setMessage(strings().errorBadStream, true)
          }
        }
        if (typeof source.addEventListener === 'function') source.addEventListener('state', onState)
        source.onopen = () => setState({ connection: 'connected' })
        source.onerror = () => setState({ connection: 'disconnected' })
      }

      function start() {
        stopped = false
        const onVisibility = () => { void sendVisibility() }
        const arm = () => { soundArmed = true }
        if (doc && typeof doc.addEventListener === 'function') {
          doc.addEventListener('visibilitychange', onVisibility)
          doc.addEventListener('pointerdown', arm, { once: true })
          doc.addEventListener('keydown', arm, { once: true })
        }
        if (browserWindow && typeof browserWindow.addEventListener === 'function') {
          browserWindow.addEventListener('focus', onVisibility)
          browserWindow.addEventListener('blur', onVisibility)
        }
        if (sessions && sessions.list && typeof sessions.list.subscribe === 'function') sessionUnsubscribe = sessions.list.subscribe(onVisibility)
        if (typeof makeInterval === 'function') heartbeat = makeInterval(() => { void sendVisibility() }, 15000)
        void refresh({ baseline: true }).then(() => {
          if (!stopped) {
            connectEvents()
            void sendVisibility()
          }
        })
        return () => {
          stopped = true
          if (source && typeof source.close === 'function') source.close()
          source = null
          if (heartbeat !== null && typeof dropInterval === 'function') dropInterval(heartbeat)
          heartbeat = null
          if (typeof sessionUnsubscribe === 'function') sessionUnsubscribe()
          sessionUnsubscribe = null
          if (doc && typeof doc.removeEventListener === 'function') {
            doc.removeEventListener('visibilitychange', onVisibility)
            doc.removeEventListener('pointerdown', arm)
            doc.removeEventListener('keydown', arm)
          }
          if (browserWindow && typeof browserWindow.removeEventListener === 'function') {
            browserWindow.removeEventListener('focus', onVisibility)
            browserWindow.removeEventListener('blur', onVisibility)
          }
        }
      }

      return {
        acceptSnapshot,
        clearHistory,
        getState: () => state,
        markRead,
        refresh,
        requestBrowserPermission,
        runTest,
        start,
        submitAnswers,
        submitDecision,
        subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener) },
        updateSettings,
      }
    }

    function adoptStyles(doc) {
      if (!doc || typeof doc.createElement !== 'function' || !doc.head) return () => {}
      const style = doc.createElement('style')
      style.id = STYLE_ID
      style.dataset.plugin = 'dsh-notify-card'
      style.dataset.pluginCss = 'dsh-notify-card/client.css'
      style.textContent = CSS
      doc.head.appendChild(style)
      return () => {
        if (!style.parentNode) return
        if (typeof style.remove === 'function') style.remove()
        else if (typeof style.parentNode.removeChild === 'function') style.parentNode.removeChild(style)
      }
    }

    function Toggle({ checked, disabled, label, description, onChange }) {
      return h('label', { className: 'zeta_notify_toggle' },
        h('input', { type: 'checkbox', checked, disabled, onChange: (e) => onChange(e.target.checked) }),
        h('span', { className: 'zeta_notify_toggleText' },
          h('span', { className: 'zeta_notify_toggleLabel' }, label),
          description ? h('span', { className: 'zeta_notify_toggleDesc' }, description) : null))
    }

    function Button({ children, onClick, disabled, primary, danger, label }) {
      return h('button', {
        type: 'button',
        className: 'zeta_notify_button',
        disabled,
        'data-primary': primary ? 'true' : undefined,
        'data-danger': danger ? 'true' : undefined,
        'aria-label': label,
        onClick,
      }, children)
    }

    function createSettingsSection(runtime, ctx, NotificationApi) {
      function NotifyCardSettings() {
        const t = useStrings(ctx)
        const view = React.useSyncExternalStore(runtime.subscribe, runtime.getState, runtime.getState)
        const [filter, setFilter] = React.useState('all')
        const [drafts, setDrafts] = React.useState({})
        const snapshot = view.snapshot
        const settings = snapshot && snapshot.settings
        const pending = snapshot && Array.isArray(snapshot.pending) ? snapshot.pending : []
        const history = snapshot && Array.isArray(snapshot.history) ? snapshot.history : []
        const unread = history.filter((item) => !item.read).length
        const busy = (id) => view.pendingAction === id

        const patchDraft = (eventId, questionId, patch) => {
          setDrafts((current) => ({
            ...current,
            [eventId]: {
              ...(current[eventId] || {}),
              [questionId]: { ...((current[eventId] && current[eventId][questionId]) || { selected: [] }), ...patch },
            },
          }))
        }

        const toggleOption = (eventId, question, label, checked) => {
          const current = drafts[eventId] && drafts[eventId][question.id]
          const selected = current && Array.isArray(current.selected) ? current.selected : []
          const next = question.multiSelect
            ? (checked ? [...new Set([...selected, label])] : selected.filter((item) => item !== label))
            : (checked ? [label] : [])
          patchDraft(eventId, question.id, { selected: next, ...(!question.multiSelect && checked ? { custom: '' } : {}) })
        }

        const openSession = (item) => {
          try { if (item.sessionId && ctx.sessions && typeof ctx.sessions.open === 'function') ctx.sessions.open(item.sessionId) } catch (_) {}
          if (!item.read) void runtime.markRead(item.id)
        }

        const permission = typeof NotificationApi === 'function' ? NotificationApi.permission : 'unsupported'
        const permissionText = t.permission[permission] || t.permission.default
        const filteredHistory = history.filter((item) => filter === 'all' || (filter === 'unread' ? !item.read : eventSettingKey(item.kind) === filter))

        const renderQuestion = (item, question) => {
          const value = (drafts[item.id] && drafts[item.id][question.id]) || { selected: [], custom: '' }
          const options = Array.isArray(question.options) ? question.options : []
          const type = question.multiSelect ? 'checkbox' : 'radio'
          return h('fieldset', { className: 'zeta_notify_question', key: question.id },
            h('legend', null, question.header ? `${question.header}：${question.question}` : question.question),
            question.detail ? h('p', { className: 'zeta_notify_questionDetail' }, question.detail) : null,
            options.length ? h('div', { className: 'zeta_notify_options' }, options.map((option) =>
              h('label', { className: 'zeta_notify_option', key: option.label },
                h('input', {
                  type,
                  name: question.multiSelect ? undefined : `zeta-${item.id}-${question.id}`,
                  checked: value.selected.includes(option.label),
                  onChange: (e) => toggleOption(item.id, question, option.label, e.target.checked),
                }),
                h('span', { className: 'zeta_notify_optionText' },
                  h('span', null, option.label),
                  option.description ? h('span', { className: 'zeta_notify_optionDesc' }, option.description) : null)))) : null,
            h('label', { className: 'zeta_notify_toggleText' },
              h('span', { className: 'zeta_notify_toggleDesc' }, options.length ? t.otherReply : t.reply),
              h('textarea', {
                className: 'zeta_notify_text',
                value: value.custom || '',
                required: options.length === 0,
                maxLength: 16000,
                rows: 3,
                onChange: (e) => patchDraft(item.id, question.id, {
                  custom: e.target.value,
                  ...(!question.multiSelect && e.target.value.trim() ? { selected: [] } : {}),
                }),
              })))
        }

        const renderPending = (item) => {
          const isApproval = eventSettingKey(item.kind) === 'approval'
          const questions = Array.isArray(item.questions) ? item.questions : []
          return h('article', { className: 'zeta_notify_card', key: item.id },
            h('div', { className: 'zeta_notify_cardHead' },
              h('div', null,
                h('h4', { className: 'zeta_notify_cardTitle' }, item.title || t.events[eventSettingKey(item.kind)] || t.pendingFallbackTitle),
                h('div', { className: 'zeta_notify_cardMeta' }, `${t.events[eventSettingKey(item.kind)] || item.kind} · ${new Date(item.createdAt).toLocaleString(t.dateLocale)}`)),
              item.sessionId ? h(Button, { onClick: () => openSession(item) }, t.openSession) : null),
            item.body ? h('p', { className: 'zeta_notify_body' }, item.body) : null,
            item.toolName ? h('div', { className: 'zeta_notify_statusText' }, t.toolLine(item.toolName, item.reason)) : null,
            item.detail ? h('div', { className: 'zeta_notify_detail' }, item.detail) : null,
            isApproval
              ? h('div', { className: 'zeta_notify_inline' },
                h(Button, { primary: true, disabled: busy(item.id), onClick: () => { void runtime.submitDecision(item, 'allowed-once') } }, t.allowOnce),
                h(Button, { danger: true, disabled: busy(item.id), onClick: () => { void runtime.submitDecision(item, 'rejected') } }, t.reject))
              : h(React.Fragment, null,
                questions.map((question) => renderQuestion(item, question)),
                h('div', { className: 'zeta_notify_inline' },
                  h(Button, { primary: true, disabled: busy(item.id), onClick: () => { void runtime.submitAnswers(item, drafts[item.id] || {}) } }, questions.length > 1 ? t.submitAll : t.submit))))
        }

        if (!snapshot) {
          return h('section', { className: 'zeta_notify', 'aria-labelledby': 'notify-card-title' },
            h('h2', { id: 'notify-card-title', className: 'zeta_notify_title' }, t.title),
            h('div', { className: 'zeta_notify_panel', role: 'status', 'aria-busy': 'true' }, t.loading),
            view.message ? h('div', { className: 'zeta_notify_message', 'data-error': String(view.message.error), role: view.message.error ? 'alert' : 'status' }, view.message.text) : null)
        }

        const setTop = (key, checked) => { void runtime.updateSettings({ [key]: checked }) }
        const setEvent = (key, checked) => { void runtime.updateSettings(eventSettingsPatch(key, checked)) }
        const nativeHealth = nativeStatus(snapshot.native, t)

        return h('section', { className: 'zeta_notify', 'aria-labelledby': 'notify-card-title' },
          h('header', { className: 'zeta_notify_header' },
            h('div', null,
              h('h2', { id: 'notify-card-title', className: 'zeta_notify_title' }, t.title),
              h('p', { className: 'zeta_notify_subtitle' }, t.subtitle)),
            h('div', { className: 'zeta_notify_summary' },
              h('span', { className: 'zeta_notify_badge', 'data-state': view.connection }, view.connection === 'connected' ? t.connected : view.connection === 'loading' ? t.connecting : t.disconnected),
              h('span', { className: 'zeta_notify_badge' }, t.pendingCount(pending.length)),
              h('span', { className: 'zeta_notify_badge' }, t.unreadCount(unread)))),

          view.message ? h('div', { className: 'zeta_notify_message', 'data-error': String(view.message.error), role: view.message.error ? 'alert' : 'status', 'aria-live': 'polite' }, view.message.text) : null,

          h('section', { className: 'zeta_notify_section', 'aria-labelledby': 'zeta-pending-title' },
            h('div', { className: 'zeta_notify_sectionHead' },
              h('div', null,
                h('h3', { id: 'zeta-pending-title', className: 'zeta_notify_sectionTitle' }, t.pendingTitle(pending.length)),
                h('p', { className: 'zeta_notify_sectionDesc' }, t.pendingDesc))),
            pending.length ? h('div', { className: 'zeta_notify_pending' }, pending.map(renderPending)) : h('div', { className: 'zeta_notify_empty' }, t.pendingEmpty)),

          h('section', { className: 'zeta_notify_section', 'aria-labelledby': 'zeta-channel-title' },
            h('div', { className: 'zeta_notify_sectionHead' },
              h('div', null,
                h('h3', { id: 'zeta-channel-title', className: 'zeta_notify_sectionTitle' }, t.channelTitle),
                h('p', { className: 'zeta_notify_sectionDesc' }, t.channelDesc))),
            h('div', { className: 'zeta_notify_panel' },
              h('div', { className: 'zeta_notify_toggleGrid' },
                h(Toggle, { checked: settings.enabled, disabled: busy('settings'), label: t.toggleEnabled, onChange: (v) => setTop('enabled', v) }),
                h(Toggle, { checked: settings.native, disabled: busy('settings'), label: t.toggleNative, description: nativeHealth.text, onChange: (v) => setTop('native', v) }),
                h(Toggle, { checked: settings.browser, disabled: busy('settings'), label: t.toggleBrowser, description: t.togglePermission(permissionText), onChange: (v) => setTop('browser', v) }),
                h(Toggle, { checked: settings.sound, disabled: busy('settings'), label: t.toggleSound, description: t.toggleSoundDesc, onChange: (v) => setTop('sound', v) }),
                h(Toggle, { checked: settings.backgroundOnly, disabled: busy('settings'), label: t.toggleBackgroundOnly, description: t.toggleBackgroundOnlyDesc, onChange: (v) => setTop('backgroundOnly', v) }),
                h(Toggle, { checked: settings.preview, disabled: busy('settings'), label: t.togglePreview, description: t.togglePreviewDesc, onChange: (v) => setTop('preview', v) }),
                h(Toggle, { checked: settings.includeSubagents, disabled: busy('settings'), label: t.toggleIncludeSubagents, description: t.toggleIncludeSubagentsDesc, onChange: (v) => setTop('includeSubagents', v) })),
              h('div', { className: 'zeta_notify_inline' },
                h(Button, { onClick: () => { void runtime.requestBrowserPermission() } }, t.permissionButton),
                nativeHealth.error
                  ? h('div', { className: 'zeta_notify_message', 'data-error': 'true', role: 'alert' }, nativeHealth.text)
                  : h('span', { className: 'zeta_notify_statusText' }, nativeHealth.text)))),

          h('section', { className: 'zeta_notify_section', 'aria-labelledby': 'zeta-trigger-title' },
            h('div', { className: 'zeta_notify_sectionHead' },
              h('div', null,
                h('h3', { id: 'zeta-trigger-title', className: 'zeta_notify_sectionTitle' }, t.triggerTitle),
                h('p', { className: 'zeta_notify_sectionDesc' }, t.triggerDesc))),
            h('div', { className: 'zeta_notify_panel' },
              h('div', { className: 'zeta_notify_toggleGrid' }, EVENT_FIELDS.map((key) =>
                h(Toggle, { key, checked: settings.events[key], disabled: busy('settings'), label: t.events[key], onChange: (v) => setEvent(key, v) }))))),

          h('section', { className: 'zeta_notify_section', 'aria-labelledby': 'zeta-test-title' },
            h('div', { className: 'zeta_notify_sectionHead' },
              h('div', null,
                h('h3', { id: 'zeta-test-title', className: 'zeta_notify_sectionTitle' }, t.testTitle),
                h('p', { className: 'zeta_notify_sectionDesc' }, t.testDesc))),
            h('div', { className: 'zeta_notify_inline' }, TEST_FIELDS.map((kind) =>
              h(Button, { key: kind, disabled: busy(`test-${kind}`), onClick: () => { void runtime.runTest(kind) } }, t.tests[kind])))),

          h('section', { className: 'zeta_notify_section', 'aria-labelledby': 'zeta-history-title' },
            h('div', { className: 'zeta_notify_sectionHead' },
              h('div', null,
                h('h3', { id: 'zeta-history-title', className: 'zeta_notify_sectionTitle' }, t.historyTitle),
                h('p', { className: 'zeta_notify_sectionDesc' }, t.historyDesc(history.length, unread))),
              h('div', { className: 'zeta_notify_historyTools' },
                h('label', { className: 'zeta_notify_statusText', htmlFor: 'zeta-history-filter' }, t.filter),
                h('select', { id: 'zeta-history-filter', className: 'zeta_notify_select', value: filter, onChange: (e) => setFilter(e.target.value) },
                  h('option', { value: 'all' }, t.filterAll),
                  h('option', { value: 'unread' }, t.filterUnread),
                  EVENT_FIELDS.map((key) => h('option', { key, value: key }, t.events[key]))),
                h(Button, { danger: true, disabled: busy('clear') || history.length === 0, onClick: () => { void runtime.clearHistory() } }, t.clearHistory))),
            filteredHistory.length ? h('div', { className: 'zeta_notify_history' }, filteredHistory.map((item) =>
              h('article', { className: 'zeta_notify_historyRow', key: item.id },
                h('div', { className: 'zeta_notify_historyText' },
                  h('div', { className: 'zeta_notify_historyTitle' }, !item.read ? h('span', { className: 'zeta_notify_unread', 'aria-label': t.unread }) : null, item.title || t.events[eventSettingKey(item.kind)] || item.kind),
                  h('div', { className: 'zeta_notify_historyBody' }, settings.preview === false ? t.events[eventSettingKey(item.kind)] || t.notifyFallbackTitle : item.body || item.detail || ''),
                  h('div', { className: 'zeta_notify_cardMeta' }, new Date(item.createdAt).toLocaleString(t.dateLocale))),
                h('div', { className: 'zeta_notify_historyActions' },
                  !item.read ? h(Button, { disabled: busy(`read-${item.id}`), onClick: () => { void runtime.markRead(item.id) } }, t.markRead) : null,
                  item.sessionId ? h(Button, { onClick: () => openSession(item) }, t.openSession) : null)))) : h('div', { className: 'zeta_notify_empty' }, filter === 'all' ? t.historyEmpty : t.filterEmpty))
        )
      }
      return NotifyCardSettings
    }

    exports.inject = ['slots', 'sessions', 'locale']
    exports.apply = (ctx) => {
      const doc = typeof document === 'undefined' ? undefined : document
      const runtime = createClientRuntime({
        window: typeof window === 'undefined' ? undefined : window,
        document: doc,
        fetch: typeof fetch === 'undefined' ? undefined : fetch.bind(globalThis),
        EventSource: typeof EventSource === 'undefined' ? undefined : EventSource,
        NotificationApi: typeof Notification === 'undefined' ? undefined : Notification,
        sessions: ctx.sessions,
        getLocale: () => localeIdOf(ctx),
      })
      const SettingsSection = createSettingsSection(runtime, ctx, typeof Notification === 'undefined' ? undefined : Notification)
      ctx.slots.inject('settings.section', () => ctx.slots.register({
        name: 'settings.section',
        id: 'notify-card',
        order: 60,
        label: () => pickStrings(localeIdOf(ctx)).title,
        inject: () => ({}),
      }, SettingsSection))
      if (ctx && typeof ctx.effect === 'function') {
        ctx.effect(() => adoptStyles(doc), 'dsh-notify-card: styles')
        ctx.effect(() => runtime.start(), 'dsh-notify-card: browser center')
      } else {
        adoptStyles(doc)
      }
    }

    exports.browserDeliveryDecision = browserDeliveryDecision
    exports.buildAnswerPayload = buildAnswerPayload
    exports.createClientRuntime = createClientRuntime
    exports.effectiveHidden = effectiveHidden
    exports.eventSettingKey = eventSettingKey
    exports.eventSettingsPatch = eventSettingsPatch
    exports.nativeStatus = nativeStatus
    exports.notificationBody = notificationBody
    exports.notificationTitle = notificationTitle
    exports.pickStrings = pickStrings
    exports.STRINGS = STRINGS

    return module.exports
  },
})
