import logger from "../utils/apiLogger";
import { IRoundContext } from "./interfaces/RoundContext";
import { ICombatContext } from "./interfaces/CombatContext";
import { ActionPattern } from "./interfaces/ActionPattern";
import { EarlyEnergyBoostRule } from "./rules/EarlyEnergyBoost.rule";
import { VengefulComebackRule } from "./rules/VengefulComeback.rule";
import { formatDuration } from "./utils/time";

export class CombatEngine {
  /** Rundenlänge in Millisekunden */
  combatRoundLengthInMs: number = 10000;
  combatContext: ICombatContext;

  constructor(ctx: ICombatContext) {
    this.combatContext = ctx;
  }

  public initCombat() {
    // --- logger.warn("CombatEngine.initCombat()");
    // Set inital RoundNumber
    this.combatContext.currentRound = 0;

    // Register Rules in RuleRegistry
    this.combatContext.ruleRegistry.register(EarlyEnergyBoostRule)
    this.combatContext.ruleRegistry.register(VengefulComebackRule)

    this.combatContext.ruleRegistry.applyPhase("preCombat", { combatContext: this.combatContext });
  }

  public calculateLooting() {
    throw new Error("not implemented yet.")
  }

  public resolveCombatRound() {
    // --- logger.warn("CombatEngine.resolveCombatRound()");
    this.combatContext.currentRound += 1;

    const roundContext = this.combatContext.createRound();
    roundContext.build();

    // this.registry.applyPhase("preCombatRound", { combat: this.combatContext, round: roundContext });
    // DEBUG Ausgabe
    logger.info(`[${formatDuration(this.combatContext.time.elapsed)}] Runde #${roundContext.roundNumber}:`);
    roundContext.fighters.forEach(element => {
      var debug: string = "";
      logger.info(`${element.id}: [HP:${element.health}, E:${element.energy}]`);
      element.actions.pattern.forEach(element => {
        debug += `${element.action.type}:t${element.investedTempo},i${element.investedImpact} `;
      });
      logger.debug(`${element.actions.name} (${element.actions.probability}) - ${debug}`);
    });

    // ActionPatterns ermitteln, wenn nötig
    this.ensureActionsForActionRound(roundContext);
    // TempoGroups ermitteln
    const groups = roundContext.calculateTempoGroups();

    const actedFighters = new Set<string>();

    // logger.debug(roundContext);

    for (const tempoGroup of groups) {
      this.combatContext.ruleRegistry.applyPhase("preGroup", { combatContext: this.combatContext, roundContext: roundContext });
      let perspective: "Engage" | "Reaction" = "Engage";

      if (tempoGroup.actions.length === 1) {
        // Es ist genau eine Aktion in dieser TempoGruppe vorhanden
        // logger.error("tempoGroup.actions.length: 1");
        const entry = tempoGroup.actions[0];
        // ActionContext erstellen
        const actionContext = roundContext.createActionContext(entry.fighter, entry.actionIndex);

        // Ermittle Perspektive (basierend auf actedFighters)
        if (actionContext.selectedTargets) {
          const anyTargetActed = actionContext.selectedTargets.some(item => actedFighters.has(item.id));
          perspective = anyTargetActed ? "Reaction" : "Engage";
        }

        this.combatContext.ruleRegistry.applyPhase("preAction", { combatContext: this.combatContext, roundContext: roundContext, actionContext: actionContext });
        actionContext.execute(perspective, this.combatContext.ruleRegistry);
        this.combatContext.ruleRegistry.applyPhase("postAction", { combatContext: this.combatContext, roundContext: roundContext, actionContext: actionContext });

        actionContext.commit();
        // Füge Kämpfer zur Liste 'actedFighters' hinzu
        actedFighters.add(entry.fighter)
      } else {
        // Es sind mehr als eine Aktion in dieser TempoGruppe vorhanden
        // logger.error(`tempoGroup.actions.length: ${tempoGroup.actions.length}`);
        // simultaneous group: preAction for all, then resolve all, then postAction for all
        const actionCtxs = tempoGroup.actions.map(action => roundContext.createActionContext(action.fighter, action.actionIndex));
        for (const ctx of actionCtxs) this.combatContext.ruleRegistry.applyPhase("preAction", { combatContext: this.combatContext, roundContext: roundContext, actionContext: ctx });

        for (const ctx of actionCtxs) ctx.execute("Moment", this.combatContext.ruleRegistry);

        for (const ctx of actionCtxs) this.combatContext.ruleRegistry.applyPhase("postAction", { combatContext: this.combatContext, roundContext: roundContext, actionContext: ctx });

        for (const ctx of actionCtxs) ctx.commit();
        // commit group-level effects (recommended) - e.g. resolve area-of-effect application, mark KOs
        // this.commitGroupEffects(tempoGroup, roundContext);

        // Füge alle Kämpfer zur Liste 'actedFighters' hinzu
        for (const element of tempoGroup.actions) actedFighters.add(element.fighter);
      }

      this.combatContext.ruleRegistry.applyPhase("postGroup", { combatContext: this.combatContext, roundContext: roundContext });

      // Optional: prune fighters with hp <= 0 from remaining groups (if you want immediate KO removal)
      // this.removeDeadFromFutureGroups(roundContext, groups);
    }
    roundContext.commit();
    this.combatContext.ruleRegistry.applyPhase("postActionRound", { combatContext: this.combatContext, roundContext: roundContext });

    this.advanceActionIndices(roundContext);
    this.commitCombatRound(roundContext);

    this.combatContext.fighters.forEach(element => {
      if (element.health.actual <= 0) {
        this.combatContext.fighters.delete(element.name);
        logger.error(`${element.name} wurde entfernt. (HP unter 0)`);
      }
    });
  }

  public commitCombatRound(ctx: IRoundContext) {
    // compute finalDamage / energy / apply status durations
    // update combatCtx.fighters (persistent), update logs
    // run resolve end-of-round side effects
    for (const [id, stage] of ctx.fighters.entries()) {
      const persistent = this.combatContext.fighters.get(id);
      if (!persistent) continue;
      persistent.health.actual = stage.health;
      persistent.energy.actual = stage.energy;
      persistent.buffs.nextAttack = stage.nextAttackBonus;
      persistent.buffs.nextDefense = stage.nextDefenseBonus;
      persistent.currentActionIndex = stage.actionIndex;
      persistent.currentPattern = stage.actions;
      // commit other persistent fields as needed
    }
    this.combatContext.time.elapsed += 2000;
  }

  // public commitActionRound(roundCtx: IRoundContext, combatCtx: ICombatContext) {
  //   logger.warn("CombatEngine.commitActionRound()");
  //   // ToDo:
  //   // Nimm alle Änderungen aus dem RoundContext (RoundFighterState) und aktualisiere CombatContext (Fighter)
  //   for (const [playerId, rstate] of roundCtx.fighters.entries()) {
  //     const baseDmg = roundCtx.plannedDamage.get(playerId) ?? 0;
  //     const extra = roundCtx.extraDamageById.get(playerId) ?? 0;
  //     const multiplier = roundCtx.damageMultipliersById.get(playerId) ?? 1;
  //     const block = roundCtx.plannedBlock.get(playerId) ?? 0;

  //     const raw = (baseDmg + extra) * multiplier;
  //     const finalDamage = Math.max(0, Math.floor(raw - block));

  //     // Apply to round state
  //     rstate.takeDamage(finalDamage);

  //     roundCtx.roundLog.push(`[commit] ${rstate.id} takes ${finalDamage} (base:${baseDmg}, extra:${extra}, mult:${multiplier}, block:${block})`);
  //     logger.debug(`[commit] ${rstate.id} takes ${finalDamage} (base:${baseDmg}, extra:${extra}, mult:${multiplier}, block:${block})`);
  //   }

  //   // 2) Energy gains
  //   for (const [playerId, rstate] of roundCtx.fighters.entries()) {
  //     const baseGain = roundCtx.plannedEnergyGain.get(playerId) ?? 0;
  //     const add = roundCtx.energyGainAddById.get(playerId) ?? 0;
  //     const mult = roundCtx.damageMultipliersById.get(playerId) ?? 1; // maybe separate multiplier for energy
  //     const finalGain = Math.max(0, Math.floor((baseGain + add) * mult));

  //     if (finalGain > 0) {
  //       rstate.gainEnergy(finalGain);
  //       roundCtx.roundLog.push(`[commit] ${rstate.id} gains ${finalGain} energy`);
  //       logger.debug(`[commit] ${rstate.id} gains ${finalGain} energy`);
  //     }
  //   }

  //   // 3) Apply RoundState back to domain Players (persist)
  //   for (const [id, rstate] of roundCtx.fighters.entries()) {
  //     const player = combatCtx.fighters.get(id);
  //     if (!player) continue;
  //     // Option A: set values atomically
  //     player.health.actual = rstate.hp;
  //     player.energy.actual = rstate.energy;
  //     // Option B: call domain methods for side-effects/logging
  //     // player.takeDamage(originalHP - rstate.hp) etc.
  //   }
  // }

  public isCombatOver(): boolean {
    // Gibt es nur noch einen Überlebenden? (Free for All)
    return this.combatContext.fighters.size === 1;
  }

  public advanceActionIndices(round: IRoundContext) {
    for (const [id, stage] of round.fighters.entries()) {
      const old = stage.actionIndex ?? 0;
      const next = old + 1;
      if (stage.actions && next < stage.actions.pattern.length) {
        stage.actionIndex = next;
      } else {
        // naive: reset to 0 (or call getNewActionPattern)
        stage.actions = this.getNewActionPattern(this.combatContext, id); // assumed sync here, adapt if async
        stage.actionIndex = 0;
      }
    }
  }

  public ensureActionsForActionRound(roundCtx: IRoundContext) {
    for (const [id, f] of roundCtx.fighters.entries()) {
      // defensive: if no actions at all -> request new
      if (!f.actions || !Array.isArray(f.actions.pattern) || f.actions.pattern.length === 0) {
        const newPattern = this.getNewActionPattern(this.combatContext, id);
        f.actions = newPattern;
        f.actionIndex = 0;
        roundCtx.log.push(`ensureActions: ${id} got new pattern (was missing)`);
        continue;
      }

      // if actionIndex invalid -> request new pattern
      const idx = Number.isFinite(f.actionIndex) ? f.actionIndex : 0;
      if (idx < 0 || idx >= f.actions.pattern.length) {
        const newPattern = this.getNewActionPattern(this.combatContext, id);
        f.actions = newPattern;
        f.actionIndex = 0;
        roundCtx.log.push(`ensureActions: ${id} pattern exhausted -> new pattern loaded`);
      }
    }
  }

  private getNewActionPattern(ctx: ICombatContext, fighterId: string, random?: () => number): ActionPattern {
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
}

