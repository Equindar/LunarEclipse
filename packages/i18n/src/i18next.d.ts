// src/i18next.d.ts
import 'i18next';
import common from '../locales/en/common';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
    };
  }
}
