import { FighterId } from "../Fighter";
import { IActionContext } from "./ActionContext";
import { RoundFighterState } from "./RoundFighterState";
import { TempoGroup } from "./TempoGroup";


export interface IRoundContext {
  readonly roundNumber: number;
  fighters: Map<FighterId, RoundFighterState>;
  log: string[];

  plannedDamage: Map<FighterId, number>;
  plannedBlock: Map<FighterId, number>;
  plannedEnergyGain: Map<FighterId, number>;
  extraDamageById: Map<FighterId, number>;
  energyGainAddById: Map<FighterId, number>;
  damageMultipliersById: Map<FighterId, number>;

  build(): void;
  createActionContext(actorId: FighterId, patternIndex?: number): IActionContext;
  calculateTempoGroups(): TempoGroup[]
  commit(): void;
}
