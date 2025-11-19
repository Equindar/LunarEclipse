import { FighterId } from "../Fighter";
import { RuleRegistry } from "../RuleRegistry";
import { ActionPhase } from "./ActionPhase";
import { ICombatContext } from "./CombatContext";
import { FighterAction } from "./FighterAction";
import { IRoundContext } from "./RoundContext";
import { RoundFighterState } from "./RoundFighterState";

export interface IActionContext {
  // Actor
  actor: {
    id: FighterId,
    state: RoundFighterState,
    action: FighterAction
  }

  // Target(s)
  targets?: [{
    id: FighterId;
    state: RoundFighterState;
    action: FighterAction;
    primary?: boolean;
  }]

  // fighter: Map<FighterId, FighterAction>
  phase?: ActionPhase;
  ctxRound: IRoundContext;
  readonly ctxCombat?: ICombatContext;

  log?: string[];
  cancelled: boolean;

  execute(perspective: ActionPhase, registry?: RuleRegistry): void;
  commit(): void;

}
