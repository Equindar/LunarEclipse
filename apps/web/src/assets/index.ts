import { readFileSync } from 'node:fs';

const isDev = process.env.NODE_ENV !== 'production'
const manifest = isDev ? null
  : JSON.parse(readFileSync('dist/client/.vite/manifest.json', 'utf8'))

export function assetTags() {
  if (isDev) {
    return {
      js: ['http://localhost:5173/@vite/client', 'http://localhost:5173/src/client/main.ts'],
      css: [],
    }
  }
  const entry = manifest['src/www/index.ts']
  return { js: [`/${entry.file}`], css: (entry.css ?? []).map((f: string) => `/${f}`) }
}
