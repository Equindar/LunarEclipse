import { Fighter } from "../Fighter";
import { RoundContext } from "../interfaces/RoundContext";
import { ActionType } from "../types/types";

export type resolveProps = {
  self: Fighter,
  target: Fighter,
  other: BaseAction,
  impactSelf: number,
  impactTarget: number,
  context?: RoundContext
}

export abstract class BaseAction {
  /** Basiswerte */
  energyCost = 1;
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
    return this.energyCost + energyInvested;
  }

  /**
   * Actor performs the action in the beginning, based on the higher tempo
   * @param props
   */
  abstract resolveAsEngage(props: resolveProps): void;

  /**
 * Actor reacts to an incoming action, based on the lower tempo
 * @param props
 */
  abstract resolveAsReaction(props: resolveProps): void;

  /**
   * Actor performs the action in the same moment, based on the equal tempo
   * @param props
   */
  abstract resolveAsMoment(props: resolveProps): void;

}
// --- Utils
/** Hilffunktion zum Tauschen der Perspektive
 * @param:
 * Tauscht folgende Übergabeparameter aus:
 * * self <-> target
 * * tempoSelf <-> tempoOther
 * * impactSelf <-> impactOther
 * */
export function swapResolveProps(props: resolveProps): resolveProps {
  return {
    self: props.target,
    target: props.self,
    other: props.other,
    impactSelf: props.impactTarget,
    impactTarget: props.impactSelf,
    context: props.context ?? undefined
  };
}
