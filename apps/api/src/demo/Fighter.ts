import { ActionPattern } from "./interfaces/ActionPattern";

export type FighterId = string;

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
  buffs: {
    nextAttack: number;
    nextDefense: number;
  }
  skills?: string[];
  actions: ActionPattern[];

  currentActionIndex: number;
  currentPattern?: ActionPattern;

  constructor(name: string, health = { maximal: 100, actual: 100 }, energy = { maximal: 50, actual: 50 }, buffs = { nextAttack: 0, nextDefense: 0 }, actions: ActionPattern[]) {
    this.name = name;
    this.health = health;
    this.energy = energy;
    this.buffs = buffs;
    this.actions = actions;
    this.currentActionIndex = 0;
  }
}
