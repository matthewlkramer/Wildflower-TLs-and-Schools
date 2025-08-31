// Use Vite-compatible env flags; fall back safely in browser
const viteEnv = (typeof import.meta !== 'undefined' && (import.meta as any).env) ? (import.meta as any).env : undefined;
const isDevelopment = Boolean(viteEnv?.DEV ?? (viteEnv?.MODE === 'development'));

class Logger {
  private enabled: boolean;

  constructor() {
    this.enabled = isDevelopment;
  }

  log(...args: any[]) {
    if (this.enabled) {
      console.log(...args);
    }
  }

  error(...args: any[]) {
    if (this.enabled) {
      console.error(...args);
    }
  }

  warn(...args: any[]) {
    if (this.enabled) {
      console.warn(...args);
    }
  }

  debug(...args: any[]) {
    if (this.enabled) {
      console.debug(...args);
    }
  }

  info(...args: any[]) {
    if (this.enabled) {
      console.info(...args);
    }
  }
}

export const logger = new Logger();
