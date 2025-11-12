import { FighterId } from "../Fighter";
import { ActionType } from "../types/ActionType";
import { ActionPattern } from "./ActionPattern";

export interface RoundFighterState {
  id: FighterId;
  hp: number;
  energy: number;
  actions: ActionPattern;

  takeDamage(amount: number): void;
  gainEnergy(amount: number): void;
  gainHealth(amount: number): void;
  applyBuff(action: ActionType): void;
  resetAttackBuff(): void;
  resetDefenseBuff(): void
}
