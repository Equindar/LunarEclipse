import { Hono } from 'hono';
import { setCookie } from 'hono/cookie';

const languageRouter = new Hono();

languageRouter.get('/:lang', (c) => {
  const lang = c.req.param('lang');
  const redirectTo = c.req.query('redirect') ?? '/';

  const safeRedirect = redirectTo.startsWith('/') ? redirectTo : '/';

  setCookie(c, 'language', lang, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 Jahr
    sameSite: 'Lax',
    httpOnly: false,
  });

  return c.redirect(safeRedirect, 302);
});

export default languageRouter;
