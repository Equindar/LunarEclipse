import { readFileSync, writeFileSync } from 'node:fs';

const manifest = JSON.parse(
  readFileSync('public/static/.vite/manifest.json', 'utf8'),
);

writeFileSync(
  'src/generated/asset-manifest.ts',
  `export default ${JSON.stringify(manifest, null, 2)} as const;\n`,
);
