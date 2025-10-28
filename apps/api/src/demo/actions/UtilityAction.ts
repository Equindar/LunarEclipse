import { BaseAction } from "./BaseAction";
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
        this.resolveAttack!(self, target, other, tempoSelf, tempoOther);
        break;
      case ActionType.DEFEND:
        logger.debug(`Nutzen wird aufgebaut – Verteidigung schützt beide.`);
        self.gainEnergy(this.energyGain);
        break;
      case ActionType.UTILITY:
        self.gainEnergy(this.energyGain);
        target.gainEnergy(this.energyGain);
        logger.debug(`Beide nutzen Energie – +2 Energie für beide.`);
        break;
    }
  }

  resolveAttack(self: Player, target: Player, other: BaseAction, tempoSelf: number, tempoOther: number): void {
    const damage = other.baseDamage;
    if (tempoSelf >= tempoOther) {
      self.gainEnergy(2);
      logger.debug(`Nutzen rechtzeitig – +2 Energie, bevor Angriff trifft.`);
    } else {
      self.takeDamage(damage);
      logger.debug(`Nutzen zu spät – voller Schaden (${damage}).`);
    }
  }
}
