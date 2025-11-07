import { ActionType } from "../types/ActionType";

export type FighterId = string;

export interface RoundFighterState {
  id: FighterId;
  hp: number;
  energy: number;

  takeDamage(amount: number): void;
  gainEnergy(amount: number): void;
  applyBuff(action: ActionType): void;
  resetAttackBuff(): void;
  resetDefenseBuff(): void
}
