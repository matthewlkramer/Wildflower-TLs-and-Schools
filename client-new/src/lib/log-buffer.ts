let _installed = false;
const _buf: string[] = [];
const _MAX = 300;

function push(kind: string, args: any[]) {
  try {
    const ts = new Date().toISOString();
    const msg = args.map((a) => {
      try {
        if (typeof a === 'string') return a;
        if (a instanceof Error) return a.stack || a.message;
        return JSON.stringify(a);
      } catch {
        return String(a);
      }
    }).join(' ');
    _buf.push(`[${ts}] ${kind}: ${msg}`);
    if (_buf.length > _MAX) _buf.splice(0, _buf.length - _MAX);
  } catch {
    // ignore
  }
}

export function initLogBuffer() {
  if (_installed) return;
  _installed = true;
  const orig = {
    log: console.log.bind(console),
    info: console.info.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
  } as const;
  console.log = (...args: any[]) => { push('log', args); orig.log(...args); };
  console.info = (...args: any[]) => { push('info', args); orig.info(...args); };
  console.warn = (...args: any[]) => { push('warn', args); orig.warn(...args); };
  console.error = (...args: any[]) => { push('error', args); orig.error(...args); };
}

export function getBufferedLogsText(limit = 200): string {
  const start = Math.max(0, _buf.length - limit);
  return _buf.slice(start).join('\n');
}

