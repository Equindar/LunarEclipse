import { format, type Logform } from "winston";

export function baseFormat(): Logform.Format {
  return format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS Z" }),
    format.errors({ stack: true })
  );
}


export function consoleFormat(): Logform.Format {
  return format.combine(
    format.colorize({ all: true }),
    format.timestamp(),
    format.errors({ stack: true }),
    format.printf(
      (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
    )
  );
}


export function fileJsonFormat(options?: { includeStack?: boolean }): Logform.Format {
  return format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS A" }),
    ...(options?.includeStack ? [format.errors({ stack: true })] : []),
    format.json({ deterministic: false })
  );
}
