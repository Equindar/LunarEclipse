import manifest from '../generated/asset-manifest.js';

export interface AssetTags {
  js: string[];
  css: string[];
}

interface ManifestEntry {
  file: string;
  css?: string[];
}

type Manifest = Record<string, ManifestEntry>;

const ENTRY = 'src/www/index.ts';
const isDev = !import.meta.env.PROD;

export const DATASTAR_SRC = '/datastar-v1.0.4.js';

export function assetTags(): AssetTags {
  if (isDev) {
    return {
      js: [`/${ENTRY}`],
      css: [],
    };
  }

  const entry = (manifest as Manifest)[ENTRY];

  if (!entry) {
    throw new Error(`Manifest enthält keinen Eintrag für ${ENTRY}`);
  }

  return {
    js: [`/static/${entry.file}`],
    css: (entry.css ?? []).map(file => `/static/${file}`),
  };
}
