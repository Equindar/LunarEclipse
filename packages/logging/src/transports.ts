import fs from "node:fs";
import { transports as winstonTransports, format as winstonFormat } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { consoleFormat, fileJsonFormat } from "./format";

export function createConsoleTransport() {
  return new winstonTransports.Console({
    format: consoleFormat(),
  });
}

interface RotateFileOptions {
  logDir: string;
  level: "info" | "error" | "warn" | "debug";
  filenameSuffix: string;   // z.B. "info" oder "error"
  maxFiles: string;         // z.B. "14d"
  maxSize?: string;         // Default "20m"
  includeStack?: boolean;   // format.errors({stack:true}) mit einbeziehen
}

export function createRotateFileTransport(options: RotateFileOptions) {
  ensureLogDirExists(options.logDir);

  return new DailyRotateFile({
    dirname: options.logDir,
    filename: `%DATE%.${options.filenameSuffix}.log`,
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    level: options.level,
    maxSize: options.maxSize ?? "20m",
    maxFiles: options.maxFiles,
    format: fileJsonFormat({ includeStack: options.includeStack }),
  });
}

function ensureLogDirExists(logDir: string) {
  try {
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  } catch (err) {
    console.error(
      `[@lunareclipse/logging] Could not create log directory "${logDir}":`,
      err
    );
  }
}
