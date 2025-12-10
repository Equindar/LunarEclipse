import { BaseAction } from "../actions/Base";
import { FighterId } from "../Fighter";
import { IActionContext } from "../interfaces/ActionContext";
import { ICombatContext } from "../interfaces/CombatContext";
import { FighterAction } from "../interfaces/FighterAction";
import { IRoundContext } from "../interfaces/RoundContext";
import { TempoGroup, TempoGroupEntry } from "../interfaces/TempoGroup";
import { RoundFighterState } from "../RoundFighterState";
import { RuleRegistry } from "../RuleRegistry";
import { ActionContext } from "./ActionContext";
import { CombatContext } from "./CombatContext";

export class RoundContext implements IRoundContext {
  roundNumber: number;
  fighters: Map<FighterId, RoundFighterState> = new Map();

  private ruleRegistry: RuleRegistry;
  private combatContext: CombatContext;

  // --- Kalkulationen
  plannedDamage: Map<FighterId, number> = new Map();
  plannedBlock: Map<FighterId, number> = new Map();
  plannedEnergyGain: Map<FighterId, number> = new Map();
  extraDamageById: Map<FighterId, number> = new Map();
  energyGainAddById: Map<FighterId, number> = new Map();
  damageMultipliersById: Map<FighterId, number> = new Map();

  tempoGroups?: TempoGroup[];
  log: string[] = [];


  constructor(
    roundNumber: number,
    ctx: ICombatContext,
    registry: RuleRegistry
  ) {
    this.roundNumber = roundNumber;
    this.combatContext = ctx;
    this.ruleRegistry = registry;
  }


  commit(): void {
    for (const [id, stage] of this.fighters.entries()) {
      const base = this.plannedDamage.get(id) ?? 0;
      const extra = this.extraDamageById.get(id) ?? 0;
      const mult = this.damageMultipliersById.get(id) ?? 1;
      const block = this.plannedBlock.get(id) ?? 0;
      const raw = (base + extra) * mult;
      const finalDamage = Math.max(0, Math.floor(raw - block));
      // apply to round snapshot
      stage.health = stage.health - finalDamage;
      this.log.push(`[commit] ${stage.id} takes ${finalDamage} dmg (base=${base}, extra=${extra}, mult=${mult}, block=${block})`);
    }

    // energy gains
    for (const [id, state] of this.fighters.entries()) {
      const baseGain = this.plannedEnergyGain.get(id) ?? 0;
      const add = this.energyGainAddById.get(id) ?? 0;
      const finalGain = Math.max(0, Math.floor(baseGain + add));
      if (finalGain > 0) {
        state.gainEnergy(finalGain);
      }
    }
  }

  build(): void {
    // --- logger.warn("RoundContext.build()");

    this.fighters.clear();
    for (const [id, fighter] of this.combatContext.fighters.entries()) {
      if (fighter.health.actual > 0) {
        const fighterState = RoundFighterState.create(fighter);
        this.fighters.set(id, fighterState);
      }
    }

    this.plannedDamage = new Map();
    this.plannedBlock = new Map();
    this.plannedEnergyGain = new Map();
    this.extraDamageById = new Map();
    this.energyGainAddById = new Map();
    this.damageMultipliersById = new Map();

    this.ruleRegistry.applyPhase("preActionRound", { combatContext: this.combatContext, roundContext: this });
  }

  createActionContext(actorId: FighterId, actionIndex?: number): IActionContext {
    // --- logger.warn("RoundContext.createActionContext()");
    const actionCtx = new ActionContext();
    actionCtx.build({
      roundCtx: this,
      actorId,
      actionIndex: actionIndex ?? 0,
      combatCtx: this.combatContext
    })
    return actionCtx;
  }

  calculateTempoGroups(): TempoGroup[] {
    var result: TempoGroup[] = [];
    type Internal = { fighter: FighterId; actionIndex: number; action: FighterAction; totalTempo: number };
    const temp: Internal[] = [];

    for (const [id, state] of this.fighters.entries()) {
      const index = state.actionIndex ?? 0;
      const entry = state.actions?.pattern?.[index];
      if (!entry) {
        // No action for this fighter this round -> skip
        continue;
      }
      // baseTempo assumed to be on BaseAction (fallback to 0 if missing)
      const baseTempo = (entry.action && (entry.action as BaseAction).baseTempo) ?? 0;
      const investedTempo = Number(entry.investedTempo ?? 0);
      temp.push({
        fighter: id,
        actionIndex: index,
        action: entry,
        totalTempo: baseTempo + investedTempo,
      });
    }

    // Stable sort: by totalTempo desc, then by fighter id asc as deterministic tie-breaker
    temp.sort((a, b) => {
      if (b.totalTempo !== a.totalTempo) return b.totalTempo - a.totalTempo;
      return a.fighter.localeCompare(b.fighter);
    });

    // Group into TempoGroup[]
    let currentTempo: number | null = null;
    let currentActions: TempoGroupEntry[] = [];

    for (const item of temp) {
      if (currentTempo === null || item.totalTempo !== currentTempo) {
        // push previous group
        if (currentActions.length > 0) {
          result.push({
            tempo: currentTempo!,
            actions: currentActions,
          });
        }
        // start new group
        currentTempo = item.totalTempo;
        currentActions = [
          {
            fighter: item.fighter,
            action: item.action,
          } as TempoGroupEntry,
        ];
      } else {
        // same tempo -> append
        currentActions.push({
          fighter: item.fighter,
          actionIndex: item.actionIndex,
          action: item.action,
        } as TempoGroupEntry);
      }
    }
    // push last group
    if (currentActions.length > 0) {
      result.push({
        tempo: currentTempo!,
        actions: currentActions,
      });
    }

    this.tempoGroups = result;
    return result;
  }

  addPlannedDamage(targetId: FighterId, amount: number) {
    const prev = this.plannedDamage.get(targetId) ?? 0;
    this.plannedDamage.set(targetId, prev + amount);
  }

  addPlannedBlock(fighterId: FighterId, amount: number) {
    const prev = this.plannedBlock.get(fighterId) ?? 0;
    this.plannedBlock.set(fighterId, prev + amount);
  }

  addPlannedEnergyGain(fighterId: FighterId, amount: number) {
    const prev = this.plannedEnergyGain.get(fighterId) ?? 0;
    this.plannedEnergyGain.set(fighterId, prev + amount);
  }
}
