import { BaseAction } from "./BaseAction";
import { Player } from "../Player";
import { ActionResult, ActionType } from "../types";

export class AttackAction extends BaseAction {
  damage: number = 5;

  constructor() {
    super(ActionType.ATTACK);
  }

  execute(self: Player, opponent: Player): ActionResult {
    const totalDamage = this.damage + self.nextAttackBonus;
    self.resetBuffs();

    opponent.takeDamage(totalDamage);

    return {
      damageToOpponent: totalDamage,
      blockApplied: 0,
      energyChange: -this.energyCost,
    };
  }
}
