import { FighterAction } from "./FighterAction";

/** Referenz auf hinterlegte Aktionsmuster eines Charakters / Kämpfers
 *
 */
export interface ActionPattern {
  /** Name des Aktionsmusters */
  name: string;
  /** Hinterlegte Wahrscheinlichkeit */
  probability: number;
  /** Hinterlegte Aktion-Abfolge */
  pattern: FighterAction[];

  // ToDo:
  // Verweis auf Trigger
}
