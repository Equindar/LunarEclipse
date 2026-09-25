import { CreateUser } from '@lunareclipse/features/users';
import { createDatabaseConnection, createUserRepository } from '@lunareclipse/database';
import { Uuid7UserIDGenerator } from '@lunareclipse/helpers';

const db = await createDatabaseConnection();

const idGenerator = new Uuid7UserIDGenerator();
const userRepository = await createUserRepository(db);

const createUserUseCase = new CreateUser(userRepository, idGenerator);
