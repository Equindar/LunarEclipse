import { Fighter } from "../Fighter";
import { ICombatContext } from "../interfaces/CombatContext";
import { DamageByFighter } from "../interfaces/Damage";
import { IRoundContext } from "../interfaces/RoundContext";
import { Rule } from "../interfaces/Rule";
import { RuleRegistry } from "../RuleRegistry";
import { RoundContext } from "./RoundContext";

export class CombatContext implements ICombatContext {
  readonly randomSeed?: string | undefined;
  public currentRound: number;
  readonly environment?: { temperature: number; brightness: number; visibility: number; humidity: number; } | undefined;
  time: { start: Date; elapsed: number; end?: Date; };
  ruleRegistry: RuleRegistry;
  fighters: Map<string, Fighter> = new Map();

  damageCaused?: DamageByFighter | undefined;
  damageDealt?: DamageByFighter | undefined;
  damageReceived?: DamageByFighter | undefined;
  damageTaken?: DamageByFighter | undefined;
  log?: string[] | undefined;

  constructor(
    public readonly identifier: string,
    startTime: Date,
    registry: RuleRegistry
  ) {
    this.ruleRegistry = registry;
    this.currentRound = 0;
    this.time = {
      start: startTime,
      elapsed: 0
    }


  }
  createRound(): IRoundContext {
    return new RoundContext(this.currentRound, this, this.ruleRegistry);
  }
  registerRule(rule: Rule): void {
    throw new Error("Method not implemented.");
  }
}
