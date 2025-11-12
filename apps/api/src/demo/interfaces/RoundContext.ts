import { FighterId } from "../Fighter";
import { CombatContext } from "./CombatContext";
import { RoundFighterState } from "./RoundFighterState";
import { TempoGroup } from "./TempoGroup";


export interface RoundContext {
  roundNumber: number;
  groupsByTempo?: TempoGroup[];
  fighters: Map<FighterId, RoundFighterState>;

  // --- Kalkulationen
  plannedDamage: Map<FighterId, number>;
  plannedBlock: Map<FighterId, number>;
  plannedEnergyGain: Map<FighterId, number>;
  extraDamageById: Map<FighterId, number>;
  energyGainAddById: Map<FighterId, number>;
  damageMultipliersById: Map<FighterId, number>;

  /** Referenz zum CombatContext */
  readonly combatContext?: CombatContext;

  roundLog: string[];
}
