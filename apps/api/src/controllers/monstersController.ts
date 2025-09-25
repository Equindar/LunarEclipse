import { Router } from 'express';
import { createMonster_UseCase } from 'packages/features/monsters/core/interfaces/createMonster-usecase';
import { getMonsterUseCase } from 'packages/features/monsters/core/interfaces/getMonster-usecase';

export default function MonsterController(
  getMonster: getMonsterUseCase,
  createMonster: createMonster_UseCase,
) {
  const router = Router();
  return router;
}
