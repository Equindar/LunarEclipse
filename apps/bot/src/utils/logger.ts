import { createLogger, transports, format } from 'winston';
import DailyRotateFile = require("winston-daily-rotate-file");
import fs = require("fs");
import path = require("path");

const logDir = process.env.LOG_DIRECTORY || path.join(__dirname, "../../logs");

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}


// --- Default-Logger
export const logger = createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss.SSS Z'
        }),
        format.errors({ stack: true })
    ),
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize({ all: true }),
                format.timestamp(),
                format.errors({ stack: true }),
                format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
            ),
        }),

        new DailyRotateFile({
            dirname: logDir,
            filename: "%DATE%.info.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            level: "info",
            maxSize: "20m",
            maxFiles: "14d",
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS A' }),
                format.json(),
            ),
        }),

        new DailyRotateFile({
            dirname: logDir,
            filename: "%DATE%.error.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            level: "error",
            maxSize: "20m",
            maxFiles: "30d",
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS A' }),
                format.errors({ stack: true }),
                format.json(),
            ),
        }),
    ],
});
