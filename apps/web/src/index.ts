import { serve } from '@hono/node-server';
import app from './app.js';
import configuration from './config.js';

serve(
  {
    fetch: app.fetch,
    port: configuration.app.port,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
