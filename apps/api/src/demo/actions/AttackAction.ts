// domain/actions/AttackAction.ts
import { BaseAction } from "./BaseAction";
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
        this.resolveAttack(self, target, other, tempoSelf, tempoOther, impactSelf, impactOther);
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

  resolveAttack(
    self: Player,
    target: Player,
    other: BaseAction,
    tempoSelf: number,
    tempoOther: number,
    impactSelf: number,
    impactOther: number,

  ): void {
    // Attack vs Attack → beide bekommen Schaden
    self.takeDamage(this.baseDamage);
    target.takeDamage(this.baseDamage);
    logger.debug(`⚔️ Attack vs Attack: Beide erleiden ${this.baseDamage} Schaden.`);
  }
}
