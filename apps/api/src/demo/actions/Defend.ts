import { BaseAction } from "./Base";
import { ActionType } from "../types/ActionType";
import { IActionContext } from "../interfaces/ActionContext";
import logger from "../../utils/apiLogger";

export class DefendAction extends BaseAction {
  constructor() {
    super(ActionType.DEFEND);
  }

  resolveAsEngage(ctx: IActionContext): void {
    logger.error("DefendAction.resolveAsEngage()");
    throw new Error("Method not implemented.");
  }
  resolveAsReaction(ctx: IActionContext): void {
    logger.error("DefendAction.resolveAsReaction()");
    throw new Error("Method not implemented.");
  }
  resolveAsMoment(ctx: IActionContext): void {
    logger.error("DefendAction.resolveAsMoment()");
    throw new Error("Method not implemented.");
  }
  // // --- DefendAction reagiert auf Attack von other.ActionType.ATTACK
  // // Attack vs Attack: Ziel erleidet Schaden (+ Impact)
  // // --- Attack trifft auf Defend
  // // Defender erleidet anteilig Schaden (+ Impact)
  // resolveAttack(params: resolveProps): void {
  //   const { self, target, other, tempoSelf, tempoOther, impactSelf, impactOther } = params;
  //   const damage = other.baseDamage + impactOther;
  //   const block = this.baseBlock + impactSelf + self.nextDefenseBonus;
  //   if (tempoSelf >= tempoOther) {
  //     const netDamage = Math.max(0, damage - block);
  //     self.takeDamage(netDamage);
  //     logger.debug(`${self.name} verteidigt sich (Block: ${this.baseBlock} + ${impactSelf} + ${self.nextDefenseBonus}): erleidet ${netDamage} Schaden.`);
  //   }
  //   else {
  //     const netDamage = Math.max(0, damage - 1 + impactSelf + self.nextDefenseBonus);
  //     self.takeDamage(netDamage);
  //     logger.debug(`${self.name} verteidigt sich (Block: ${1} + ${impactSelf} + ${self.nextDefenseBonus}): erleidet ${netDamage} Schaden. (zu spät)`);
  //   }
  //   self.resetDefenseBuff();
  // }

  // resolveDefend(params: resolveProps): void {
  //   const { self: self, impactSelf: impactSelf } = params;
  //   logger.debug(`${self.name} verteidigt sich (Block: ${this.baseBlock} + ${impactSelf} + ${self.nextDefenseBonus})`);
  // }
}
