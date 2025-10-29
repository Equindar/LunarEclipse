// domain/actions/BaseAction.ts
import { Player } from "../Player";
import { ActionType } from "../types";

export abstract class BaseAction {
  constructor(public type: ActionType) { }

  /** Basiswerte */
  baseTempo = 2;
  baseImpact = 0;
  baseDamage = 5;
  baseBlock = 5;
  energyCost = 1;
  energyGain = 0;


  /** Tempo-Berechnung mit Energie-Investition */
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
  abstract resolveAgainst(
    self: Player,
    target: Player,
    other: BaseAction,
    tempoSelf: number,
    tempoOther: number,
    impactSelf: number,
    impactOther: number
  ): void;

  // Zweite Dispatch-Ebene — optional überschrieben von Kindklassen:
  resolveAttack?(self: Player, target: Player, other: BaseAction, tempoSelf: number, tempoOther: number, impactSelf: number, impactOther: number): void;
  resolveDefend?(self: Player, target: Player, other: BaseAction, tempoSelf: number, tempoOther: number, impactSelf: number, impactOther: number): void;
  resolveUtility?(self: Player, target: Player, other: BaseAction, tempoSelf: number, tempoOther: number, impactSelf: number, impactOther: number): void;
}
