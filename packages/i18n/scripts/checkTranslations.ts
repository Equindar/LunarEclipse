import { readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { importModule } from '@lunareclipse/utilities';

const __dirname = dirname(fileURLToPath(import.meta.url));
const localesDir = join(__dirname, '..', 'locales');
const referenceLanguage = 'en';

type FlatKeys = Set<string>;

// Falls Locale-Dateien mal verschachtelt werden (z.B. { form: { submit: '...' } }),
// werden Keys zu "form.submit" flach gemacht – funktioniert aber auch bei rein flachen Objekten.
function flattenKeys(obj: Record<string, unknown>, prefix = ''): FlatKeys {
  const keys = new Set<string>();

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      for (const nested of flattenKeys(value as Record<string, unknown>, fullKey)) {
        keys.add(nested);
      }
    } else {
      keys.add(fullKey);
    }
  }

  return keys;
}

function getLanguageDirs(): string[] {
  return readdirSync(localesDir).filter((entry) =>
    statSync(join(localesDir, entry)).isDirectory()
  );
}

function getNamespaceFiles(language: string): string[] {
  const dir = join(localesDir, language);
  return readdirSync(dir)
    .filter((f) => f.endsWith('.ts'))
    .map((f) => f.replace(/\.ts$/, ''));
}

async function loadNamespace(language: string, namespace: string): Promise<Record<string, unknown> | null> {
  try {
    const mod = await importModule<{ default: Record<string, unknown> }>(join(localesDir, language, `${namespace}.ts`));
    return mod.default;
  } catch {
    return null;
  }
}

async function main() {
  const languages = getLanguageDirs();
  let hasIssues = false;

  if (!languages.includes(referenceLanguage)) {
    console.error(`❌ Referenzsprache "${referenceLanguage}" existiert nicht unter ${localesDir}`);
    process.exit(1);
  }

  const referenceNamespaces = getNamespaceFiles(referenceLanguage);
  const otherLanguages = languages.filter((l) => l !== referenceLanguage);

  for (const namespace of referenceNamespaces) {
    const referenceResource = await loadNamespace(referenceLanguage, namespace);
    if (!referenceResource) continue;

    const referenceKeys = flattenKeys(referenceResource);

    for (const language of otherLanguages) {
      const namespaceFiles = getNamespaceFiles(language);

      // Fall 1: komplette Namespace-Datei fehlt
      if (!namespaceFiles.includes(namespace)) {
        console.warn(`[${language}/${namespace}] Namespace-Datei fehlt: ${namespace}.ts`);
        hasIssues = true;
        continue;
      }

      const targetResource = await loadNamespace(language, namespace);
      if (!targetResource) continue;

      const targetKeys = flattenKeys(targetResource);

      // Fall 2: einzelne Keys fehlen
      const missingKeys = [...referenceKeys].filter((k) => !targetKeys.has(k));
      if (missingKeys.length > 0) {
        console.warn(
          `[${language}/${namespace}] Fehlende Keys: ${missingKeys.join(', ')}`
        );
        hasIssues = true;
      }

      // Fall 3 (optional, aber hilfreich): Keys, die es NUR in der anderen Sprache gibt (verwaist/Tippfehler)
      const extraKeys = [...targetKeys].filter((k) => !referenceKeys.has(k));
      if (extraKeys.length > 0) {
        console.warn(
          `[${language}/${namespace}] Zusätzliche Keys (nicht in ${referenceLanguage}): ${extraKeys.join(', ')}`
        );
      }
    }
  }

  if (hasIssues) {
    console.error('\n❌ Übersetzungen fehlerhaft.');
    process.exit(1); // wichtig für CI – lässt den Job fehlschlagen
  } else {
    console.log('✅ Alle Übersetzungen vollständig.');
  }
}

main();
