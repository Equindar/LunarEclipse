import { BaseAction } from "../actions/Base";
import { Fighter } from "../Fighter";
import { DamageByFighter } from "./Damage";
import { RoundContext } from "./RoundContext";

export enum ActionType {
  NONE = "X",
  ATTACK = "A",
  DEFEND = "V",
  UTILITY = "N",
  UTILITY_ATTACK = "Na",
  UTILITY_DEFEND = "Nv",
}

export interface ActionContext {
  self: {
    character: Fighter;
    action: BaseAction;
    tempo: number;
    impact: number;
  };
  target: {
    character: Fighter;
    action: BaseAction;
    tempo: number;
    impact: number;
  };
  ctxRound?: RoundContext

  // Ergebnisfelder, die Regeln füllen:
  damageCaused?: DamageByFighter;
  damageDealt?: DamageByFighter;
  damageReceived?: DamageByFighter;
  damageTaken?: DamageByFighter;

  log?: string[];
}
