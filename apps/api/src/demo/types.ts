export enum ActionType {
  ATTACK = "A",
  DEFEND = "V",
  UTILITY = "N",
  UTILITY_ATTACK = "Na",
  UTILITY_DEFEND = "Nv",
}

export interface ActionResult {
  damageToOpponent: number;
  blockApplied: number;
  energyChange: number;
}
