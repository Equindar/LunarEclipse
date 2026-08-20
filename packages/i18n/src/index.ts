// src/index.ts
import i18next, { i18n } from 'i18next';

const loaders: Record<string, () => Promise<{ default: Record<string, unknown> }>> = {
  'de:common': () => import('../locales/de/common'),
  'en:common': () => import('../locales/en/common'),
};

export async function createI18n(language: string): Promise<i18n> {
  const instance = i18next.createInstance();
  const common = (await loaders[`${language}:common`]?.()) ?? (await loaders['en:common']!());

  await instance.init({
    lng: language,
    fallbackLng: 'en',
    resources: {
      [language]: { common: common.default },
    },
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  });
  return instance;
}
