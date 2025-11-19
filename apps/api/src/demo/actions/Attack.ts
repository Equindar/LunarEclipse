import { BaseAction } from "./Base";
import { ActionType } from "../types/ActionType";
import logger from "../../utils/apiLogger";
import { IActionContext } from "../interfaces/ActionContext";

export class AttackAction extends BaseAction {
  /** Basiswerte */
  baseDamage = 5;

  constructor() {
    super(ActionType.ATTACK);
  }

  resolveAsEngage(ctx: IActionContext): void {
    // logger.error("AttackAction.resolveAsEngage()");
    // Setze neuen geplannten Schaden für Target in roundCtx

    ctx.ctxRound.plannedDamage.set(
      ctx.targets![0].id,
      this.baseDamage + ctx.actor.action.investedImpact + (ctx.actor.state.nextAttackBonus ?? 0)
    );
    logger.debug(`${ctx.actor.id} greift an: ${ctx.targets![0].id} erleidet ${this.baseDamage} + ${ctx.actor.action.investedImpact} + ${ctx.actor.state.nextAttackBonus ?? 0} Schaden.`);
    ctx.actor.state.nextAttackBonus = 0;
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
