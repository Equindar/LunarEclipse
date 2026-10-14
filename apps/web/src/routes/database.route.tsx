import { createDatabaseConnection } from '@lunareclipse/database';
import { createUserRepository } from '@lunareclipse/database/users';
import { GetUser } from '@lunareclipse/features/users';
import { toSupportedLanguage } from '@lunareclipse/i18n';
import { Hono } from 'hono';
import { AppBar } from '../templates/appBar.js';
import { Layout } from '../templates/layout.js';

const db = await createDatabaseConnection();

const userRepository = await createUserRepository(db);
const getUserUseCase = new GetUser(userRepository)
// const data = getUserUseCase.execute({uuid: ""})
console.log(db);


const router = new Hono().get('/', async (c) => {
  const language = toSupportedLanguage(c.get('language'));

  return c.html(
    <Layout title="Database Connection">
      <AppBar currentLang={language} currentPath={c.req.path} />
      <h1 class="font-bold text-xl">Database Connection Test</h1>
      <p>{db}</p>
    </Layout>,
  );
});

export default router;
