import { serveStatic } from '@hono/node-server/serve-static';
import { setMissingKeyHandler } from '@lunareclipse/i18n';
import { Hono } from 'hono';
import { csrf } from 'hono/csrf';
import type { HonoOptions } from 'hono/hono-base';
import { requestId, type RequestIdVariables } from 'hono/request-id';
import { secureHeaders } from 'hono/secure-headers';
import { languageMiddleware } from './middleware/language.middleware.js';
import databaseRouter from './routes/database.route.js';
import { defaultRouter } from './routes/default.route.js';
import { helloRouter } from './routes/hello.route.js';
import languageRouter from './routes/language.route.js';
import logger from './utils/logger.js';

const i18nLogger = logger.child({ module: 'i18n' });
setMissingKeyHandler(({ lngs, namespace, key }) => {
  i18nLogger.warn(`Fehlende Übersetzung: Key "${key}" in Namespace "${namespace}" für Sprache(n) [${lngs.join(', ')}]`);
});

type env = { Variables: RequestIdVariables };

const appOptions: HonoOptions<env> = {};

const app = new Hono<env>(appOptions);
export type ApiType = typeof app;

// --- Registering Middlewares
app.use(secureHeaders());
app.use(csrf());
app.use(languageMiddleware);
app.use(requestId());
// app.use('/datastar-1.0.4.js', serveStatic({ root: './public' }))
// hier z.B. Session-Middleware (Cookies)

app.use('*', async (c, next) => {
  // --- Example: Logging
  logger.http(`[${c.req.method}] [ID: ${c.get('requestId')}] ${c.req.url}`);
  await next();
});

// --- Registering Routes
app.route('/hello', helloRouter);
app.route('/language', languageRouter);
app.route('/database', databaseRouter);
app.route('/', defaultRouter);

if (process.env.NODE_ENV === 'production') {
  app.use('/*', serveStatic({ root: './build/client' }))
}

app.notFound((c) => c.html('<h1>404</h1>', 404));

export default app;
