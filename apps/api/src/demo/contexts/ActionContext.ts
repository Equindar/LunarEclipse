import logger from "../../utils/apiLogger";
import { NoneAction } from "../actions/None";
import { FighterId } from "../Fighter";
import { IActionContext } from "../interfaces/ActionContext";
import { ActionPhase } from "../interfaces/ActionPhase";
import { ICombatContext } from "../interfaces/CombatContext";
import { FighterAction } from "../interfaces/FighterAction";
import { RoundFighterState } from "../RoundFighterState";
import { RuleRegistry } from "../RuleRegistry";
import { RoundContext } from "./RoundContext";

export class ActionContext implements IActionContext {
  //** Akteur der Aktion */
  actor!: {
    id: FighterId;
    state: RoundFighterState;
    action: FighterAction;
  };
  //** Vom Akteur ausgewählte Ziele (ausgehend) */
  selectedTargets?: [{
    id: FighterId;
    state: RoundFighterState;
    action: FighterAction;
    primary: boolean;
  }];
  //** Als Ziel ausgewählt (eingehend) */
  targettedBy?: [{
    id: FighterId;
    state: RoundFighterState;
    action: FighterAction;
    primary: boolean;
  }];

  scheduledTime?: number;
  phase?: ActionPhase;
  ctxRound!: RoundContext;
  ctxCombat!: ICombatContext;
  log?: string[] = [];
  cancelled: boolean = false;

  constructor() { }

  build(params: {
    combatCtx: ICombatContext;
    roundCtx: RoundContext;
    actorId: FighterId;
    actionIndex?: number;
    targetSelector?: (roundCtx: RoundContext, actorId: FighterId, action: FighterAction) => FighterId[];
    allowAutoOtherAction?: boolean;
  }) {

    // --- logger.warn("ActionContext.build()")
    const { roundCtx, actorId, actionIndex = undefined, targetSelector = undefined, combatCtx, allowAutoOtherAction = true } = params;
    const actorState = roundCtx.fighters.get(actorId);
    if (!actorState) throw new Error("build ActionContext: actor not found: " + actorId);

    // pick actionEntry from actor.actions.pattern[actionIndex] or provided patternIndex
    const idx = actorState.actionIndex ?? actionIndex ?? 0;
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
    const selector = targetSelector ?? ((rc: RoundContext, aid: FighterId) => {
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
      this.selectedTargets ? this.selectedTargets.push(newTarget) : this.selectedTargets = [newTarget];
    });

    this.phase = "preAction";
    this.log = [];
    this.cancelled = false;

    const baseOffset = 1000;
    const tempoStep = 100;
    const investedTempo = this.actor.action.investedTempo ?? 0;
    const combatElapsed = this.scheduledTime ?? this.ctxCombat.time.elapsed ?? 0;
    this.scheduledTime = combatElapsed + Math.max(0, baseOffset - (investedTempo * tempoStep));
  }

  /** execute führt die passende resolveAsX Methode der BaseAction aus */
  execute(perspective: ActionPhase, registry?: RuleRegistry) {
    // --- logger.warn("ActionContext.execute()");

    // Bekommt perspective Engage/Reaction/Moment
    // führt registry.applyPhase.preAction aus
    // Check auf Action-cancelled
    // Energiekosten berechnen und wenn nicht ausreichend, impact oder tempo runterschrauben
    // Energiekosten anwenden
    // BaseAction.ResolveAs[X] aufrufen basierend auf perspective
    // führt registry.applyPhase.postAction aus
    // Push actionLog zu roundLog


    if (this.cancelled) return;
    this.phase = perspective;

    // allow preAction rules to run earlier (Engine usually calls this)
    // call the action implementation
    var base = this.actor.action.action;
    logger.debug(`${this.actor.id} benutzt: ${base.type} [t${this.actor.action.investedTempo},i${this.actor.action.investedImpact}] als [${perspective}]`);

    const energyCost = base.totalEnergyCost(this.actor.action);
    if (this.actor.state.energy < energyCost) {
      logger.debug(`${this.actor.id} hat nicht genug Energie für die Aktion`);
      this.actor.action = {
        action: new NoneAction(),
        investedImpact: 0,
        investedTempo: 0
      };
      base = new NoneAction();
    }
    else {
      this.actor.state.energy -= energyCost;
    }

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
