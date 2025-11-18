import { FighterId } from "../Fighter";
import { FighterAction } from "./FighterAction";

export type TempoGroupEntry = {
  /** Kämpfer der Aktion */
  fighter: FighterId;
  /** Einzel-Aktion eines Aktionsmusters*/
  action: FighterAction;
  /** Index im Aktionsmuster */
  patternIndex: number;
}

export interface TempoGroup {
  /** Tempo Indikator für Gruppierung */
  tempo: number;
  /** Aktionen, die bei diesem Tempo ausgeführt werden */
  actions: TempoGroupEntry[];
}
