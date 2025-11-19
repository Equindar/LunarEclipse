import { FighterId } from "../Fighter";
import { ActionPattern } from "./ActionPattern";

export interface RoundFighterState {
  id: FighterId;
  health: number;
  energy: number;
  nextAttackBonus?: number;
  nextDefenseBonus?: number;
  actions: ActionPattern;
  actionIndex: number;

  // applyBuff(action: ActionType): void;
  // resetAttackBuff(): void;
  // resetDefenseBuff(): void;
  // takeDamage(amount: number): void;
  // gainEnergy(amount: number): void;
  // gainHealth(amount: number): void;
}
