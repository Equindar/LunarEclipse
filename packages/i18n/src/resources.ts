import enCommon from '../locales/en/common';
import deCommon from '../locales/de/common';

export const resources = {
  en: {
    common: enCommon,
  },
  de: {
    common: deCommon,
  },
} as const;

export type Language = keyof typeof resources;
