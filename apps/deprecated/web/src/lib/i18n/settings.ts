export const fallbackLng = 'en';
export const languages = [fallbackLng, 'de'];
export const defaultNS = 'translation';
export const cookieName = 'i18next';

export function getOptions() {
  return {
    // debug: true,
    load: 'languageOnly',
    supportedLngs: languages,
    // preload: languages,
    fallbackLng,
    lng: fallbackLng,
    fallbackNS: defaultNS,
    defaultNS,
    ns: defaultNS,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  };
}
