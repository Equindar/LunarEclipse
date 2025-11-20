import { BaseAction } from "./Base";
import { ActionType } from "../types/ActionType";
import logger from "../../utils/apiLogger";
import { IActionContext } from "../interfaces/ActionContext";
import { formatDuration } from "../utils/time";

export class AttackAction extends BaseAction {
  /** Basiswerte */
  baseDamage = 5;

  constructor() {
    super(ActionType.ATTACK);
  }

  resolveAsEngage(ctx: IActionContext): void {
    // logger.error("AttackAction.resolveAsEngage()");
    // Inits
    const actor = ctx.actor.id;
    const targets = ctx.selectedTargets;
    const state = ctx.ctxRound.fighters.get(actor)!;
    const execution = ctx.ctxCombat.time.elapsed + (1000 - (ctx.actor.action.investedTempo * 100));
    // logger.verbose(targets);

    const damage = this.baseDamage + ctx.actor.action.investedImpact + ctx.actor.state.nextAttackBonus;
    targets?.forEach(element => {
      ctx.ctxRound.addPlannedDamage(element.id, damage);
    });
    logger.debug(`[${formatDuration(execution)}] ${actor} greift an: ${ctx.selectedTargets![0].id} erleidet ${this.baseDamage} + ${ctx.actor.action.investedImpact} + ${ctx.actor.state.nextAttackBonus} Schaden.`);
    state.resetAttackBuff();
  }

  resolveAsReaction(ctx: IActionContext): void {
    // logger.error("AttackAction.resolveAsReaction()");
    this.resolveAsEngage(ctx);
  }

  resolveAsMoment(ctx: IActionContext): void {
    // logger.error("AttackAction.resolveAsMoment()");
    this.resolveAsEngage(ctx);
  }
}
