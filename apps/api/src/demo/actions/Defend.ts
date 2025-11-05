import { BaseAction, resolveProps, swapResolveProps } from "./Base";
import { ActionType } from "../types/types";
import logger from "../../utils/apiLogger";

export class DefendAction extends BaseAction {
  constructor() {
    super(ActionType.DEFEND);
  }

  resolveAsEngage(params: resolveProps): void {
    const damage = params.other.baseDamage + params.impactTarget;
    const block = this.baseBlock + params.impactSelf + params.self.nextDefenseBonus;
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

  // --- DefendAction reagiert auf Attack von other.ActionType.ATTACK
  // Attack vs Attack: Ziel erleidet Schaden (+ Impact)
  // --- Attack trifft auf Defend
  // Defender erleidet anteilig Schaden (+ Impact)
  resolveAttack(params: resolveProps): void {
    const { self, target, other, tempoSelf, tempoOther, impactSelf, impactOther } = params;
    const damage = other.baseDamage + impactOther;
    const block = this.baseBlock + impactSelf + self.nextDefenseBonus;
    if (tempoSelf >= tempoOther) {
      const netDamage = Math.max(0, damage - block);
      self.takeDamage(netDamage);
      logger.debug(`${self.name} verteidigt sich (Block: ${this.baseBlock} + ${impactSelf} + ${self.nextDefenseBonus}): erleidet ${netDamage} Schaden.`);
    }
    else {
      const netDamage = Math.max(0, damage - 1 + impactSelf + self.nextDefenseBonus);
      self.takeDamage(netDamage);
      logger.debug(`${self.name} verteidigt sich (Block: ${1} + ${impactSelf} + ${self.nextDefenseBonus}): erleidet ${netDamage} Schaden. (zu spät)`);
    }
    self.resetDefenseBuff();
  }

  resolveDefend(params: resolveProps): void {
    const { self: self, impactSelf: impactSelf } = params;
    logger.debug(`${self.name} verteidigt sich (Block: ${this.baseBlock} + ${impactSelf} + ${self.nextDefenseBonus})`);
  }
}
