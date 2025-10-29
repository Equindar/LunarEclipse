// domain/actions/AttackAction.ts
import { BaseAction } from "./Base";
import { Player } from "../Player";
import { ActionType } from "../types";
import logger from "../../utils/apiLogger";

export class AttackAction extends BaseAction {
  constructor() {
    super(ActionType.ATTACK);
  }

  resolveAgainst(self: Player, target: Player, other: BaseAction, tempoSelf: number, tempoOther: number, impactSelf: number, impactOther: number): void {
    // Der Trick: Ich rufe auf dem anderen Objekt dessen passende "resolveX" auf
    // -> zweiter Dispatch
    switch (other.type) {
      case ActionType.ATTACK:
        // Attacker greift an
        this.resolveAttack(self, target, other, tempoSelf, tempoOther, impactSelf, impactOther);
        // Verteidiger greift an
        this.resolveAttack(target, self, other, tempoOther, tempoSelf, impactOther, impactSelf);
        break;
      case ActionType.DEFEND:
        other.resolveAttack!(target, self, this, tempoOther, tempoSelf, impactOther, impactSelf);
        break;
      case ActionType.UTILITY:
        other.resolveAttack!(target, self, this, tempoOther, tempoSelf, impactOther, impactSelf);
        break;
      case ActionType.UTILITY_ATTACK:
        other.resolveAttack!(target, self, this, tempoOther, tempoSelf, impactOther, impactSelf);
        break;
      case ActionType.UTILITY_DEFEND:
        other.resolveAttack!(target, self, this, tempoOther, tempoSelf, impactOther, impactSelf);
        break;
    }
  }

  resolveAttack(
    self: Player,
    target: Player,
    other: BaseAction,
    tempoSelf: number,
    tempoOther: number,
    impactSelf: number,
    impactOther: number,

  ): void {
    // Attack vs Attack: Ziel erleidet Schaden (+ Impact)
    target.takeDamage(this.baseDamage + impactSelf + self.nextAttackBonus);
    logger.debug(`${self.name} greift an: ${target.name} erleidet ${this.baseDamage} + ${impactSelf} + ${self.nextAttackBonus} Schaden.`);
    self.resetAttackBuff();
  }

  // Attack vs Utility
  // resolveUtility(
  //   self: Player,
  //   target: Player,
  //   other: BaseAction,
  //   tempoSelf: number,
  //   tempoOther: number,
  //   impactSelf: number,
  //   impactOther: number,

  // ): void {
  //   // Attack vs Utility → beide bekommen Schaden
  //   if (tempoSelf >= tempoOther) {
  //     logger.debug(`Nutzen war rechtzeitig! Volle Wirkung`);
  //   } else {
  //     const netDamage = Math.max(0, damage - 1);
  //     self.takeDamage(netDamage);
  //     logger.debug(`Verteidigung zu spät – blockt nur 1. Erleidet ${netDamage} Schaden.`);
  //   }
  //   self.takeDamage(this.baseDamage);
  //   logger.debug(`⚔️ Attack vs Attack: Beide erleiden ${this.baseDamage} Schaden.`);
  // }
}
