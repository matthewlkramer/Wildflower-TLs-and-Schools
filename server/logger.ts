const isDevelopment = process.env.NODE_ENV === 'development';

class ServerLogger {
  private enabled: boolean;

  constructor() {
    this.enabled = isDevelopment;
  }

  log(...args: any[]) {
    if (this.enabled) {
      console.log(new Date().toISOString(), '[LOG]', ...args);
    }
  }

  error(...args: any[]) {
    console.error(new Date().toISOString(), '[ERROR]', ...args);
  }

  warn(...args: any[]) {
    if (this.enabled) {
      console.warn(new Date().toISOString(), '[WARN]', ...args);
    }
  }

  debug(...args: any[]) {
    if (this.enabled) {
      console.debug(new Date().toISOString(), '[DEBUG]', ...args);
    }
  }

  info(...args: any[]) {
    if (this.enabled) {
      console.info(new Date().toISOString(), '[INFO]', ...args);
    }
  }
}

export const logger = new ServerLogger();