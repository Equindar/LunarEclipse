// domain/CombatEngine.ts
import { Player } from "./Player";
import { BaseAction } from "./actions/Base";
import logger from "../utils/apiLogger";

export class CombatEngine {
  public resolveRound(
    attacker: Player,
    defender: Player,
    attackerAction: BaseAction,
    defenderAction: BaseAction,
    aTempoEnergy: number,
    aImpactEnergy: number,
    dTempoEnergy: number,
    dImpactEnergy: number
  ) {
    const tempoA = attackerAction.calculateTempo(aTempoEnergy);
    const tempoD = defenderAction.calculateTempo(dTempoEnergy);

    const impactA = attackerAction.calculateImpact(aImpactEnergy);
    const impactD = defenderAction.calculateImpact(dImpactEnergy);

    // Energie abziehen
    attacker.spendEnergy(attackerAction.totalEnergyCost(aTempoEnergy + aImpactEnergy));
    defender.spendEnergy(defenderAction.totalEnergyCost(dTempoEnergy + dImpactEnergy));

    logger.debug(`Runde: ${attacker.name}[${attackerAction.type}:t${tempoA},i${impactA}] vs ${defender.name}[${defenderAction.type}:t${tempoD},i${impactD}]`);

    // Einfacher Aufruf, alles andere passiert innerhalb der Aktionen
    attackerAction.resolveAgainst(attacker, defender, defenderAction, tempoA, tempoD, impactA, impactD);

    // Logging
    logger.info(`${attacker.name}[HP:${attacker.hp},E:${attacker.energy}] vs ${defender.name}[HP:${defender.hp},E:${defender.energy}]`);
  }
}
