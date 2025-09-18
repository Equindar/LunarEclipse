/// <reference types="vitest" />
import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import i18nHotReload from '../../frontend/src/lib/i18n/i18n-hot-reload';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: './build',
  },
  plugins: [react(), svgr(), i18nHotReload(),],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
});
