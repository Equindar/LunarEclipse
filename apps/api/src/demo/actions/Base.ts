import { IActionContext } from "../interfaces/ActionContext";
import { FighterAction } from "../interfaces/FighterAction";
import { ActionType } from "../types/ActionType";

export abstract class BaseAction {
  /** Basiswerte */
  baseEnergyCost = 1;
  baseDurationInMs: number = 2000;
  baseTempo = 2;
  baseImpact = 0;

  baseDamage = 5;
  baseBlock = 5;
  energyGain = 0;


  constructor(public type: ActionType) {
  }

  /**
   * calculates the energy consumption of the action
   * @param energyInvested spent energy to empower the action
   * @returns total energy cost
   */
  totalEnergyCost(action: FighterAction): number {
    return this.baseEnergyCost + action.investedTempo + action.investedImpact;
  }

  /**
   * Actor performs the action in the beginning, based on the higher tempo
   * @param props
   */
  abstract resolveAsEngage(ctx: IActionContext): void;

  /**
 * Actor reacts to an incoming action, based on the lower tempo
 * @param props
 */
  abstract resolveAsReaction(
    ctx: IActionContext
    // ,
    // targettedBy: {
    //   id: FighterId;
    //   state: RoundFighterState;
    //   action: FighterAction;
    //   primary?: boolean;
    // }[]
  ): void;

  /**
   * Actor performs the action in the same moment, based on the equal tempo
   * @param props
   */
  abstract resolveAsMoment(ctx: IActionContext): void;

}
