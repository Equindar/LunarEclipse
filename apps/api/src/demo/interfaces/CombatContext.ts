import { Fighter, FighterId } from "../Fighter";
import { RuleRegistry } from "../RuleRegistry";
import { DamageByFighter } from "./Damage";
import { IRoundContext } from "./RoundContext";
import { Rule } from "./Rule";

type EnvironmentData = {
  temperature: number;
  brightness: number;
  visibility: number;
  humidity: number;
}

export interface ICombatContext {
  readonly identifier: string;
  readonly fighters: Map<FighterId, Fighter>;
  readonly environment?: EnvironmentData;
  ruleRegistry: RuleRegistry;
  randomSeed?: string;
  currentRound: number;
  time: {
    start: Date,
    end?: Date
  }

  createRound(): IRoundContext;
  registerRule(rule: Rule): void;
  // snapshot(): CombatSnapshot
  // restoreSnapshot():

  // Ergebnisfelder, die Regeln füllen:
  damageCaused?: DamageByFighter;
  damageDealt?: DamageByFighter;
  damageReceived?: DamageByFighter;
  damageTaken?: DamageByFighter;

  log?: string[];
}
