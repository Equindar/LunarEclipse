import { Hono } from 'hono'
import { data } from './data/index.js'
import { web } from './web/index.js';
import type { HonoOptions } from 'hono/hono-base';
import { requestId, type RequestIdVariables } from 'hono/request-id';
import responseTimeMiddleware from './shared/middleware/custom.middleware.js';

type env = { Variables: RequestIdVariables };

const appOptions: HonoOptions<env> = {};

const api = new Hono<env>(appOptions);

// --- Registering Middlewares
api.use(requestId());
api.use(responseTimeMiddleware);
api.use('*', async (c, next) => {
  // --- Example: Logging
  console.log(`[${c.req.method}] [ID: ${c.get('requestId')}] ${c.req.url}`);
  await next();
});

// --- Registering Routes
api
  .route('/api', data)
  .route('/', web);

export default api;
export type ApiType = typeof api;
