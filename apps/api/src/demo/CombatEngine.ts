import { Fighter } from "./Fighter";
import { BaseAction, resolveProps, swapResolveProps } from "./actions/Base";
import logger from "../utils/apiLogger";
import { RuleRegistry } from "./RuleRegistry";
import { RoundContext } from "./interfaces/RoundContext";
import { CombatContext } from "./interfaces/CombatContext";

export class CombatEngine {
  /** Rundenlänge in Millisekunden */
  roundLengthInMs: number = 10000;

  constructor(private registry: RuleRegistry) { }

  public calculateActionOrder(
    attacker: Fighter,
    defender: Fighter,
    attackerAction: BaseAction,
    defenderAction: BaseAction,
    aTempoEnergy: number,
    dTempoEnergy: number,
  ) {

  }

  public resolveRound(combatContext: CombatContext, ctx: RoundContext): RoundContext {
    var attacker = ctx.self;
    var defender = ctx.target;

    this.registry.applyPhase("preRound", { combat: combatContext, round: ctx });

    logger.info(`Runde #${ctx.roundNumber} (Start): ${attacker.character.name}[HP:${attacker.character.health.remaining},E:${attacker.character.energy}] vs ${defender.character.name}[HP:${defender.character.health.remaining},E:${defender.character.energy}]`);
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


    // Regel-Registry anwenden -> verändert ctx
    this.registry.applyPhase("postRound", { combat: combatContext, round: ctx });

    logger.info(`Runde #${ctx.roundNumber} (End): ${attacker.character.name}[HP:${attacker.character.health.remaining},E:${attacker.character.energy}] vs ${defender.character.name}[HP:${defender.character.health.remaining},E:${defender.character.energy}]`);
    //  logger.debug(ctx.log);

    return ctx;
  }
}
