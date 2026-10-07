import { readFileSync } from 'node:fs';

export interface AssetTags {
  js: string[]
  css: string[]
}

interface ManifestEntry {
  file: string
  css?: string[]
}

type Manifest = Record<string, ManifestEntry>

const ENTRY = 'src/www/index.ts'
const VITE_ORIGIN = 'http://localhost:5173'

const isDev = process.env.NODE_ENV !== 'production'

const manifest: Manifest | null = isDev
  ? null
  : JSON.parse(readFileSync('build/client/.vite/manifest.json', 'utf8'))

export const DATASTAR_SRC = '/datastar-v1.0.4.js'

export function assetTags(): AssetTags {
  if (!manifest) {
    return {
      js: [`${VITE_ORIGIN}/@vite/client`, `${VITE_ORIGIN}/${ENTRY}`],
      css: [],
    }
  }

  const entry = manifest[ENTRY]
  if (!entry) {
    throw new Error(`Manifest enthält keinen Eintrag für ${ENTRY}`)
  }

  return {
    js: [`/${entry.file}`],
    css: (entry.css ?? []).map(file => `/${file}`),
  }
}
