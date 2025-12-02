import { NextFunction, Request, Response } from 'express';
import UserDataSourceImpl from '@features/users/data/datasources/User.datasource';
import UserRepositoryImpl from '@features/users/application/repositories/user.repository';
import createUser from '@features/users/application/logic/createUser.usecase'
import getUser from '@features/users/application/logic/getUser.usecase';
import logger from '../utils/apiLogger';
import listUsers from '@features/users/application/logic/listUsers.usecase';
import { Database } from '../app';
import { UserDTO } from '../data/dtos/user';

export default class UsersController {
  public database;

  constructor(db: Database) {
    this.database = db;
  }


  // UseCase in Feature/application
  public onCreateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await new createUser(new UserRepositoryImpl(new UserDataSourceImpl(this.database))).execute(req.body);
      return res.sendStatus(201);
    }
    catch (error) {
      next(error);
    }
  };

  public onGetUser = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(`${req.params.id}`);
    const data = await new getUser(new UserRepositoryImpl(new UserDataSourceImpl(this.database))).execute(id);
    return res.status(200).send(UserDTO.fromEntity(data!));

  };

  public onListUsers = async (req: Request, res: Response, next: NextFunction) => {
    const data = await new listUsers(new UserRepositoryImpl(new UserDataSourceImpl(this.database))).execute();
    const result: UserDTO[] = []
    data.forEach(item => { result.push(UserDTO.fromEntity(item)) });
    return res.status(200).send(result);
  };
}
