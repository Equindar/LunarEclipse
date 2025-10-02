import { NextFunction, Request, Response, Router } from 'express';
import { getCharacter } from '@features/characters/application/logic/getCharacter.usecase';
import CharacterRepositoryImpl from '@features/characters/application/repositories/Character.repository';
import { CharacterDataSourceImpl } from '@features/characters/data/datasources/Character.datasource';
import logger from '../utils/apiLogger';
import { Database } from '../app';

export default class CharactersController {
    public database;

    constructor(db: Database) {
        this.database = db;
    }


    // UseCase in Feature/application
    public onGetCharacter_new = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(`${req.params.id}`);
            const data = await new getCharacter(new CharacterRepositoryImpl(new CharacterDataSourceImpl(this.database))).execute(id);
            return res.status(201).json(data);
        }
        catch (error) {
            next(error);
        }

    };

    async onListCharacters(req: Request, res: Response, next: NextFunction) {
        logger.info(this.database);
        return res.status(201).json({ message: "kein error" });

    };

    // async onCreateCharacter(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const body = req.body;
    //         const data = await this.interactor.createCharacter(body);
    //         return res.status(201).json(data);
    //     }
    //     catch (error) {
    //         next(error);
    //     }
    // };

    async onUpdateCharacter(req: Request, res: Response, next: NextFunction) { };
}