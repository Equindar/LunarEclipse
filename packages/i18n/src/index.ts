import i18next, { i18n, InitOptions, Namespace } from 'i18next';
import { SupportedLanguage } from './languages';
import { instanceCache, resourceCache } from './cache/cache';

// --- Exports
export { supportedLanguages, fallbackLanguage, toSupportedLanguage } from './languages';
export type { SupportedLanguage } from './languages';

export type SupportedNamespaces = 'common' | 'account';

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

async function createI18n(
  preferredLanguage: SupportedLanguage,
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
  };

  await instance.init(options);

  instanceCache.set(cacheKey, instance);
  return instance;
}

export default createI18n;
