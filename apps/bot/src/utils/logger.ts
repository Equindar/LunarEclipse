
import path from 'node:path';
import { createLogger, type Logger } from '@lunareclipse/logging';
import configuration from '../config.js';

const logger: Logger = createLogger({
  service: "bot",
  level: configuration.logging.level,
  logDir: configuration.logging.directory ?? path.join(process.cwd(), "logs"),
  enableFile: process.env.NODE_ENV === "production",
  errorRetention: "30d",
});

export default logger;
