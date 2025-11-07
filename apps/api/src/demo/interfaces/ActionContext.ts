import { BaseAction } from "../actions/Base";
import { Fighter } from "../Fighter";
import { CombatContext } from "./CombatContext";
import { RoundContext } from "./RoundContext";

export interface ActionContext {
  self: {
    character: Fighter;
    action: BaseAction;
    tempo: number;
    impact: number;
    nextAttackBonus: number;
    nextDefenseBonus: number;
  };
  target: {
    character: Fighter;
    action: BaseAction;
    tempo: number;
    impact: number;
    nextAttackBonus: number;
    nextDefenseBonus: number;
  };
  ctxRound: RoundContext;
  readonly ctxCombat?: CombatContext;

  actionLog?: string[];
}
