import { ActionPattern } from "./interfaces/ActionPattern";
import { ActionType } from "./types/ActionType";

export class Fighter {
  name: string;
  health: {
    maximal: number;
    actual: number;
  };
  energy: {
    maximal: number;
    actual: number;
  };
  skills?: string[];
  actionPatterns?: ActionPattern[];

  constructor(name: string, health = { maximal: 100, actual: 100 }, energy = { maximal: 50, actual: 50 }, actions: ActionPattern[]) {
    this.name = name;
    this.health = health;
    this.energy = energy;
    this.actionPatterns = actions;
  }

  // public spendEnergy(amount: number): boolean {
  //   if (this.energy.actual < amount) return false;
  //   this.energy.actual -= amount;
  //   return true;
  // }

  // public gainEnergy(amount: number): void {
  //   this.energy.actual += amount;
  //   // avoid energy overflow
  //   if (this.energy.actual > this.energy.maximal) {
  //     this.energy.actual = this.energy.maximal;
  //   }
  // }

  // public takeDamage(amount: number): void {
  //   this.health.actual -= Math.max(0, amount);
  // }

  // public applyBuff(action: ActionType): void {
  //   if (action === ActionType.UTILITY_ATTACK) this.nextAttackBonus += 1;
  //   if (action === ActionType.UTILITY_DEFEND) this.nextDefenseBonus += 1;
  // }

  // public resetAttackBuff(): void {
  //   this.nextAttackBonus = 0;
  // }

  // public resetDefenseBuff(): void {
  //   this.nextDefenseBonus = 0;
  // }
}
