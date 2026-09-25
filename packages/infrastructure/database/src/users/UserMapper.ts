import { asEmail, User, asUserID } from '@lunareclipse/features/users';
import { UserRow } from './UserDataSource.js';


export const toDomain = (row: UserRow): User => {
  return User.create({
    uuid: asUserID(row.pId),
    name: row.nickname,
    email: asEmail("row.email"), // ToDo
  })
};


export const toRow = (user: User): Omit<UserRow, 'id'> => {
  return {
    accountId: 0, // ToDo
    createdAt: "user.createdAt",
    updatedAt: "user.updatedAt",
    pId: " ",
    nickname: user.name,
    deletedAt: null,
  };
  // return {
  //   pId: user.uuid.toString(),
  //   nickname: user.name,
  //   // email: user.email.toString(),
  // };
};
