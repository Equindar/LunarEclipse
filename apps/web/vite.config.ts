import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    manifest: true,
    outDir: 'dist/client',
    rollupOptions: { input: 'src/client/main.ts' },
  },
  server: { port: 5173, cors: true },
})
