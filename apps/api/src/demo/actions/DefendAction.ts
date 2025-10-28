// domain/actions/DefendAction.ts
import { BaseAction } from "./BaseAction";
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

  resolveAttack(self: Player, target: Player, other: BaseAction, tempoSelf: number, tempoOther: number, impactSelf: number, impactOther: number): void {
    const damage = other.baseDamage;
    if (tempoSelf >= tempoOther) {
      logger.debug(`Verteidigung war rechtzeitig! Kein Schaden.`);
    } else {
      const netDamage = Math.max(0, damage - 1);
      self.takeDamage(netDamage);
      logger.debug(`Verteidigung zu spät – blockt nur 1. Erleidet ${netDamage} Schaden.`);
    }
  }
}
