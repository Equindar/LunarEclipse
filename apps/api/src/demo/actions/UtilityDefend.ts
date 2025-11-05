import { BaseAction, resolveProps } from "./Base";
import { ActionType } from "../types/types";
import logger from "../../utils/apiLogger";

export class UtilityDefendAction extends BaseAction {
  energyGain: number = 2;

  constructor() {
    super(ActionType.UTILITY_DEFEND);
  }

  resolveAgainst(params: resolveProps): void {
    const { self, target, other, tempoSelf, tempoOther, impactSelf, impactOther } = params;
    switch (other.type) {
      case ActionType.ATTACK:
        this.resolveAttack!(params);
        break;
      case ActionType.DEFEND:
        logger.error("not implemented: Nv -> V");
        break;
      case ActionType.UTILITY:
        logger.error("not implemented: Nv -> N");
        break;
      case ActionType.UTILITY_ATTACK:
        logger.error("not implemented: Nv -> Na");
        break;
      case ActionType.UTILITY_DEFEND:
        this.resolveUtilityDefend!(params); // Dispatch an Utility
        break;
    }
  }

  // --- Wie UtilityDefend auf Attack reagiert
  // Self erleidet Schaden (+ Impact)
  resolveAttack(params: resolveProps): void {
    const { self, target, other, tempoSelf, tempoOther, impactSelf, impactOther } = params;
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

  // --- Wie UtilityDefend auf UtilityDefend reagiert
  resolveUtilityDefend(params: resolveProps): void {
    const { self, target, other, tempoSelf, tempoOther, impactSelf, impactOther } = params;
    logger.error("here");
    self.gainEnergy(this.energyGain);
    target.gainEnergy(other.energyGain);
    target.applyBuff(ActionType.UTILITY_DEFEND);
    logger.debug(`Beide nutzen Energie – +2 Energie für beide.`);
    logger.debug(`${target.name} bekommt Buff "ActionType.UTILITY_ATTACK".`);
  }
}
