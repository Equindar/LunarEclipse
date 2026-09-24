import { Hono } from 'hono';
import { CreateUser, type CreateUserInput } from '@lunareclipse/features/users';
import { createDatabaseConnection, createUserRepository } from '@lunareclipse/database';
import { Uuid7UserIDGenerator } from '@lunareclipse/helpers';

const db = await createDatabaseConnection();

const idGenerator = new Uuid7UserIDGenerator();
const userRepository = await createUserRepository(db);

const createUserUseCase = new CreateUser(userRepository, idGenerator);

const app = new Hono();

app.post('/', async (c) => {
  const user = await createUserUseCase.execute({
    displayName: 'John Doe',
    email: 'john.doe@example.com'
  });
  return c.json({ data: user });
});

export default app;
