import { BaseAction } from "./Base";
import { Player } from "../Player";
import { ActionResult, ActionType } from "../types";
import logger from "../../utils/apiLogger";

export class UtilityDefendAction extends BaseAction {
  energyGain: number = 2;

  constructor() {
    super(ActionType.UTILITY_DEFEND);
  }

  resolveAgainst(self: Player, target: Player, other: BaseAction, tempoSelf: number, tempoOther: number, impactSelf: number, impactOther: number): void {
    switch (other.type) {
      case ActionType.ATTACK:
        this.resolveAttack!(self, target, other, tempoSelf, tempoOther, impactSelf, impactOther);
        break;
      case ActionType.DEFEND:
        other.resolveAttack!(target, self, this, tempoSelf, tempoOther, impactSelf, impactOther); // Dispatch an Defend
        break;
      case ActionType.UTILITY:
      case ActionType.UTILITY_ATTACK:
      case ActionType.UTILITY_DEFEND:
        other.resolveAttack!(target, self, this, tempoSelf, tempoOther, impactSelf, impactOther); // Dispatch an Utility
        break;
    }
  }

  // --- Wie UtilityDefend auf Attack reagiert
  // Self erleidet Schaden (+ Impact)
  resolveAttack(self: Player, target: Player, other: BaseAction, tempoSelf: number, tempoOther: number, impactSelf: number, impactOther: number): void {
    const damage = other.baseDamage + impactOther + target.nextAttackBonus;
    if (tempoSelf >= tempoOther) {
      self.gainEnergy(this.energyGain + impactSelf);
      logger.debug(`${self.name} regeneriert rechtzeitig: erhält ${this.energyGain + impactSelf} Energie.`);
      self.applyBuff(ActionType.UTILITY_DEFEND);
      logger.debug(`${self.name} erhöht Verteidigungs-Buff (+1) auf ${self.nextDefenseBonus}`);
    }
    else {
      self.gainEnergy(1);
      logger.debug(`${self.name} regeneriert zu spät: erhält ${1} Energie.`);
    }
    self.takeDamage(damage);
    logger.debug(`${target.name} greift an: ${self.name} erleidet ${damage} Schaden.`);
    target.resetAttackBuff();
  }
}
