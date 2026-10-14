import { stripVTControlCharacters } from 'node:util';
import { createLogger, LogErrorOptions, type Logger, LoggerOptions, type LogOptions, LogType } from 'vite';
import configuration from '../config.js';
import appLogger from './logger.js';

// Addon-Logger
const viteLogger = appLogger.child({ module: 'Vite' });

const loggerOptions: LoggerOptions = {
  prefix: configuration.app.name,          // statt [vite]
  allowClearScreen: false,  // Konsole nicht bei jedem Reload leeren!
}

const level = configuration.logging.level?? 'info';
const log = createLogger(level as LogType, loggerOptions);

function format(msg: string): string {
  return stripVTControlCharacters(msg)
}

const ignoreMsgs: string[] = []

function isIgnored(msg: string): boolean {
  return ignoreMsgs.some(ignored => msg.includes(ignored))
}

const warned = new Set<string>()
const loggedErrors = new WeakSet<Error>()

const logger: Logger = {
  ...log,

  info(msg: string, _options?: LogOptions) {
    if (isIgnored(msg)) return
    viteLogger.info(format(msg))
  },

  warn(msg: string, _options?: LogOptions) {
    if (isIgnored(msg)) return
    logger.hasWarned = true
    viteLogger.warn(format(msg))
  },

  warnOnce(msg: string, options?: LogOptions) {
    if (warned.has(msg)) return
    warned.add(msg)
    viteLogger.warn(msg, options)
  },

  error(msg: string, options?: LogErrorOptions) {
    if (options?.error) loggedErrors.add(options.error as any)
    viteLogger.error(format(msg))
  },

  hasErrorLogged(error: Error | unknown) {
    return error instanceof Error && loggedErrors.has(error)
  },

}

export default logger;
