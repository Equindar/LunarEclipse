import { Fighter, FighterId } from "../Fighter";
import { DamageByFighter } from "./Damage";

type EnvironmentData = {
  temperature: number;
  brightness: number;
  visibility: number;
  humidity: number;
}

export interface CombatContext {
  identifier: string;
  randomSeed?: string;
  currentRound: number;
  time: {
    start: Date,
    end?: Date
  }
  environment?: EnvironmentData;

  fighters: Map<FighterId, Fighter>;

  /* --- Beispiel:
  matchId: string;
  seed?: number;
  settings: MatchSettings;
  players: PlayerState[]; // persistent player info
  globalModifiers?: Map<string, any>;
   */

  // Ergebnisfelder, die Regeln füllen:
  damageCaused?: DamageByFighter;
  damageDealt?: DamageByFighter;
  damageReceived?: DamageByFighter;
  damageTaken?: DamageByFighter;

  log?: string[];
}
