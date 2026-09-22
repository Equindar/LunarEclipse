import { Monster } from '../entities/monster';

export interface getMonsters_UseCase {
  execute(): Promise<Monster[]>;
}
