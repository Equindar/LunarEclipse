import { BaseAction } from "./BaseAction";
import { Player } from "../Player";
import { ActionResult, ActionType } from "../types";

export class UtilityDefendAction extends BaseAction {
  energyGain: number = 2;

  constructor() {
    super(ActionType.UTILITY_DEFEND);
  }

  execute(self: Player, opponent: Player): ActionResult {
    self.gainEnergy(this.energyGain);
    self.applyBuff(ActionType.UTILITY_DEFEND);

    return {
      damageToOpponent: 0,
      blockApplied: 0,
      energyChange: this.energyGain,
    };
  }
}
