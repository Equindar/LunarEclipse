import { FighterAction } from "./FighterAction";

export interface ActionPattern {
  name: string;
  probability: number;
  pattern: FighterAction[];
}
