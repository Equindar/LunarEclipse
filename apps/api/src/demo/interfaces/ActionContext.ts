
import { RoundContext } from "../contexts/RoundContext";
import { FighterId } from "../Fighter";
import { RoundFighterState } from "../RoundFighterState";
import { RuleRegistry } from "../RuleRegistry";
import { ActionPhase } from "./ActionPhase";
import { ICombatContext } from "./CombatContext";
import { FighterAction } from "./FighterAction";


export interface IActionContext {
  readonly ctxCombat: ICombatContext;
  // Actor
  actor: {
    id: FighterId,
    state: RoundFighterState,
    action: FighterAction
  }

  // Target(s)
  // ausgehend
  selectedTargets?: [{
    id: FighterId;
    state: RoundFighterState;
    action: FighterAction;
    primary?: boolean;
  }]
  // eingehend
  targettedBy?: [{
    id: FighterId;
    state: RoundFighterState;
    action: FighterAction;
    primary?: boolean;
  }];


  // fighter: Map<FighterId, FighterAction>
  phase?: ActionPhase;
  ctxRound: RoundContext;

  log?: string[];
  cancelled: boolean;

  execute(perspective: ActionPhase, registry?: RuleRegistry): void;
  commit(): void;

}
