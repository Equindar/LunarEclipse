import { languageDetector, type DetectorOptions } from 'hono/language';
import { supportedLanguages, fallbackLanguage } from '@lunareclipse/i18n';

const detectorOptions: DetectorOptions = {
  order: ['cookie', 'header'],
  lookupCookie: 'lang',
  lookupQueryString: '',
  lookupFromPathIndex: 0,
  lookupFromHeaderKey: 'accept-language',
  caches: false,
  ignoreCase: true,
  fallbackLanguage,
  supportedLanguages: [...supportedLanguages],
};

export const languageMiddleware = languageDetector(detectorOptions);
