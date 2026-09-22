import { languageDetector, type DetectorOptions } from 'hono/language';

const detectorOptions: DetectorOptions = {
  order: [],
  lookupQueryString: '',
  lookupCookie: '',
  lookupFromPathIndex: 0,
  lookupFromHeaderKey: '',
  caches: false,
  ignoreCase: false,
  fallbackLanguage: 'en',
  supportedLanguages: ['de', 'en'],
};

export const languageMiddleware = languageDetector(detectorOptions);
