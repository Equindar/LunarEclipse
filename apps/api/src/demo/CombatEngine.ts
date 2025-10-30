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

    // Energie abziehen
    attacker.spendEnergy(attackerAction.totalEnergyCost(aTempoEnergy + aImpactEnergy));
    defender.spendEnergy(defenderAction.totalEnergyCost(dTempoEnergy + dImpactEnergy));

    logger.info(`${attacker.name}[HP:${attacker.hp},E:${attacker.energy}] vs ${defender.name}[HP:${defender.hp},E:${defender.energy}]`);
    logger.debug(`Runde: ${attacker.name}[${attackerAction.type}:t${aTempoEnergy},i${aImpactEnergy}] vs ${defender.name}[${defenderAction.type}:t${dTempoEnergy},i${dImpactEnergy}]`);

    // Einfacher Aufruf, alles andere passiert innerhalb der Aktionen
    attackerAction.resolveAgainst(
      {
        self: attacker,
        target: defender,
        other: defenderAction,
        tempoSelf: attackerAction.calculateTempo(aTempoEnergy),
        tempoOther: defenderAction.calculateTempo(dTempoEnergy),
        impactSelf: attackerAction.calculateImpact(aImpactEnergy),
        impactOther: defenderAction.calculateImpact(dImpactEnergy)
      });
  }
}
