/**
 * Enterprise Structured Logger
 * Designed for Datadog / Axiom ingestion
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private service: string;

  constructor(service: string) {
    this.service = service;
  }

  private log(level: LogLevel, message: string, context?: LogContext) {
    const payload = {
      timestamp: new Date().toISOString(),
      level,
      service: this.service,
      message,
      ...context,
    };

    // In production, this would be shipped to Datadog/Axiom via HTTP
    // For Vercel Edge, console logs are automatically parsed if structured
    if (level === 'error') {
      console.error(JSON.stringify(payload));
    } else if (level === 'warn') {
      console.warn(JSON.stringify(payload));
    } else if (level === 'debug') {
      if (process.env.NODE_ENV !== 'production') {
        console.debug(JSON.stringify(payload));
      }
    } else {
      console.log(JSON.stringify(payload));
    }
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error | unknown, context?: LogContext) {
    this.log('error', message, {
      ...context,
      error_name: error instanceof Error ? error.name : 'UnknownError',
      error_message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context);
  }
}

export const createLogger = (service: string) => new Logger(service);
export const systemLogger = createLogger('healix-core');
