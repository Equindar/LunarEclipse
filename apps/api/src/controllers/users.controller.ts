import { NextFunction, Request, Response } from 'express';
import { Database } from '../app';
import UserDataSourceImpl from '@features/users/data/datasources/user.datasource';
import UserRepositoryImpl from '@features/users/application/repositories/user.repository';
import createUser from '@features/users/application/logic/createUser.usecase'
import getUser from '@features/users/application/logic/getUser.usecase';
import logger from '../utils/apiLogger';

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
        logger.debug(data);
        return res.status(200).send(data);

    };
}
