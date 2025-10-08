import { Player } from "../Player";
import { ActionResult, ActionType } from "../types";

export abstract class BaseAction {
  type: ActionType;
  baseTempo: number = 2; // Gleiches Basistempo für alle
  energyCost: number = 1;

  constructor(type: ActionType) {
    this.type = type;
  }

  abstract execute(self: Player, opponent: Player): ActionResult;

  public calculateTempo(energyInvested: number): number {
    return this.baseTempo + energyInvested;
  }

  public totalEnergyCost(energyInvested: number): number {
    return this.energyCost + energyInvested;
  }
}
