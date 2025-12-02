import { NextFunction, Request, Response, Router } from 'express';
import { getCharacter } from '@features/characters/application/logic/getCharacter.usecase';
import CharacterRepositoryImpl from '@features/characters/application/repositories/Character.repository';
import { CharacterDataSourceImpl } from '@features/characters/data/datasources/Character.datasource';
import { Database } from '../app';
import { CharacterDTO } from '../data/dtos/character';
import createCharacter from '@features/characters/application/logic/createCharacter.usecase';
import { listCharacters } from '@features/characters/application/logic/listCharacters.usecase';
import updateCharacter from '@features/characters/application/logic/updateCharacter.usecase';

export default class CharactersController {
  public database;

  constructor(db: Database) {
    this.database = db;
  }


  // UseCase in Feature/application
  public onGetCharacter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(`${req.params.id}`);
      const data = await new getCharacter(new CharacterRepositoryImpl(new CharacterDataSourceImpl(this.database))).execute(id);
      return res.status(200).send(CharacterDTO.fromEntity(data!));
    }
    catch (error) {
      next(error);
    }

  };

  public onListCharacters = async (req: Request, res: Response, next: NextFunction) => {
    const data = await new listCharacters(new CharacterRepositoryImpl(new CharacterDataSourceImpl(this.database))).execute();
    const result: CharacterDTO[] = []
    data.forEach(item => { result.push(CharacterDTO.fromEntity(item)) });
    return res.status(200).send(result);
  };

  public onCreateCharacter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await new createCharacter(new CharacterRepositoryImpl(new CharacterDataSourceImpl(this.database))).execute(req.body.character, req.body.userId);
      return res.sendStatus(201);
    }
    catch (error) {
      next(error);
    }
  };

  public onUpdateCharacter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(`${req.params.id}`);
      await new updateCharacter(new CharacterRepositoryImpl(new CharacterDataSourceImpl(this.database))).execute(id, req.body.character);
      return res.sendStatus(200);
    }
    catch (error) {
      next(error);
    }

  };
}
