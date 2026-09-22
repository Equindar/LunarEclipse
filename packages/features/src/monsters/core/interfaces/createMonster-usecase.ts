import { Monster } from '../entities/monster';

export interface createMonster_UseCase {
  execute(monster: Monster): Promise<boolean>;
}
