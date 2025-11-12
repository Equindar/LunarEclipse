import { BaseAction } from "../actions/Base";
import { Fighter, FighterId } from "../Fighter";
import { CombatContext } from "./CombatContext";
import { FighterAction } from "./FighterAction";
import { RoundContext } from "./RoundContext";
import { RoundFighterState } from "./RoundFighterState";

export interface ActionContext {
  // Actor
  actorId: FighterId;
  actorState: RoundFighterState;
  action: FighterAction;

  // Target(s)
  targets: FighterId[];
  targetStates: RoundFighterState[]

  fighter: Map<FighterId, FighterAction>


  ctxRound: RoundContext;
  readonly ctxCombat?: CombatContext;

  actionLog?: string[];
}
