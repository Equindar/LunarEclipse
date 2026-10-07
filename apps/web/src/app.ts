import { Hono } from 'hono';
import { csrf } from 'hono/csrf';
import type { HonoOptions } from 'hono/hono-base';
import { requestId, type RequestIdVariables } from 'hono/request-id';
import { secureHeaders } from 'hono/secure-headers';
import { languageMiddleware } from './middleware/language.middleware.js';
import { pages } from './routes/hello.route.js';
import languageRouter from './routes/language.route.js';

type env = { Variables: RequestIdVariables };

const appOptions: HonoOptions<env> = {};

const app = new Hono<env>(appOptions);

// --- Registering Middlewares
app.use(secureHeaders());
app.use(csrf());
app.use(languageMiddleware);
app.use(requestId());
// hier z.B. Session-Middleware (Cookies)

app.use('*', async (c, next) => {
  // --- Example: Logging
  console.log(`[${c.req.method}] [ID: ${c.get('requestId')}] ${c.req.url}`);
  await next();
});

// --- Registering Routes
app.route('/hello', pages);         // GET /  → komplette HTML-Seite
app.route('/language', languageRouter)

app.notFound((c) => c.html('<h1>404</h1>', 404));

export default app;
export type ApiType = typeof app;
