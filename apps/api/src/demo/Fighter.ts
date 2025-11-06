import { ActionType } from "./types/types";

export class Fighter {
  name: string;
  health: {
    maximal: number;
    remaining: number;
  }
  energy: number;
  nextAttackBonus: number = 0;
  nextDefenseBonus: number = 0;

  constructor(name: string, health = { maximal: 20, remaining: 20 }, energy = 2) {
    this.name = name;
    this.health = health;
    this.energy = energy;
  }

  public spendEnergy(amount: number): boolean {
    if (this.energy < amount) return false;
    this.energy -= amount;
    return true;
  }

  public gainEnergy(amount: number): void {
    this.energy += amount;
  }

  public takeDamage(amount: number): void {
    this.health.remaining -= Math.max(0, amount);
  }

  public applyBuff(action: ActionType): void {
    if (action === ActionType.UTILITY_ATTACK) this.nextAttackBonus += 1;
    if (action === ActionType.UTILITY_DEFEND) this.nextDefenseBonus += 1;
  }

  public resetAttackBuff(): void {
    this.nextAttackBonus = 0;
  }

  public resetDefenseBuff(): void {
    this.nextDefenseBonus = 0;
  }
}
