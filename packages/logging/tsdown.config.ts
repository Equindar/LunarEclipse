import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs','esm'],
  platform: 'node',
  target: 'node24',
  dts: true,
  clean: true,
  tsconfig: 'tsconfig.build.json',
  outDir: 'build'
})
