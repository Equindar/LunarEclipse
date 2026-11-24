import devServer, { defaultOptions } from '@hono/vite-dev-server';
import nodeAdapter from '@hono/vite-dev-server/node';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
// import { logViteReloads } from './src/utils/logViteReloads.js';
import logger from './src/utils/vite.logger.js';


// Vite-Logger
// const viteLogger = mylogger.child({ module: 'Vite' });


export default defineConfig({
  customLogger: logger,
  plugins: [
    // logViteReloads(),
    tailwindcss(),
    devServer({
      entry: 'src/app.ts', // The file path of your application.
      adapter: nodeAdapter, // Use the Node.js adapter for Hono.
      exclude: [...defaultOptions.exclude], // Exclude node_modules and public directories from the dev server.
    }),
  ],
  build: {
    outDir: 'build/client',
    emptyOutDir: true,
    manifest: true, // erzeugt build/client/.vite/manifest.json
    rollupOptions: {
      input: 'src/www/index.ts',
    },
  },
  server: {
    port: 3001,
  },
})
