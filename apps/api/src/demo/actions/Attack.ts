import { BaseAction, resolveProps, swapResolveProps } from "./Base";
import { ActionType } from "../types";
import logger from "../../utils/apiLogger";

export class AttackAction extends BaseAction {
  constructor() {
    super(ActionType.ATTACK);
  }

  resolveAgainst(params: resolveProps): void {
    const { self, target, other, tempoSelf, tempoOther, impactSelf, impactOther } = params;
    switch (other.type) {
      case ActionType.ATTACK:
        if (tempoSelf >= tempoOther) {
          // Attacker ist schneller
          this.resolveAttack(params);
          this.resolveAttack(swapResolveProps(params));
        }
        else {
          // Verteidiger ist schneller
          this.resolveAttack(swapResolveProps(params));
          this.resolveAttack(params);
        }
        break;
      case ActionType.DEFEND:
        // Übergebe DEFEND die Kontrolle, wie sie auf Attack reagiert
        other.resolveAttack!({ target, self, other: this, tempoOther, tempoSelf, impactOther, impactSelf });
        break;
      case ActionType.UTILITY:
        // Übergebe UTILITY die Kontrolle, wie sie auf Attack reagiert
        other.resolveAttack!({ target, self, other: this, tempoOther, tempoSelf, impactOther, impactSelf });
        break;
      case ActionType.UTILITY_ATTACK:
        // Übergebe UTILITY_ATTACK die Kontrolle, wie sie auf Attack reagiert
        other.resolveAttack!({ target, self, other: this, tempoOther, tempoSelf, impactOther, impactSelf });
        break;
      case ActionType.UTILITY_DEFEND:
        // Übergebe UTILITY_DEFEND die Kontrolle, wie sie auf Attack reagiert
        other.resolveAttack!({ target, self, other: this, tempoOther, tempoSelf, impactOther, impactSelf });
        break;
    }
  }

  // --- AttackAction reagiert auf Attack von other.ActionType.ATTACK
  // Attack vs Attack: Ziel erleidet Schaden (+ Impact)
  resolveAttack(params: resolveProps): void {
    const { self: self, target: target, impactSelf: impactSelf } = params;
    target.takeDamage(this.baseDamage + impactSelf + self.nextAttackBonus);
    logger.debug(`${self.name} greift an: ${params.target.name} erleidet ${this.baseDamage} + ${impactSelf} + ${self.nextAttackBonus} Schaden.`);
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
