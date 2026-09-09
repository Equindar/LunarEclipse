import { UserRepository } from '@lunareclipse/features/users';
import type { Database } from '../client.js';
import { UserDataSourceImpl } from './UserDataSource.impl.js';
import { UserRepositoryImpl } from './UserRepository.impl.js';

export const createUserRepository = (db: Database): UserRepository =>
  new UserRepositoryImpl(new UserDataSourceImpl(db));
