import { asEmail, User, asUserID } from '@lunareclipse/features/users';
import { UserRow } from './UserDataSource.';


export const toDomain = (row: UserRow): User => {
  return User.create({
    uuid: asUserID(row.pId),
    name: row.nickname,
    email: asEmail("row.email"), // ToDo
  })
};


export const toRow = (user: User): Omit<UserRow, 'id'> => (
//   {
//   pId: user.uuid.toString(),
//   nickname: user.name,
//   email: user.email.toString(),
// }
);
