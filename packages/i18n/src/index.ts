// --- Imports
import i18next, { i18n, InitOptions } from 'i18next';
import { instanceCache, resourceCache } from './cache/cache';
import { SupportedLanguage } from './languages';
// Side-Effect-Import
import './i18next.d.ts';
import { MissingKeyInfo } from './types/MissingKeyInfo';

// --- Exports
export { fallbackLanguage, supportedLanguages, toSupportedLanguage } from './languages';
export type { SupportedLanguage } from './languages';
export type SupportedNamespaces = 'common' | 'admin';


async function loadNamespace(language: SupportedLanguage, namespace: SupportedNamespaces) {
  const key = `${language}:${namespace}`;
  if (resourceCache.has(key)) {
    return resourceCache.get(key)!;
  }

  let mod;
  try {
    mod = await import(`../locales/${language}/${namespace}.ts`);
  } catch {
    mod = await import(`../locales/en/${namespace}.ts`);
  }

  resourceCache.set(key, mod.default);
  return mod.default;
}


let onMissingKey: ((info: MissingKeyInfo) => void) | undefined;

export function setMissingKeyHandler(handler: (info: MissingKeyInfo) => void) {
  onMissingKey = handler;
}


/**
 * Factory for creating i18n Instance
 * @param preferredLanguage default: 'en'
 * @param namespaces default: 'common'
 * @returns Promise of i18n Instance
 */
async function createI18n(
  preferredLanguage: SupportedLanguage = 'en',
  namespaces: SupportedNamespaces[] = ['common']
): Promise<i18n> {
  const cacheKey = `${preferredLanguage}:${namespaces.slice().sort().join(',')}`;

  if (instanceCache.has(cacheKey)) {
    return instanceCache.get(cacheKey)!;
  }

  const instance = i18next.createInstance();
  const loaded = await Promise.all(
    namespaces.map((ns) => loadNamespace(preferredLanguage, ns))
  );

  const resourceBundle = Object.fromEntries(
    namespaces.map((ns, i) => [ns, loaded[i]])
  );

  const options: InitOptions = {
    lng: preferredLanguage,
    fallbackLng: 'en',
    resources: { [preferredLanguage]: resourceBundle },
    defaultNS: 'common',
    ns: namespaces,
    interpolation: { escapeValue: false },
    showSupportNotice: false,

    // Aktiviert das Auslösen von missingKeyHandler bei fehlenden Keys
    saveMissing: true,
    missingKeyHandler: (lngs, namespace, key) => {
      onMissingKey?.({ lngs, namespace, key });
    },

    // Formatiert den Rückgabewert von t(), wenn der Key fehlt
    parseMissingKeyHandler: (key) => `{{MissingTranslation: ${key}}}`,
  };

  await instance.init(options);

  instanceCache.set(cacheKey, instance);
  return instance;
}

export default createI18n;
