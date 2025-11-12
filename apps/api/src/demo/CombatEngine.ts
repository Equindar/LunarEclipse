import { Fighter, FighterId } from "./Fighter";
import { BaseAction, swapResolveProps } from "./actions/Base";
import logger from "../utils/apiLogger";
import { RuleRegistry } from "./RuleRegistry";
import { RoundContext } from "./interfaces/RoundContext";
import { CombatContext } from "./interfaces/CombatContext";
import { RoundFighterStateImpl } from "./RoundFighterState.impl";
import { ActionPattern } from "./interfaces/ActionPattern";
import { RoundFighterState } from "./interfaces/RoundFighterState";
import { ActionType } from "./types/ActionType";
import { TempoGroup, TempoGroupEntry } from "./interfaces/TempoGroup";
import { FighterAction } from "./interfaces/FighterAction";

export class CombatEngine {
  /** Rundenlänge in Millisekunden */
  combatRoundLengthInMs: number = 10000;
  combatContext: CombatContext = {
    identifier: "",
    time: {
      start: new Date(Date.now()),
      end: undefined
    },
    fighters: new Map(),
    currentRound: 1
  };

  constructor(private registry: RuleRegistry) { }

  public initCombat(ctx: CombatContext) {
    logger.warn("CombatEngine.initCombat()");
    this.registry.applyPhase("preCombat", { combat: this.combatContext });
  }


  public buildRoundContext(roundNumber: number, ctx: CombatContext): RoundContext {
    // RoundContext erstellen
    let roundContext: RoundContext = {
      roundNumber: roundNumber,
      fighters: new Map(),
      plannedDamage: new Map(),
      plannedBlock: new Map(),
      plannedEnergyGain: new Map(),
      extraDamageById: new Map(),
      energyGainAddById: new Map(),
      damageMultipliersById: new Map(),
      roundLog: []
    }

    ctx.fighters.forEach((item) => {
      const id: FighterId = item.name
      const fighterState: RoundFighterState = new RoundFighterStateImpl(
        id, item.health.actual, item.energy.actual, 0, 0, this.getNewActionPattern(ctx, item.name)
      );
      roundContext.fighters.set(id, fighterState);
    })

    return roundContext;
  }

  public calculateLooting() {
    throw new Error("not implemented yet.")
  }



  public resolveCombatRound() {
    this.combatContext.currentRound += 1;
    const roundNumber = this.combatContext.currentRound;

    const roundContext = this.buildRoundContext(roundNumber, this.combatContext);

    for (const element of roundContext.fighters.values()) {
      if (!element.actions || element.actions.pattern.length === 0) {
        element.actions = this.getNewActionPattern(this.combatContext, element.id);
      }
    }

    this.registry.applyPhase("preCombatRound", { combat: this.combatContext, round: roundContext });

    // TempoGroups ermitteln
    roundContext.groupsByTempo = this.calculateTempoGroups(roundContext.fighters);
    logger.debug(roundContext);

    for (const tempoGroup of roundContext.groupsByTempo) {
      this.registry.applyPhase("preGroup", { combat: this.combatContext, round: roundContext });

      if (tempoGroup.actions.length === 1) {
        const entry = tempoGroup.actions[0];
        const actionContext = buildActionContext(entry.fighter, roundContext, /*patternIndex*/ 0);
        this.registry.applyPhase("preAction", { combat: this.combatContext, round: roundContext, action: actionContext });

        // Engine decides perspective (first/second) here already because it's highest group.
        this.resolveActionRound(actionContext);

        this.registry.applyPhase("postAction", { combat: this.combatContext, round: roundContext, action: actionContext });

        this.commitActionRound(actionContext, roundContext); // optional minimal commit (or no-op)
      } else {
        // simultaneous group: preAction for all, then resolve all, then postAction for all
        const actionCtxs = tempoGroup.actions.map(a => buildActionContext(a.fighter, roundContext));
        for (const ctx of actionCtxs) this.registry.applyPhase("preAction", { combat: this.combatContext, round: roundContext, action: ctx });

        for (const ctx of actionCtxs) this.resolveActionRound(ctx /* as simultaneous */);

        for (const ctx of actionCtxs) this.registry.applyPhase("postAction", { combat: this.combatContext, round: roundContext, action: ctx });

        // commit group-level effects (recommended) - e.g. resolve area-of-effect application, mark KOs
        this.commitGroupEffects(tempoGroup, roundContext);
      }

      this.registry.applyPhase("postGroup", { combat: this.combatContext, round: roundContext });

      // Optional: prune fighters with hp <= 0 from remaining groups (if you want immediate KO removal)
      // this.removeDeadFromFutureGroups(roundContext, groups);
    }

  }


  public commitCombatRound() {
    throw new Error("not implemented yet.")
  }

  public resolveActionRound(roundCtx: RoundContext) {
    // ActionContext erstellen
    throw new Error("not implemented yet.")
  }

  public commitActionRound(roundCtx: RoundContext, fighters: Map<FighterId, RoundFighterState>) {
    // ToDo:
    // Nimm alle Änderungen aus dem RoundContext (RoundFighterState) und aktualisiere CombatContext (Fighter)
    for (const [playerId, rstate] of roundCtx.fighters.entries()) {
      const baseDmg = roundCtx.plannedDamage.get(playerId) ?? 0;
      const extra = roundCtx.extraDamageById.get(playerId) ?? 0;
      const multiplier = roundCtx.damageMultipliersById.get(playerId) ?? 1;
      const block = roundCtx.plannedBlock.get(playerId) ?? 0;

      const raw = (baseDmg + extra) * multiplier;
      const finalDamage = Math.max(0, Math.floor(raw - block));

      // Apply to round state
      rstate.takeDamage(finalDamage);

      roundCtx.roundLog.push(`[commit] ${rstate.id} takes ${finalDamage} (base:${baseDmg}, extra:${extra}, mult:${multiplier}, block:${block})`);
    }

    // 2) Energy gains
    for (const [playerId, rstate] of roundCtx.fighters.entries()) {
      const baseGain = roundCtx.plannedEnergyGain.get(playerId) ?? 0;
      const add = roundCtx.energyGainAddById.get(playerId) ?? 0;
      const mult = roundCtx.damageMultipliersById.get(playerId) ?? 1; // maybe separate multiplier for energy
      const finalGain = Math.max(0, Math.floor((baseGain + add) * mult));

      if (finalGain > 0) {
        rstate.gainEnergy(finalGain);
        roundCtx.roundLog.push(`[commit] ${rstate.id} gains ${finalGain} energy`);
      }
    }

    // 3) Apply RoundState back to domain Players (persist)
    for (const [id, rstate] of roundCtx.fighters.entries()) {
      const player = fighters.get(id);
      if (!player) continue;
      // Option A: set values atomically
      player.hp = rstate.hp;
      player.energy = rstate.energy;
      // Option B: call domain methods for side-effects/logging
      // player.takeDamage(originalHP - rstate.hp) etc.
    }

    // 4) Return roundCtx.roundLog or structured result
    return {
      log: roundCtx.roundLog,
      finalStates: Array.from(roundCtx.fighters.values()).map(s => ({ id: s.id, hp: s.hp, energy: s.energy }))
    };
  }

  public isCombatOver(roundCtx: RoundContext): boolean {
    // Gibt es nur noch einen Überlebenden? (Free for All)
    throw new Error("not implemented yet.")
    return false;
  }

  private calculateTempoGroups(fighters: Map<FighterId, RoundFighterState>): TempoGroup[] {
    var result: TempoGroup[] = [];
    // Collect individual actor-action entries with computed totalTempo
    type InternalEntry = {
      fighter: FighterId;
      action: FighterAction; // from your types, re-used here
      totalTempo: number;
    };

    const entries: InternalEntry[] = [];

    for (const [fighterId, fState] of fighters.entries()) {
      const pattern = fState.actions?.pattern ?? [];
      if (!pattern || pattern.length === 0) {
        // No action for this fighter this round -> skip
        continue;
      }

      // Use the first action in the pattern as the "current" action for grouping.
      const fa = pattern[0];

      // baseTempo assumed to be on BaseAction (fallback to 0 if missing)
      const baseTempo = (fa.action && (fa.action as BaseAction).baseTempo) ?? 0;

      const investedTempo = Number(fa.investedTempo ?? 0);
      const totalTempo = baseTempo + investedTempo;

      entries.push({
        fighter: fighterId,
        action: fa,
        totalTempo,
      });
    }

    // Stable sort: by totalTempo desc, then by fighter id asc as deterministic tie-breaker
    entries.sort((a, b) => {
      if (b.totalTempo !== a.totalTempo) return b.totalTempo - a.totalTempo;
      // tie-breaker
      return a.fighter.localeCompare(b.fighter);
    });

    // Group into TempoGroup[]
    let currentTempo: number | null = null;
    let currentActions: TempoGroupEntry[] = [];

    for (const e of entries) {
      if (currentTempo === null || e.totalTempo !== currentTempo) {
        // push previous group
        if (currentActions.length > 0) {
          result.push({
            tempo: currentTempo!,
            actions: currentActions,
          });
        }
        // start new group
        currentTempo = e.totalTempo;
        currentActions = [
          {
            fighter: e.fighter,
            action: e.action,
          } as TempoGroupEntry,
        ];
      } else {
        // same tempo -> append
        currentActions.push({
          fighter: e.fighter,
          action: e.action,
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

    return result;
  }

  private getNewActionPattern(ctx: CombatContext, fighterId: string, random?: () => number): ActionPattern {
    // Parameter: Kämpfer
    const fighter = ctx.fighters.get(fighterId);

    // --- Validierung
    // Fighter vorhanden?
    // Aktionsmuster hinterlegt?
    if (fighter == undefined) {
      throw new Error(`Fighter ${fighterId} ist nicht im Kampf.`);
    }
    if (fighter?.actions?.length === 0) {
      throw new Error(`Fighter ${fighterId} hat keine Aktionen.`);
    }
    // Wahrscheinlichkeiten erkennen + Check auf Typ:Number
    const probs = fighter.actions!.map((item) => {
      const p = Number(item.probability);
      if (Number.isNaN(p)) throw new Error(`Ungültige Wahrscheinlichkeit bei Muster '${item.name}'`);
      return p;
    });

    // --- Initialisierung: Hilfs-Variablen
    // Zufallszahl
    const rng = random ?? Math.random;
    // Gefundene Wildcards in Aktionsmustern
    const wildcardIndices: number[] = [];
    // Container für errechnete Wahrscheinlichkeiten
    const assigned = new Array<number>(probs.length).fill(0);
    // Summe aller vorhandene, gültigen Wahrscheinlichkeiten
    let sumSpecified = 0;

    // --- Berechnung
    // Finde WildCards + Summiere Wahrscheinlichkeiten
    probs?.forEach((p, i) => {
      if (p === -1) wildcardIndices.push(i);
      else if (p >= 0) sumSpecified += p;
      else throw new Error(`Probability darf nur größer/gleich 0 oder -1 (Wildcard) sein. Gefunden: ${p} in ${fighter.actions![i].name}`);
    });

    // Check: keine Wildcards in Aktionsmustern?
    if (wildcardIndices.length === 0) {
      // Wildcards: keine
      if (sumSpecified <= 0) {
        // Summe: 0 -> gleiche Verteilung
        const equal = 1 / probs.length;
        for (let i = 0; i < assigned.length; i++) assigned[i] = equal;
      } else {
        // normalisiere so, dass Summe 1 ist (erlaubt wenn sumSpecified != 1)
        for (let i = 0; i < probs.length; i++) assigned[i] = probs[i] / sumSpecified;
      }
    } else {
      // Wildcards: 1
      // ToDo: verbleibender Anteil = 1 - sumSpecified
      let remaining = 1 - sumSpecified;

      if (remaining <= 0) {
        // SumSpecified >= 1: verteile alles proportional auf die spezifizierten -> Wildcards bekommen 0
        if (sumSpecified === 0) {
          // Extremfall: alle Wildcards aber sumSpecified 0? (eigentlich nicht möglich hier)
          const equal = 1 / wildcardIndices.length;
          for (const idx of wildcardIndices) assigned[idx] = equal;
        } else {
          for (let i = 0; i < probs.length; i++) {
            if (probs[i] === -1) assigned[i] = 0;
            else assigned[i] = probs[i] / sumSpecified;
          }
        }
      } else {
        // remaining > 0 -> teile den remaining gleichmäßig auf die Wildcards
        const share = remaining / wildcardIndices.length;
        for (let i = 0; i < probs.length; i++) {
          if (probs[i] === -1) assigned[i] = share;
          else assigned[i] = probs[i];
        }
        // jetzt noch sicherstellen, dass assigned aufsummiert 1 (evtl. Rundungsfehler)
        const sumAssigned = assigned.reduce((s, x) => s + x, 0);
        if (Math.abs(sumAssigned - 1) > 1e-12) {
          for (let i = 0; i < assigned.length; i++) assigned[i] = assigned[i] / sumAssigned;
        }
      }
    }

    // defensive: Falls durch Rundung noch nicht 1, normalisiere einmal final
    const finalSum = assigned.reduce((s, x) => s + x, 0);
    if (finalSum <= 0) {
      // fallback: gleiche Verteilung
      const equal = 1 / assigned.length;
      for (let i = 0; i < assigned.length; i++) assigned[i] = equal;
    } else if (Math.abs(finalSum - 1) > 1e-12) {
      for (let i = 0; i < assigned.length; i++) assigned[i] = assigned[i] / finalSum;
    }

    // kumulative Summen für Auswahl
    const cum: number[] = [];
    assigned.reduce((acc, cur, i) => {
      const next = acc + cur;
      cum[i] = next;
      return next;
    }, 0);
    const r = rng();
    // Auswahl: erstes index mit r < cum[index]
    let pickIndex = cum.findIndex((c) => r < c);
    if (pickIndex === -1) pickIndex = assigned.length - 1;

    const action = fighter.actions![pickIndex];
    logger.debug(`Neues Muster [${fighter.name}]: '${action.name}'`);
    return {
      name: action.name,
      probability: action.probability,
      pattern: action.pattern
    };
  }



  // public resolveRound(combatContext: CombatContext, roundContext: RoundContext): RoundContext {
  //   var attacker = roundContext.self;
  //   var defender = roundContext.target;

  //   logger.warn(combatContext.time.start.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));

  //   this.registry.applyPhase("preRound", { combat: combatContext, round: ctx });

  //   const attacker_detail_start = `${attacker.character.name}[HP:${attacker.character.health.actual}/${attacker.character.health.maximal},E:${attacker.character.energy.actual}/${attacker.character.energy.maximal}]`;
  //   const defender_detail_start = `${defender.character.name}[HP:${defender.character.health.actual}/${defender.character.health.maximal},E:${defender.character.energy.actual}/${defender.character.energy.maximal}]`;


  //   logger.info(`Runde #${ctx.roundNumber} (Start): ${attacker_detail_start} vs ${defender_detail_start}`);
  //   logger.debug(`${attacker.character.name}[${attacker.action.type}:t${attacker.tempo},i${attacker.impact}] vs ${defender.character.name}[${defender.action.type}:t${defender.tempo},i${defender.impact}]`);

  //   // Energie abziehen
  //   ctx.self.character.spendEnergy(ctx.self.action.totalEnergyCost(ctx.self.tempo + ctx.self.impact));
  //   ctx.target.character.spendEnergy(ctx.target.action.totalEnergyCost(ctx.target.tempo + ctx.target.impact));

  //   const tempoA = attacker.action.calculateTempo(attacker.tempo);
  //   const tempoD = defender.action.calculateTempo(defender.tempo);

  //   var actionProps: resolveProps = { self: attacker.character, target: defender.character, other: defender.action, impactSelf: attacker.impact, impactTarget: defender.impact }

  //   this.registry.applyPhase("preAction", { combat: combatContext, round: ctx });

  //   if (tempoA > tempoD) {
  //     attacker.action.resolveAsEngage(actionProps);
  //     defender.action.resolveAsReaction(swapResolveProps(actionProps));
  //   } else if (tempoA < tempoD) {
  //     defender.action.resolveAsEngage(swapResolveProps(actionProps));
  //     attacker.action.resolveAsReaction(actionProps);
  //   } else {
  //     attacker.action.resolveAsMoment(actionProps);
  //     defender.action.resolveAsMoment(swapResolveProps(actionProps));
  //   }

  //   this.registry.applyPhase("postAction", { combat: combatContext, round: ctx });

  //   const attacker_detail_end = `${attacker.character.name}[HP:${attacker.character.health.actual}/${attacker.character.health.maximal},E:${attacker.character.energy.actual}/${attacker.character.energy.maximal}]`;
  //   const defender_detail_end = `${defender.character.name}[HP:${defender.character.health.actual}/${defender.character.health.maximal},E:${defender.character.energy.actual}/${defender.character.energy.maximal}]`;
  //   logger.info(`Runde #${ctx.roundNumber} (End): ${attacker_detail_end} vs ${defender_detail_end}`);

  //   // Regel-Registry anwenden -> verändert ctx
  //   this.registry.applyPhase("postRound", { combat: combatContext, round: ctx });

  //   //  logger.debug(ctx.log);

  //   return ctx;
  // }
}
function buildActionContext(fighter: string, roundContext: RoundContext, arg2: number) {
  throw new Error("Function not implemented.");
}

