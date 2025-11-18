import logger from "../../utils/apiLogger";
import { FighterId } from "../Fighter";
import { IActionContext } from "../interfaces/ActionContext";
import { ActionPhase } from "../interfaces/ActionPhase";
import { ICombatContext } from "../interfaces/CombatContext";
import { FighterAction } from "../interfaces/FighterAction";
import { IRoundContext } from "../interfaces/RoundContext";
import { RoundFighterState } from "../interfaces/RoundFighterState";
import { RuleRegistry } from "../RuleRegistry";

export class ActionContext implements IActionContext {
  actor!: {
    id: FighterId;
    state: RoundFighterState;
    action: FighterAction;
  };
  targets?: [{
    id: FighterId;
    state: RoundFighterState;
    action: FighterAction;
    primary: boolean;
  }];

  phase?: ActionPhase;
  ctxRound!: IRoundContext;
  ctxCombat?: ICombatContext;
  log?: string[] = [];
  cancelled: boolean = false;

  constructor() { }

  build(params: {
    roundCtx: IRoundContext;
    actorId: FighterId;
    patternIndex?: number;
    targetSelector?: (roundCtx: IRoundContext, actorId: FighterId, action: FighterAction) => FighterId[];
    combatCtx?: ICombatContext;
    allowAutoOtherAction?: boolean;
  }) {
    logger.warn("ActionContext.build()")
    const { roundCtx, actorId, patternIndex = undefined, targetSelector = undefined, combatCtx, allowAutoOtherAction = true } = params;

    const actorState = roundCtx.fighters.get(actorId);
    if (!actorState) throw new Error("build ActionContext: actor not found: " + actorId);

    // pick actionEntry from actor.actions.pattern[actionIndex] or provided patternIndex
    const idx = patternIndex ?? actorState.actionIndex ?? 0;
    const pattern = actorState.actions?.pattern ?? [];
    const action = pattern[Math.min(idx, Math.max(0, pattern.length - 1))];
    if (!action) throw new Error(`build ActionContext: no action entry for actor ${actorId} at index ${idx}`);

    this.ctxRound = roundCtx;
    this.ctxCombat = combatCtx;
    this.actor = {
      id: actorId,
      state: actorState,
      action: action
    }

    // default naive target selection
    const selector = targetSelector ?? ((rc: IRoundContext, aid: FighterId) => {
      // fallback: first other fighter or self
      for (const id of rc.fighters.keys()) {
        if (id !== aid) return [id];
      }
      return [aid];
    });

    selector(roundCtx, actorId, action).forEach(item => {
      const enemy = roundCtx.fighters.get(item);
      const newTarget = {
        id: item,
        state: enemy!,
        action: enemy?.actions.pattern[enemy.actionIndex ?? 0]!,
        primary: selector(roundCtx, actorId, action)[0] === item
      }
      this.targets ? this.targets.push(newTarget) : this.targets = [newTarget];
    });

    this.phase = "preAction";
    this.log = [];
    this.cancelled = false;
  }

  /** execute führt die passende resolveAsX Methode der BaseAction aus */
  execute(perspective: ActionPhase, registry?: RuleRegistry) {

    logger.warn("ActionContext.execute()");
    // Bekommt perspective Engage/Reaction/Moment
    // führt registry.applyPhase.preAction aus
    // Check auf Action-cancelled
    // Energiekosten berechnen und wenn nicht ausreichend, impact oder tempo runterschrauben
    // Energiekosten anwenden
    // BaseAction.ResolveAs[X] aufrufen basierend auf perspective
    // führt registry.applyPhase.postAction aus
    // Push actionLog zu roundLog


    if (this.cancelled) return;
    this.phase = perspective === "Engage" ? "Engage" : perspective === "Reaction" ? "Reaction" : "Moment";

    // allow preAction rules to run earlier (Engine usually calls this)
    // call the action implementation
    const base = this.actor.action.action;
    logger.debug(base.type);
    try {
      if (perspective === "Engage") {
        if (base.resolveAsEngage) base.resolveAsEngage(this);
        else if (base.resolveAsMoment) base.resolveAsMoment(this);
      } else if (perspective === "Reaction") {
        if (base.resolveAsReaction) base.resolveAsReaction(this);
        else if (base.resolveAsEngage) base.resolveAsEngage(this);
      } else {
        if (base.resolveAsMoment) base.resolveAsMoment(this);
        else if (base.resolveAsEngage) base.resolveAsEngage(this);
      }
    } catch (err) {
      this.ctxRound.log.push(`[action-error] actor=${this.actor.id} err=${String(err)}`);
    }
  }

  commit(): void {

  }
}
