import { BaseAction } from "./BaseAction";
import { Player } from "../Player";
import { ActionResult, ActionType } from "../types";

export class UtilityAction extends BaseAction {
  energyGain: number = 2;

  constructor() {
    super(ActionType.UTILITY);
  }

  execute(self: Player, opponent: Player): ActionResult {
    self.gainEnergy(this.energyGain);

    return {
      damageToOpponent: 0,
      blockApplied: 0,
      energyChange: this.energyGain,
    };
  }
}
