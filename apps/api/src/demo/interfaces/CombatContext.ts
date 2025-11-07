import { Fighter } from "../Fighter";
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
  time: {
    start: Date,
    end?: Date
  }
  environment?: EnvironmentData;
  attacker: Fighter;
  defender: Fighter;

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
