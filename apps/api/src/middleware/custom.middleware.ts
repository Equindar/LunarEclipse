import { createFactory } from 'hono/factory';

const factory = createFactory();

const responseTimeMiddleware = factory.createMiddleware(async (c, next) => {
  const start = performance.now();
  await next();
  const end = performance.now();
  c.res.headers.set('X-Response-Time', `${end - start}`);
});

export default responseTimeMiddleware;
