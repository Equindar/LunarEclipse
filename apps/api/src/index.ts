import { serve } from '@hono/node-server'
import api from './api.js'
import configuration from './config.js'

serve(
  {
    fetch: api.fetch,
    port: configuration.app.port,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
