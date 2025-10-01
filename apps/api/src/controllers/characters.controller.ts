import { NextFunction, Request, Response, Router } from 'express';
import { ICharacterInteractor } from '../types/ICharacterInteractor';
import { getCharacter } from '@features/characters/application/logic/getCharacter.usecase';
import CharacterRepositoryImpl from '@features/characters/application/repositories/Character.repository';

export default class CharactersController {

    // Interactor Thingy
    // async onGetCharacter(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const id = parseInt(`${req.params.id}`);
    //         const data = await this.interactor.getCharacter(id);
    //         return res.status(201).json(data);
    //     }
    //     catch (error) {
    //         next(error);
    //     }

    // };


    // UseCase in Feature/application
    async onGetCharacter_new(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(`${req.params.id}`);
            const data = await new getCharacter(new CharacterRepositoryImpl).execute(id);
            return res.status(201).json(data);
        }
        catch (error) {
            next(error);
        }

    };

    async onListCharacters(req: Request, res: Response, next: NextFunction) { };

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