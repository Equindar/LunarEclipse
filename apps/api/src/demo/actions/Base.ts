import { ActionContext } from "../interfaces/ActionContext";
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


  constructor(public type: ActionType) { }

  /**
   * Calculates tempo based on energy invest
   * @param energyInvested spent energy to increase tempo
   * @returns total tempo
   */
  calculateTempo(energyInvested: number): number {
    return this.baseTempo + energyInvested;
  }

  /**
   * calculates impact based on energy invest
   * @param energyInvested spent energy to increase impact
   * @returns total impact
   */
  calculateImpact(energyInvested: number): number {
    return this.baseImpact + energyInvested;
  }

  /**
   * calculates the energy consumption of the action
   * @param energyInvested spent energy to empower the action
   * @returns total energy cost
   */
  totalEnergyCost(energyInvested: number): number {
    return this.baseEnergyCost + energyInvested;
  }

  /**
   * Actor performs the action in the beginning, based on the higher tempo
   * @param props
   */
  abstract resolveAsEngage(props: ActionContext): void;

  /**
 * Actor reacts to an incoming action, based on the lower tempo
 * @param props
 */
  abstract resolveAsReaction(props: ActionContext): void;

  /**
   * Actor performs the action in the same moment, based on the equal tempo
   * @param props
   */
  abstract resolveAsMoment(props: ActionContext): void;

}
// --- Utils
/** Hilffunktion zum Tauschen der Perspektive
 * @param:
 * Tauscht folgende Übergabeparameter aus:
 * * self <-> target
 * */
export function swapResolveProps(ctx: ActionContext): ActionContext {
  return {
    self: ctx.target,
    target: ctx.self,
    ctxRound: ctx.ctxRound
  };
}
