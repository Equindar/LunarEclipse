import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend, { HttpBackendOptions } from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { getOptions } from './settings.js';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)

if (import.meta.hot) {
  import.meta.hot.on('locales-update', () => {
    i18n.reloadResources().then(() => {
      i18n.changeLanguage(i18n.language);
    });
  });
}

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init<HttpBackendOptions>({
    backend: {
      loadPath: '/i18n/{{lng}}/{{ns}}.json',
    },
    ...getOptions,
  });

export default i18n;
