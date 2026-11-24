import buildVercel from '@hono/vite-build/vercel';
import devServer, { defaultOptions } from '@hono/vite-dev-server';
import nodeAdapter from '@hono/vite-dev-server/node';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type PluginOption } from 'vite';
import logger from './src/utils/vite.logger.js';

const serverEntry = './src/index.ts';
const clientEntry = './src/www/index.ts';

export default defineConfig(({ command, mode }) => {
  const plugins: PluginOption[] = [tailwindcss()];

  // Client-Build
  if (mode === 'client') {
    return {
      customLogger: logger,
      plugins,
      build: {
        outDir: 'public/static',
        emptyOutDir: true,
        copyPublicDir: false,
        manifest: true,
        rollupOptions: {
          input: clientEntry,
        },
      },
    };
  }

  // Lokale Entwicklung
  if (command === 'serve') {
    plugins.push(
      devServer({
        entry: serverEntry,
        adapter: nodeAdapter,
        exclude: [...defaultOptions.exclude],
      }),
    );
  } else {
    // Vercel-Produktions-Build
    plugins.push(
      buildVercel({
        entry: serverEntry,
      }),
    );
  }

  return {
    customLogger: logger,
    plugins,
    server: {
      port: 3001,
    },
    build: {
      // Server-Chunks innerhalb der Vercel Function ablegen
      assetsDir: 'functions/__hono.func/assets',
    },
  };
});
