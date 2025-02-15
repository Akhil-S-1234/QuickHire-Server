import { createLogger, format, transports } from 'winston';
import { Config } from '../config/logge'; // Assume we have a config file

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

export interface LogMetadata {
  [key: string]: any;
}

export class Logger {
  private logger: any;

  constructor() {
    this.logger = createLogger({
      level: Config.LOG_LEVEL || 'info',
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
      ),
      defaultMeta: { 
        service: Config.SERVICE_NAME || 'recruitment-service',
        environment: Config.NODE_ENV || 'development'
      },
      transports: [
        // Always log to console
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ timestamp, level, message, ...meta }) => {
              const metaStr = Object.keys(meta).length ? 
                `\n${JSON.stringify(meta, null, 2)}` : '';
              return `${timestamp} ${level}: ${message}${metaStr}`;
            })
          )
        }),
        // Log to file in production
        ...(Config.NODE_ENV === 'production' ? [
          // Error logs
          new transports.File({ 
            filename: 'logs/error.log', 
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
          }),
          // Combined logs
          new transports.File({ 
            filename: 'logs/combined.log',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
          })
        ] : [])
      ]
    });
  }

  public error(message: string, metadata?: LogMetadata): void {
    this.logger.error(message, metadata);
  }

  public warn(message: string, metadata?: LogMetadata): void {
    this.logger.warn(message, metadata);
  }

  public info(message: string, metadata?: LogMetadata): void {
    this.logger.info(message, metadata);
  }

  public debug(message: string, metadata?: LogMetadata): void {
    this.logger.debug(message, metadata);
  }

  // Method to create a child logger with additional default metadata
  public child(defaultMetadata: LogMetadata): Logger {
    const childLogger = new Logger();
    childLogger.logger = this.logger.child(defaultMetadata);
    return childLogger;
  }
}

// Configuration interface (put this in your config.ts file)
export interface LoggerConfig {
  LOG_LEVEL?: string;
  SERVICE_NAME?: string;
  NODE_ENV?: string;
}