import { CountdownCard } from '@lunareclipse/design';
import createI18n, { toSupportedLanguage } from '@lunareclipse/i18n';
import { Hono } from 'hono';
import { raw } from 'hono/html';
import { AppBar } from '../templates/appBar';
import { Layout } from '../templates/layout';

export const defaultRouter = new Hono().get('/', async (c) => {
  const language = toSupportedLanguage(c.get('language'));
  const i18n = await createI18n(language, ['common']);
  const t = i18n.t.bind(i18n);

  const countdownCard = CountdownCard({
    id: "jksdnkvnd",
    targetMs: Date.now() + 3 * 60 * 100 * 1000
   });



  return c.html(
    <Layout title="Default Page">
      <AppBar currentLang={language} currentPath={c.req.path} />
      <h1>Default Page</h1>
      <div class="flex justify-center items-center">
        {raw(countdownCard)}
      </div>
    </Layout>
  );
});
