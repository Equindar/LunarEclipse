import { Monster } from '../entities/monster';

export interface getMonsterUseCase {
  execute(id: number): Promise<Monster>;
}
