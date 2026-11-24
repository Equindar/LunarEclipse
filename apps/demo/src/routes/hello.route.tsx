import createI18n, { toSupportedLanguage } from '@lunareclipse/i18n';
import { Hono } from 'hono';
import { AppBar } from '../templates/appBar.js';
import { Layout } from '../templates/layout.js';


export const helloRouter = new Hono().get('/', async (c) => {
  const language = toSupportedLanguage(c.get('language'));
  const i18n = await createI18n(language, ['common']);
  const t = i18n.t.bind(i18n);

  return c.html(
    <Layout title="Hello World">
      <AppBar currentLang={language} currentPath={c.req.path} />
      <h1 class="font-bold text-xl">{t('welcome', { name: 'Marius' })}</h1>
      {t('admin:users.deleteUser')}
    </Layout>,
  );
});
