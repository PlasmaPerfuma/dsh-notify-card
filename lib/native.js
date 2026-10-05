import { spawn } from 'node:child_process';
import { appendFileSync, existsSync } from 'node:fs';
// Optional helper-side diagnostics: same `.debug` marker rule as index.js.
const _nOn=(()=>{try{return existsSync(new URL('../.debug',import.meta.url));}catch{return false;}})();
const _nPath=(process.env.TEMP||process.env.TMP||'.')+String.fromCharCode(92)+'notify-card.log';
const _ndbg=(m)=>{if(!_nOn)return;try{appendFileSync(_nPath,new Date().toISOString()+' [native] '+m+String.fromCharCode(10));}catch{}};
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const MAX_LINE_BYTES = 128 * 1024
const RELAUNCH_DELAY_MS = 1_000
const DISPOSE_GRACE_MS = 250
const READY_TIMEOUT_MS = 10_000
const DEFAULT_SCRIPT_PATH = fileURLToPath(new URL('../native/notify.ps1', import.meta.url))

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function eventForNative(event, settings) {
  const interactive =
    (typeof event.requestId === 'string' && event.requestId.length > 0) ||
    (typeof event.token === 'string' && event.token.length > 0) ||
    (Array.isArray(event.questions) && event.questions.length > 0) ||
    ['question', 'approval', 'plan'].includes(event.kind)
  if (settings.preview !== false || interactive) return event

  const preview = { id: event.id }
  if (typeof event.kind === 'string') preview.kind = event.kind
  if (typeof event.createdAt === 'string') preview.createdAt = event.createdAt
  return preview
}

function hasOptionalString(value, key) {
  return value[key] === undefined || typeof value[key] === 'string'
}

function isAnswer(value) {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    Array.isArray(value.selected) &&
    value.selected.every((label) => typeof label === 'string') &&
    hasOptionalString(value, 'custom')
  )
}

function isAction(value) {
  if (!isRecord(value) || typeof value.type !== 'string') return false
  if (value.type === 'ready') return true
  if (value.type === 'shown') return typeof value.id === 'string' && value.id.length > 0
  if (value.type === 'dismiss') {
    return (
      typeof value.id === 'string' &&
      hasOptionalString(value, 'requestId') &&
      hasOptionalString(value, 'sessionId') &&
      hasOptionalString(value, 'token')
    )
  }
  if (value.type === 'focus') return typeof value.focused === 'boolean'
  if (value.type !== 'respond') return false
  if (
    typeof value.id !== 'string' ||
    typeof value.requestId !== 'string' ||
    typeof value.sessionId !== 'string' ||
    typeof value.token !== 'string'
  ) {
    return false
  }
  if (value.decision !== undefined) {
    return value.decision === 'allowed-once' || value.decision === 'rejected'
  }
  return Array.isArray(value.answers) && value.answers.every(isAnswer)
}

function formatExit(code, signal) {
  if (signal) return `signal ${signal}`
  return `code ${code === null ? 'unknown' : code}`
}

export function createNativeBridge({
  onAction = () => {},
  onError = () => {},
  spawnImpl = spawn,
  platform = process.platform,
  scriptPath = DEFAULT_SCRIPT_PATH,
} = {}) {
  const supported = platform === 'win32'
  const executable = path.win32.join(
    process.env.SystemRoot || 'C:\\Windows',
    'System32',
    'WindowsPowerShell',
    'v1.0',
    'powershell.exe',
  )
  let child = null
  let disposed = false
  let blockedUntil = 0
  const stopTimers = new WeakMap()
  const readyTimers = new WeakMap()
  const expectedStops = new WeakSet()

  function clearChildTimer(timers, current) {
    const timer = timers.get(current)
    if (!timer) return
    clearTimeout(timer)
    timers.delete(current)
  }

  function report(error) {
    const normalized = error instanceof Error ? error : new Error(String(error))
    try {
      onError(normalized)
    } catch {
      // Consumer callbacks must not break pipe processing.
    }
  }

  function blockRelaunch() {
    blockedUntil = Date.now() + RELAUNCH_DELAY_MS
  }

  function acceptLine(current, line) {
    if (!line.trim()) return
    if (Buffer.byteLength(line, 'utf8') > MAX_LINE_BYTES) {
      report(new Error('Native helper output exceeded the 128 KiB line limit'))
      return
    }
    let message
    try {
      message = JSON.parse(line)
    } catch (error) {
      report(new Error(`Native helper returned invalid JSON: ${error.message}`))
      return
    }
    if (!isAction(message)) {
      report(new Error('Native helper returned an invalid protocol message'))
      return
    }
    if (child !== current) return
    _ndbg('helper msg: '+line);
    if (message.type === 'ready') clearChildTimer(readyTimers, current)
    try {
      onAction(message)
    } catch (error) {
      report(error)
    }
  }

  function attach(current) {
    let stdoutBuffer = ''
    let stderrTail = ''
    let failed = false
    function markFailed(error, area) {
      if (failed || disposed || expectedStops.has(current)) return
      failed = true
      if (child === current) child = null
      clearChildTimer(readyTimers, current)
      blockRelaunch()
      const code = typeof error?.code === 'string' ? `${error.code}: ` : ''
      report(new Error(`Native helper ${area} failed: ${code}${error?.message || error}`))
      expectedStops.add(current)
      try {
        current.kill('SIGTERM')
      } catch {
        // The failed process or pipe already closed.
      }
    }
    current.stdout.setEncoding('utf8')
    current.stderr.setEncoding('utf8')
    current.stdout.on('data', (chunk) => {
      stdoutBuffer += chunk
      let newline = stdoutBuffer.indexOf('\n')
      while (newline !== -1) {
        let line = stdoutBuffer.slice(0, newline)
        stdoutBuffer = stdoutBuffer.slice(newline + 1)
        if (line.endsWith('\r')) line = line.slice(0, -1)
        acceptLine(current, line)
        newline = stdoutBuffer.indexOf('\n')
      }
      if (Buffer.byteLength(stdoutBuffer, 'utf8') > MAX_LINE_BYTES) {
        stdoutBuffer = ''
        report(new Error('Native helper output exceeded the 128 KiB line limit'))
      }
    })
    current.stderr.on('data', (chunk) => {
      _ndbg('helper stderr: '+String(chunk).trim());
      const diagnostic = String(chunk).trim()
      if (!diagnostic) return
      stderrTail = `${stderrTail}\n${diagnostic}`.trim().slice(-4_096)
      if (/^Fatal native /m.test(diagnostic)) {
        markFailed(new Error(diagnostic), 'diagnostic')
      }
    })
    current.stdin.on('error', (error) => markFailed(error, 'input'))
    current.on('error', (error) => markFailed(error, 'process'))
    current.on('close', (code, signal) => {
      if (child === current) child = null
      clearChildTimer(stopTimers, current)
      clearChildTimer(readyTimers, current)
      if (!disposed && !failed && !expectedStops.has(current)) {
        blockRelaunch()
        const detail = stderrTail ? `: ${stderrTail}` : ''
        report(new Error(`Native helper exited unexpectedly with ${formatExit(code, signal)}${detail}`))
      }
    })
  }

  function ensureChild() {
    if (!supported || disposed || Date.now() < blockedUntil) return null
    if (child) return child
    try {
      child = spawnImpl(
        executable,
        // -ExecutionPolicy Bypass is deliberate: without it the helper depends on
        // the machine's PowerShell execution policy, and a package installed
        // outside node_modules can be refused outright ("running scripts is
        // disabled on this system").
        ['-NoProfile', '-Sta', '-ExecutionPolicy', 'Bypass', '-WindowStyle', 'Hidden', '-File', scriptPath],
        { stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true },
      )
      attach(child)
      const startingChild = child
      const readyTimer = setTimeout(() => {
        readyTimers.delete(startingChild)
        if (disposed || child !== startingChild) return
        child = null
        blockRelaunch()
        report(new Error('Native helper did not become ready within 10 seconds'))
        expectedStops.add(startingChild)
        try {
          startingChild.kill('SIGTERM')
        } catch {
          // The helper exited while the timeout was being handled.
        }
      }, READY_TIMEOUT_MS)
      readyTimer.unref?.()
      readyTimers.set(startingChild, readyTimer)
      return child
    } catch (error) {
      child = null
      blockRelaunch()
      report(new Error(`Unable to start native helper: ${error.message}`))
      return null
    }
  }

  function encode(message) {
    let line
    try {
      line = `${JSON.stringify(message)}\n`
    } catch (error) {
      report(new Error(`Unable to serialize native notification: ${error.message}`))
      return null
    }
    if (Buffer.byteLength(line, 'utf8') > MAX_LINE_BYTES) {
      report(new Error('Native notification exceeded the 128 KiB line limit'))
      return null
    }
    return line
  }

  function sendLine(current, line) {
    if (!current?.stdin || current.stdin.destroyed) {
      report(new Error('Native helper input is unavailable'))
      return false
    }
    try {
      current.stdin.write(line)
      return true
    } catch (error) {
      if (child === current) child = null
      blockRelaunch()
      report(new Error(`Unable to write to native helper: ${error.message}`))
      return false
    }
  }

  return {
    get available() {
      return supported && !disposed
    },

    show(event, settings = {}, labels) {
      if (!isRecord(event) || typeof event.id !== 'string' || !isRecord(settings)) {
        report(new Error('Native notification requires an event id and settings object'))
        return false
      }
      // The host owns the card wording, so the script needs no dictionary; an
      // absent block leaves the script on its built-in Chinese constants.
      const line = encode({
        type: 'show',
        event: eventForNative(event, settings),
        settings,
        ...(isRecord(labels) ? { labels } : {}),
      })
      if (!line) return false
      _ndbg('show id='+event.id+' kind='+String(event.kind||''));
      const current = ensureChild()
      return current ? sendLine(current, line) : false
    },

    close(id) {
      if (typeof id !== 'string' || !id || !child || disposed) return false
      const line = encode({ type: 'close', id })
      return line ? sendLine(child, line) : false
    },

    dispose() {
      if (disposed) return
      disposed = true
      const current = child
      child = null
      if (current) clearChildTimer(readyTimers, current)
      if (!current) return
      const line = encode({ type: 'shutdown' })
      if (line) sendLine(current, line)
      try {
        current.stdin.end()
      } catch {
        // The bounded kill below still releases a broken pipe.
      }
      const stopTimer = setTimeout(() => {
        stopTimers.delete(current)
        try {
          current.kill('SIGTERM')
        } catch {
          // The process already exited between the timer and kill.
        }
      }, DISPOSE_GRACE_MS)
      stopTimer.unref?.()
      stopTimers.set(current, stopTimer)
    },
  }
}
