import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import winston from 'winston';
import { Request, Response, NextFunction } from 'express';
import DailyRotateFile from 'winston-daily-rotate-file';

declare global {
    namespace Express {
        interface Request {
            id?: string;
        }
    }
}

export function createLoggingMiddleware() {
    const logDirectory = path.join(process.cwd(), 'logs');

    // Ensure log directory exists
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

    // Set up winston logger with daily rotation
    const logger = winston.createLogger({
        level: 'info', // Adjust log levels as needed
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({ level, message, timestamp }) => {
                return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
            })
        ),
        transports: [
            new DailyRotateFile({
                filename: path.join(logDirectory, 'combined-%DATE%.log'),
                datePattern: 'YYYY-MM-DD', // Daily rotation pattern
                maxSize: '5m', // 5MB file size limit per log file
                maxFiles: '7d', // Keep logs for 7 days
            }),
            new winston.transports.Console(), // Log to console (optional)
        ],
    });

    // Integrate morgan with winston
    const morganMiddleware = morgan('combined', {
        stream: {
            write: (message: string) => logger.info(message.trim()),
        },
    });

    return morganMiddleware;
}

// Middleware to add request ID
export function addRequestId(req: Request, res: Response, next: NextFunction) {
    req.id = Date.now().toString();
    next();
}
