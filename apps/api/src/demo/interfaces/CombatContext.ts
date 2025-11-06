import { BaseAction } from "../actions/Base";
import { Fighter } from "../Fighter";
import { DamageByFighter } from "./Damage";

type EnvironmentData = {
  temperature: number;
  brightness: number;
  visibility: number;
  humidity: number;
}

export interface CombatContext {
  environment?: EnvironmentData;
  attacker: Fighter;
  defender: Fighter;

  // Ergebnisfelder, die Regeln füllen:
  damageCaused?: DamageByFighter;
  damageDealt?: DamageByFighter;
  damageReceived?: DamageByFighter;
  damageTaken?: DamageByFighter;

  log?: string[];
}
