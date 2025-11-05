import { BaseAction } from "../actions/Base";
import { Fighter } from "../Fighter";

export interface RoundContext {
  roundNumber: number;
  self: {
    character: Fighter;
    action: BaseAction;
    tempo: number;
    impact: number;
  };
  target: {
    character: Fighter;
    action: BaseAction;
    tempo: number;
    impact: number;
  };

  // Ergebnisfelder, die Regeln füllen:
  damageDealt?: number;
  damageReceived?: number;
  energyGained?: number;

  log?: string[];
}
