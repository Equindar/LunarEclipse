import { Hono } from 'hono';
import { asUserID, CreateUser, GetUser } from '@lunareclipse/features/users';
import { createDatabaseConnection, createUserRepository } from '@lunareclipse/database';
import { Uuid7UserIDGenerator } from '@lunareclipse/helpers';

const db = await createDatabaseConnection();

const idGenerator = new Uuid7UserIDGenerator();
const userRepository = await createUserRepository(db);

const createUserUseCase = new CreateUser(userRepository, idGenerator);
const getUserUseCase = new GetUser(userRepository)

const app = new Hono();

app.post('/', async (c) => {
  const user = await createUserUseCase.execute({
    displayName: 'John Doe',
    email: 'john.doe@example.com'
  });
  return c.json({ data: user });
});

app.get('/:uuid', async (c) => {
  const user = await getUserUseCase.execute({
    uuid: asUserID(c.req.param('uuid')),
  });
  return c.json({ data: user });
});



export default app;
