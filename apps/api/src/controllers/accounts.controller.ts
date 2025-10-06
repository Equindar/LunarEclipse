import { NextFunction, Request, Response, Router } from 'express';
import { getCharacter } from '@features/characters/application/logic/getCharacter.usecase';
import CharacterRepositoryImpl from '@features/characters/application/repositories/Character.repository';
import { CharacterDataSourceImpl } from '@features/characters/data/datasources/Character.datasource';
import logger from '../utils/apiLogger';
import { Database } from '../app';

export default class AccountsController {
    // UseCase in Feature/application
    public onLogin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info("onLogin");
            res.redirect(
                302,
                [
                    "https://equindar.eu.auth0.com/authorize",
                    "?response_type=code",
                    "&client_id=yK1VdAzhsSTUDSjt8cPfQS5M0jlv4NO9",
                    "&redirect_uri=http://localhost:3033/api/status",
                    "&audience=lunareclipse-api"
                ].join('')
            );
        }
        catch (error) {
            next(error);
        }
    };

    public onGetAccessToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info("onGetToken");
            logger.debug(req.body);
            logger.debug(req.query['code']);
            res.setHeader('Content-Type', 'application/x-www-form-urlencoded');
            res.status(200).send();

        }
        catch (error) {
            next(error);
        }
    };
}