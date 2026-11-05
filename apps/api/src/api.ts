import { Hono } from 'hono';
import type { HonoOptions } from 'hono/hono-base';
import type { JwtVariables } from 'hono/jwt';
import { requestId, type RequestIdVariables } from 'hono/request-id';
import { NotFoundError } from './errors/NotFoundError.js';
import authMiddleware from './middleware/auth.middleware.js';
import responseTimeMiddleware from './middleware/custom.middleware.js';
import router from './routes/index.route.js';
import type { AuthClaims } from './services/auth/auth.types.js';
import logger from './utils/logger.js';

const requestLogger = logger.child({ module: 'Request' });

type env = { Variables: RequestIdVariables & JwtVariables & { auth: AuthClaims } };

const appOptions: HonoOptions<env> = {};
const api = new Hono<env>(appOptions);

// --- Registering Middlewares
api.use(requestId());
api.use(responseTimeMiddleware);
api.use(authMiddleware);
api.use('*', async (c, next) => {
  // --- Example: Logging
  requestLogger.http(`[${c.req.method}] [ID: ${c.get('requestId')}] ${c.req.url}`);
  await next();
});

// --- Registering Routes
// Main Router for the API
api.route('/api', router);
// Fallback-Routes for the API
api.notFound((c) => c.json({ error: 'Not found' }, 404));
api.onError((err, c) => {
    c.json({ error: 'Internal error' }, 500)
    logger.error("Oupsi, an error occured!");
    throw new NotFoundError('Resource not found: ' + err.message);
  })


// Export für den typsicheren RPC-Client (hc<ApiType>)
export default api;
export type ApiType = typeof api;
