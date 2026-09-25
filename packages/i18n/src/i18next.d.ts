import 'i18next';
import type common from '../locales/en/common';
import type admin from '../locales/en/admin';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      admin: typeof admin;
    };
  }
}
