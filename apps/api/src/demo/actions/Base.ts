import { Player } from "../Player";
import { ActionType } from "../types";

export type resolveProps = {
  self: Player,
  target: Player,
  other: BaseAction,
  tempoSelf: number,
  tempoOther: number,
  impactSelf: number,
  impactOther: number,
}

export abstract class BaseAction {
  /** Basiswerte */
  baseTempo = 2;
  baseImpact = 0;
  baseDamage = 5;
  baseBlock = 5;
  energyCost = 1;
  energyGain = 0;


  constructor(public type: ActionType) { }

  /** Tempo-Berechnung mit Energie-Investition */


  /**
   * Calculates tempo based on energy invest
   * @param energyInvested spent energy to increase tempo
   * @returns total tempo
   */
  calculateTempo(energyInvested: number): number {
    return this.baseTempo + energyInvested;
  }

  /** Wirkung-Berechnung mit Energie-Investition */
  calculateImpact(energyInvested: number): number {
    return this.baseImpact + energyInvested;
  }

  totalEnergyCost(energyInvested: number): number {
    return this.energyCost + energyInvested;
  }

  /** Hauptzug, entscheidet über Dispatch */
  abstract resolveAgainst(params: resolveProps): void;

  // Zweite Dispatch-Ebene — optional überschrieben von Kindklassen:
  resolveAttack?(params: resolveProps): void;
  resolveDefend?(params: resolveProps): void;
  resolveUtility?(params: resolveProps): void;
  resolveUtilityAttack?(params: resolveProps): void;
  resolveUtilityDefend?(params: resolveProps): void;

}

// --- Utils
/** Hilffunktion zum Tauschen der Perspektive
 * @param: ahah
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
    tempoSelf: props.tempoOther,
    tempoOther: props.tempoSelf,
    impactSelf: props.impactOther,
    impactOther: props.impactSelf,
  };
}
