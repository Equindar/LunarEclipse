import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss()],
  publicDir: false,
  build: {
    outDir: 'build/client',
    emptyOutDir: true,
    manifest: true, // erzeugt build/client/.vite/manifest.json
    rollupOptions: {
      input: 'src/www/index.ts',
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    cors: true,
  },
})
