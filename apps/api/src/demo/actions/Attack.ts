import { BaseAction } from "./Base";
import { ActionType } from "../types/ActionType";
import logger from "../../utils/apiLogger";
import { ActionContext } from "../interfaces/ActionContext";

export class AttackAction extends BaseAction {
  /** Basiswerte */
  baseDamage = 5;

  constructor() {
    super(ActionType.ATTACK);
  }

  resolveAsEngage(ctx: ActionContext): void {
    // Setze neuen geplannten Schaden für Target in roundCtx
    ctx.ctxRound.plannedDamage.set(
      ctx.target.character.name,
      (ctx.ctxRound.plannedDamage.get(ctx.target.character.name) ?? 0) + this.baseDamage + ctx.self.impact + ctx.self.nextAttackBonus
    );
    logger.debug(`${self.name} greift an: ${ctx.target.character.name} erleidet ${this.baseDamage} + ${ctx.self.impact} + ${ctx.self.nextAttackBonus} Schaden.`);

    // ToDo:
    // self.resetAttackBuff();
  }

  resolveAsReaction(ctx: ActionContext): void {
    this.resolveAsEngage(ctx);
  }

  resolveAsMoment(ctx: ActionContext): void {
    this.resolveAsEngage(ctx);
  }
}
