import { Monster } from '../entities/monster';

export interface monster_Repository {
  createMonster(monster: Monster): Promise<boolean>;
  getMonsters(): Promise<Monster[]>;
  getMonster(id: number): Promise<Monster>;
}
