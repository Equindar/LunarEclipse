import { Fighter } from "./Fighter";
import { BaseAction, swapResolveProps } from "./actions/Base";
import logger from "../utils/apiLogger";
import { RuleRegistry } from "./RuleRegistry";
import { RoundContext } from "./interfaces/RoundContext";
import { CombatContext } from "./interfaces/CombatContext";
import { RoundFighterStateImpl } from "./RoundFighterState.impl";

export class CombatEngine {
  /** Rundenlänge in Millisekunden */
  roundLengthInMs: number = 10000;

  constructor(private registry: RuleRegistry) { }

  buildRoundContext(roundNumber: number, fighters: Fighter[]): RoundContext {
    const roundCtx: RoundContext = {
      roundNumber,
      groupsByTempo: new Array(),
      plannedDamage: new Map(),
      plannedBlock: new Map(),
      plannedEnergyGain: new Map(),
      extraDamageById: new Map(),
      energyGainAddById: new Map(),
      damageMultipliersById: new Map(),
      log: [],
      combatContext: undefined
    };

    var temp = new Map();
    for (const fighter of fighters) {
      // ToDo: Mapping verbessern: fighter.name -> fighterstate.id
      temp.set(fighter.name, new RoundFighterStateImpl(fighter.name, fighter.health.actual, fighter.energy.actual));
    }
    // ToDo: mehr als eine Group
    roundCtx.groupsByTempo?.push({ tempo: 0, fighters: temp });

    return roundCtx;
  }

  public resolveRound(combatContext: CombatContext, roundContext: RoundContext): RoundContext {
    var attacker = roundContext.self;
    var defender = roundContext.target;

    logger.warn(combatContext.time.start.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));

    this.registry.applyPhase("preRound", { combat: combatContext, round: ctx });

    const attacker_detail_start = `${attacker.character.name}[HP:${attacker.character.health.actual}/${attacker.character.health.maximal},E:${attacker.character.energy.actual}/${attacker.character.energy.maximal}]`;
    const defender_detail_start = `${defender.character.name}[HP:${defender.character.health.actual}/${defender.character.health.maximal},E:${defender.character.energy.actual}/${defender.character.energy.maximal}]`;


    logger.info(`Runde #${ctx.roundNumber} (Start): ${attacker_detail_start} vs ${defender_detail_start}`);
    logger.debug(`${attacker.character.name}[${attacker.action.type}:t${attacker.tempo},i${attacker.impact}] vs ${defender.character.name}[${defender.action.type}:t${defender.tempo},i${defender.impact}]`);

    // Energie abziehen
    ctx.self.character.spendEnergy(ctx.self.action.totalEnergyCost(ctx.self.tempo + ctx.self.impact));
    ctx.target.character.spendEnergy(ctx.target.action.totalEnergyCost(ctx.target.tempo + ctx.target.impact));

    const tempoA = attacker.action.calculateTempo(attacker.tempo);
    const tempoD = defender.action.calculateTempo(defender.tempo);

    var actionProps: resolveProps = { self: attacker.character, target: defender.character, other: defender.action, impactSelf: attacker.impact, impactTarget: defender.impact }

    this.registry.applyPhase("preAction", { combat: combatContext, round: ctx });

    if (tempoA > tempoD) {
      attacker.action.resolveAsEngage(actionProps);
      defender.action.resolveAsReaction(swapResolveProps(actionProps));
    } else if (tempoA < tempoD) {
      defender.action.resolveAsEngage(swapResolveProps(actionProps));
      attacker.action.resolveAsReaction(actionProps);
    } else {
      attacker.action.resolveAsMoment(actionProps);
      defender.action.resolveAsMoment(swapResolveProps(actionProps));
    }

    this.registry.applyPhase("postAction", { combat: combatContext, round: ctx });

    const attacker_detail_end = `${attacker.character.name}[HP:${attacker.character.health.actual}/${attacker.character.health.maximal},E:${attacker.character.energy.actual}/${attacker.character.energy.maximal}]`;
    const defender_detail_end = `${defender.character.name}[HP:${defender.character.health.actual}/${defender.character.health.maximal},E:${defender.character.energy.actual}/${defender.character.energy.maximal}]`;
    logger.info(`Runde #${ctx.roundNumber} (End): ${attacker_detail_end} vs ${defender_detail_end}`);

    // Regel-Registry anwenden -> verändert ctx
    this.registry.applyPhase("postRound", { combat: combatContext, round: ctx });

    //  logger.debug(ctx.log);

    return ctx;
  }
}
