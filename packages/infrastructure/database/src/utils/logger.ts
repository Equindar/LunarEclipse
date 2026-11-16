import { createLogger, type Logger } from '@lunareclipse/logging';
import configuration from '../config/config.js';

const logger: Logger = createLogger({
  service: configuration.app.name ?? '',
  level: configuration.logging.level,
  enableFile: false,
});

export default logger;
