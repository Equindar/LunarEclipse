import { setMissingKeyHandler } from '@lunareclipse/i18n';

type AppLogger = typeof import('./logger.js')['default'];

export function logI18n(logger: AppLogger): void {
  const i18nLogger = logger.child({ module: 'i18n' });

  setMissingKeyHandler(({ lngs, namespace, key }) => {
    i18nLogger.warn(
      `Fehlende Übersetzung: Key "${key}" in Namespace "${namespace}" für Sprache(n) [${lngs.join(', ')}]`,
    );
  });
}
