import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const manifestPath = 'public/static/.vite/manifest.json';
const outPath = 'src/generated/asset-manifest.ts';
const stub = process.argv.includes('--stub');

mkdirSync(dirname(outPath), { recursive: true });

if (stub) {
  // Nur anlegen, wenn noch nichts da ist, damit ein echter Stand nicht überschrieben wird
  if (!existsSync(outPath)) {
    writeFileSync(outPath, 'export default {} as const;\n');
  }
} else {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  writeFileSync(
    outPath,
    `export default ${JSON.stringify(manifest, null, 2)} as const;\n`,
  );
}
