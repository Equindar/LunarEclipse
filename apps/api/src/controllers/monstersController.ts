import { Router, Request, Response } from 'express';
import { Monster } from 'packages/features/monsters/core/entities/monster';
import { createMonster_UseCase } from 'packages/features/monsters/core/interfaces/createMonster-usecase';
import { getMonsterUseCase } from 'packages/features/monsters/core/interfaces/getMonster-usecase';


export default function MonsterController(
  getMonster: getMonsterUseCase,
  createMonster: createMonster_UseCase,
) {
  const router = Router();
  return router;
}

export const createMonster = async (req: Request, res: Response<Monster>) => {
  res.status(200).json({ name: "Rat", health: 150, short_description: "short", description: "long desc", level: 1 });
}
