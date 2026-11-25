import { setMissingKeyHandler } from '@lunareclipse/i18n';
import { Hono } from 'hono';
import { csrf } from 'hono/csrf';
import { requestId, type RequestIdVariables } from 'hono/request-id';
import { secureHeaders } from 'hono/secure-headers';
import type { ApplicationDependencies } from './lifecycle/initialize.js';
import { languageMiddleware } from './middleware/language.middleware.js';
import { combatRouter } from './routes/combatlog.route.js';
import { defaultRouter } from './routes/default.route.js';
import { helloRouter } from './routes/hello.route.js';
import languageRouter from './routes/language.route.js';
import { newsRouter } from './routes/news.route.js';
import { ordersRouter } from './routes/orders.route.js';
import logger from './utils/logger.js';

const i18nLogger = logger.child({ module: 'i18n' });
setMissingKeyHandler(({ lngs, namespace, key }) => {
  i18nLogger.warn(`Fehlende Übersetzung: Key "${key}" in Namespace "${namespace}" für Sprache(n) [${lngs.join(', ')}]`);
});

export type AppEnv = {
  Variables: RequestIdVariables;
};

export function createApp({
  configuration,
  logger,
}: ApplicationDependencies) {
  const app = new Hono<AppEnv>();


  // --- Registering Middlewares
  app.use('*', requestId());
  app.use('*', secureHeaders());
  app.use('*', csrf());
  app.use('*', languageMiddleware);
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
  app.route('/orders', ordersRouter);
  app.route('/news', newsRouter);
  app.route('/combat', combatRouter);
  app.route('/', defaultRouter);

  // Error Handling
  app.notFound((c) => c.html('<h1>404</h1>', 404));


  logger.info(`${configuration.app.name} application created`);
  return app;
}
