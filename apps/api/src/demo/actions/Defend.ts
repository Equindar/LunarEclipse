import { BaseAction, resolveProps, swapResolveProps } from "./Base";
import { Player } from "../Player";
import { ActionType } from "../types";
import logger from "../../utils/apiLogger";

export class DefendAction extends BaseAction {
  constructor() {
    super(ActionType.DEFEND);
  }

  resolveAgainst(params: resolveProps): void {
    const { self, target, other, tempoSelf, tempoOther, impactSelf, impactOther } = params;
    switch (other.type) {
      case ActionType.ATTACK:
        this.resolveAttack!(params);
        break;
      case ActionType.DEFEND:
        if (tempoSelf >= tempoOther) {
          // Attacker ist schneller
          this.resolveDefend(params);
          this.resolveDefend(swapResolveProps(params));
        }
        else {
          // Verteidiger ist schneller
          this.resolveDefend(swapResolveProps(params));
          this.resolveDefend(params);
        }
        break;
      case ActionType.UTILITY:
        logger.debug(`Verteidigung vs Nutzen – Block schützt, kein Schaden.`);
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
