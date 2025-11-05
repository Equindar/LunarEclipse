import { BaseAction } from "../actions/Base";
import { Fighter } from "../Fighter";

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
  attackerAction: BaseAction;
  defenderAction: BaseAction;
  tempoA: number;
  tempoD: number;
  aInvest: number;
  dInvest: number;

  // Ergebnisfelder, die Regeln füllen:
  damageToDefender?: number;
  damageToAttacker?: number;
  energyChangeA?: number;
  energyChangeD?: number;
  log?: string[];
}
