import { Fighter, FighterId } from "./Fighter";
import { ActionPattern } from "./interfaces/ActionPattern";
import { IRoundFighterState } from "./interfaces/RoundFighterState";
import { ActionType } from "./types/ActionType";

export class RoundFighterState implements IRoundFighterState {
  constructor(
    public id: FighterId,
    public health: number,
    public energy: number,
    public nextAttackBonus: number = 0,
    public nextDefenseBonus: number = 0,
    public actions: ActionPattern,
    public actionIndex: number = 0
  ) { }

  static create(fighter: Fighter): RoundFighterState {
    return new RoundFighterState(
      fighter.name,
      fighter.health.actual,
      fighter.energy.actual,
      fighter.buffs.nextAttack ?? 0,
      fighter.buffs.nextDefense ?? 0,
      fighter.currentPattern ?? fighter.actions[0],
      fighter.currentActionIndex ?? 0
    );
  }

  public applyBuff(action: ActionType, amount?: number): void {
    if (action === ActionType.UTILITY_ATTACK) this.nextAttackBonus += amount ?? 1;
    if (action === ActionType.UTILITY_DEFEND) this.nextDefenseBonus += amount ?? 1;
  }

  public resetAttackBuff(): void {
    this.nextAttackBonus = 0;
  }

  public resetDefenseBuff(): void {
    this.nextDefenseBonus = 0;
  }

  /** Schaden wird direkt auf RoundFighterState angewendet */
  takeDamage(amount: number): number {
    const damage = Math.floor(Math.max(0, amount));
    this.health -= damage;
    if (this.health < 0) this.health = 0;
    return damage;
  }

  /** Energie wird direkt auf RoundFighterState gutgeschrieben */
  gainEnergy(amount: number): number {
    const gain = Math.floor(Math.max(0, amount));
    this.energy += gain;
    return gain;
  }

  /** Lebenspunkte werden direkt auf RoundFighterState gutgeschrieben */
  gainHealth(amount: number): number {
    const gain = Math.floor(Math.max(0, amount));
    this.health += gain;
    return gain;
  }
}
