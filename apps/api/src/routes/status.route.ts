import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  let value: number = Math.floor(Math.random() * 100);
  return c.json({ data: { online: true, latency: value } });
});

export default app;
