import { BaseAction } from "./BaseAction";
import { Player } from "../Player";
import { ActionResult, ActionType } from "../types";

export class DefendAction extends BaseAction {
  blockValue: number = 5;

  constructor() {
    super(ActionType.DEFEND);
  }

  execute(self: Player, opponent: Player): ActionResult {
    const totalBlock = this.blockValue + self.nextDefenseBonus;
    self.resetBuffs();

    return {
      damageToOpponent: 0,
      blockApplied: totalBlock,
      energyChange: -this.energyCost,
    };
  }
}
