// domain/actions/DefendAction.ts
import { BaseAction } from "./Base";
import { Player } from "../Player";
import { ActionType } from "../types";
import logger from "../../utils/apiLogger";

export class DefendAction extends BaseAction {
  constructor() {
    super(ActionType.DEFEND);
  }

  resolveAgainst(self: Player, target: Player, other: BaseAction, tempoSelf: number, tempoOther: number, impactSelf: number, impactOther: number): void {
    switch (other.type) {
      case ActionType.ATTACK:
        this.resolveAttack!(self, target, other, tempoSelf, tempoOther, impactSelf, impactOther);
        break;
      case ActionType.DEFEND:
        logger.debug(`Beide verteidigen – nichts passiert.`);
        break;
      case ActionType.UTILITY:
        logger.debug(`Verteidigung vs Nutzen – Block schützt, kein Schaden.`);
        break;
    }
  }

  // --- Attack trifft auf Defend
  // Defender erleidet anteilig Schaden (+ Impact)
  resolveAttack(self: Player, target: Player, other: BaseAction, tempoSelf: number, tempoOther: number, impactSelf: number, impactOther: number): void {
    const damage = other.baseDamage + impactOther;
    if (tempoSelf >= tempoOther) {
      const netDamage = Math.max(0, damage - (this.baseBlock + impactSelf + self.nextDefenseBonus));
      self.takeDamage(netDamage);
      logger.debug(`${self.name} verteidigt sich rechtzeitig (Block: ${this.baseBlock} + ${impactSelf} + ${self.nextDefenseBonus}): erleidet ${netDamage} Schaden.`);
    }
    else {
      const netDamage = Math.max(0, damage - 1 + impactSelf + self.nextDefenseBonus);
      self.takeDamage(netDamage);
      logger.debug(`${self.name} verteidigt sich zu spät (Block: ${1} + ${impactSelf} + ${self.nextDefenseBonus}): erleidet ${netDamage} Schaden.`);
    }
    self.resetDefenseBuff();
  }
}
