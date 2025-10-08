import { BaseAction } from "./BaseAction";
import { Player } from "../Player";
import { ActionResult, ActionType } from "../types";

export class UtilityDefendAction extends BaseAction {
  constructor() {
    super(ActionType.UTILITY_DEFEND);
  }

  execute(self: Player, opponent: Player): ActionResult {
    self.gainEnergy(2);
    self.applyBuff(ActionType.UTILITY_DEFEND);

    return {
      damageToOpponent: 0,
      blockApplied: 0,
      energyChange: +2,
    };
  }
}
