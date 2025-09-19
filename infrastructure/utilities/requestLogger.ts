// --- Imports
import path from 'path';
import fs from 'fs';
import { createLogger, transports, format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logDir = process.env.LOG_DIRECTORY || path.join(__dirname, '../../logs');

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// --- Default-Logger
const requestLogger = createLogger({
    level: 'http',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        format.json(),
    ),
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize({ all: true }),
                format.timestamp(),
                format.errors({ stack: true }),
                format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
            ),
        }),

        new DailyRotateFile({
            dirname: logDir,
            filename: '%DATE%.requests.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            level: 'http',
            maxSize: '20m',
            maxFiles: '30d',
        }),
    ],
});

export default requestLogger;