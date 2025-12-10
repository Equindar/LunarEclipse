import { BaseAction } from "../actions/Base";

export interface FighterAction {
  /** Typ der Aktion */
  action: BaseAction;
  /** Tempo-Verstärkung durch Energie-Einsatz */
  investedTempo: number;
  /** Wirkungs-Verstärkung durch Energie-Einsatz */
  investedImpact: number;
}
