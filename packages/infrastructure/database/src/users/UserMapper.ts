import { User } from '@lunareclipse/features/users';
import type { UserRow } from './UserDataSource.interface.js';

export const toDomain = (row: UserRow): User =>
  new User(row.id, row.uuid as User['uuid'], row.name, row.email);

export const toRow = (user: User): Omit<UserRow, 'id'> => ({
  uuid: user.uuid,
  name: user.name,
  email: user.email,
});
