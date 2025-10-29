import { BaseAction } from "./Base";
import { Player } from "../Player";
import { ActionType } from "../types";
import logger from "../../utils/apiLogger";

export class UtilityAction extends BaseAction {
  energyGain: number = 3;

  constructor() {
    super(ActionType.UTILITY);
  }

  resolveAgainst(self: Player, target: Player, other: BaseAction, tempoSelf: number, tempoOther: number, impactSelf: number, impactOther: number): void {
    switch (other.type) {
      case ActionType.ATTACK:
        this.resolveAttack!(self, target, other, tempoSelf, tempoOther, impactSelf, impactOther);
        break;
      case ActionType.DEFEND:
        logger.debug(`${target.name} verteidigt sich (Block: ${this.baseBlock} + ${impactSelf} + ${self.nextDefenseBonus}): kein eingehender Schaden.`);
        self.gainEnergy(this.energyGain + impactSelf);
        logger.debug(`${self.name} regeneriert: erhält ${this.energyGain + impactSelf} Energie.`);
        break;
      case ActionType.UTILITY:
        self.gainEnergy(this.energyGain);
        target.gainEnergy(this.energyGain);
        logger.debug(`Beide nutzen Energie – +2 Energie für beide.`);
        break;
      case ActionType.UTILITY_ATTACK:
        self.gainEnergy(this.energyGain);
        target.gainEnergy(other.energyGain);
        target.applyBuff(ActionType.UTILITY_ATTACK);
        logger.debug(`Beide nutzen Energie – +2 Energie für beide.`);
        logger.debug(`${target.name} bekommt Buff "ActionType.UTILITY_ATTACK".`);
        break;
    }
  }

  // --- Attack trifft auf Utility
  // Defender erleidet anteilig Schaden (+ Impact)

  // AttackerAction: [ActionType.DEFEND]
  // DefenderAction [ActionType.Attack]
  resolveAttack(self: Player, target: Player, other: BaseAction, tempoSelf: number, tempoOther: number, impactSelf: number, impactOther: number): void {
    const damage = other.baseDamage + impactOther;
    if (tempoSelf >= tempoOther) {
      self.gainEnergy(this.energyGain + impactSelf);
      logger.debug(`${self.name} regeneriert rechtzeitig: erhält ${this.energyGain + impactSelf} Energie.`);
    } else {
      self.gainEnergy(2);
      logger.debug(`${self.name} regeneriert zu spät: erhält ${2} Energie.`);
    }
    self.takeDamage(damage);
    logger.debug(`${target.name} greift an: ${self.name} erleidet ${damage} Schaden.`);
    target.resetAttackBuff();
  }
}
