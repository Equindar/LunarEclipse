import { Button } from '@lunareclipse/design';
import createI18n, { toSupportedLanguage } from '@lunareclipse/i18n';
import { Hono } from 'hono';
import { raw } from 'hono/html';
import { AppBar } from '../templates/appBar.js';
import { Layout } from '../templates/layout.js';

export const defaultRouter = new Hono().get('/', async (c) => {
  const language = toSupportedLanguage(c.get('language'));
  const i18n = await createI18n(language, ['common']);
  const t = i18n.t.bind(i18n);

  const button = Button({
    variant: "default",
    size: "lg",
    attributes: {
      "data-on-click": "@post('/api/delete')",
    },
    children: "Löschen",
  });

  const counterButton = Button({
    variant: "secondary",
    attributes: {
      "data-signals": "{count: 0}",
      "data-on-click": "$count++",
      "data-text": "$count",
    },
  });


  return c.html(
    <Layout title="Default Page">
      <AppBar currentLang={language} currentPath={c.req.path} />
      <h1>Default Page</h1>
      {raw(button)}<br />
      {raw(counterButton)}
    </Layout>
  );
})
