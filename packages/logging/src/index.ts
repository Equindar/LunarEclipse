import { createLogger as createWinstonLogger, type Logger } from "winston";
import { baseFormat } from "./format";
import { createConsoleTransport, createRotateFileTransport } from "./transports";

export interface LoggerOptions {
  service: string;
  level?: string;
  logDir?: string;
  enableFile?: boolean;
  /** Retention für info-Logs, Default "14d" */
  infoRetention?: string;
  /** Retention für error-Logs, Default "30d" */
  errorRetention?: string;
}

export function createLogger(options: LoggerOptions): Logger {
  const level =
    options.level ?? (process.env.NODE_ENV === "production" ? "info" : "debug");

  const logger = createWinstonLogger({
    level,
    defaultMeta: { service: options.service },
    format: baseFormat(),
    transports: [createConsoleTransport()],
  });

  if (options.enableFile) {
    if (!options.logDir) {
      throw new Error(
        "[@repo/logger] enableFile=true requires a logDir to be provided."
      );
    }

    logger.add(
      createRotateFileTransport({
        logDir: options.logDir,
        level: "info",
        filenameSuffix: "info",
        maxFiles: options.infoRetention ?? "14d",
      })
    );

    logger.add(
      createRotateFileTransport({
        logDir: options.logDir,
        level: "error",
        filenameSuffix: "error",
        maxFiles: options.errorRetention ?? "30d",
        includeStack: true,
      })
    );
  }

  return logger;
}

// Re-Export für App-seitige Erweiterungen (eigene Transports, Tests, etc.)
export { baseFormat, consoleFormat, fileJsonFormat } from "./format";
export { createConsoleTransport, createRotateFileTransport } from "./transports";
export type { Logger } from "winston";
