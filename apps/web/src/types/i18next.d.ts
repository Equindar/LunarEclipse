import { defaultNS } from '@/lib/i18n/settings';
import Resources from './i18next.resources.js';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: Resources;
  }
}
