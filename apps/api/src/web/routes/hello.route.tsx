import { Hono } from 'hono';
import createI18n, { toSupportedLanguage } from '@lunareclipse/i18n';
import { Layout } from '../components/layout';
import { AppBar } from '../components/AppBar';


export const pages = new Hono().get('/', async (c) => {
  const language = toSupportedLanguage(c.get('language'));
  const i18n = await createI18n(language, ['common']);
  const t = i18n.t.bind(i18n);

  return c.html(
    <Layout title="Hello World">
      <AppBar currentLang={language} currentPath={c.req.path} />
      <h1>{t('welcome', { name: 'Marius' })}</h1>
    </Layout>,
  );
});
