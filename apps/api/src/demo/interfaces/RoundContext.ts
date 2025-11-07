import { CombatContext } from "./CombatContext";
import { FighterId, RoundFighterState } from "./RoundFighterState";


export interface RoundContext {
  roundNumber: number;
  groupsByTempo?: Array<{ tempo: number; fighters: Map<FighterId, RoundFighterState> }>

  // --- Kalkulationen
  plannedDamage: Map<FighterId, number>;
  plannedBlock: Map<FighterId, number>;
  plannedEnergyGain: Map<FighterId, number>;
  extraDamageById: Map<FighterId, number>;
  energyGainAddById: Map<FighterId, number>;
  damageMultipliersById: Map<FighterId, number>;

  /** Referenz zum CombatContext */
  readonly combatContext?: CombatContext;

  log?: string[];
}
