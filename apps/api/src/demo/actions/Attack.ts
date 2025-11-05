import { BaseAction, resolveProps } from "./Base";
import { ActionType } from "../types/types";
import logger from "../../utils/apiLogger";

export class AttackAction extends BaseAction {
  /** Basiswerte */
  baseDamage = 5;

  constructor() {
    super(ActionType.ATTACK);
  }

  resolveAsEngage(params: resolveProps): void {
    const { self: self, target: target, impactSelf: impactSelf } = params;
    target.takeDamage(this.baseDamage + impactSelf + self.nextAttackBonus);
    logger.debug(`${self.name} greift an: ${params.target.name} erleidet ${this.baseDamage} + ${impactSelf} + ${self.nextAttackBonus} Schaden.`);
    self.resetAttackBuff();
  }

  resolveAsReaction(props: resolveProps): void {
    this.resolveAsEngage(props);
  }

  resolveAsMoment(props: resolveProps): void {
    this.resolveAsEngage(props);
  }
}
