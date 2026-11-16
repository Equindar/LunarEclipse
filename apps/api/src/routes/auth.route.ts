import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { registerAuthSchema } from '../validations/auth.schema';

const app = new Hono();

app.get('/register', zValidator("json", registerAuthSchema), async (c) => {
  const { username, password } = c.req.valid("json");
});

app.get('/login', (c) => c.text('OK', 200));



export default app;
