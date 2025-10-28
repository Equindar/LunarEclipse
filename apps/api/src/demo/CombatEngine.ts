import { Player } from "./Player";
import { BaseAction } from "./actions/BaseAction";
import { ActionType } from "./types";
import logger from "../utils/apiLogger";

export class CombatEngine {
  public resolveRound(
    attacker: Player,
    defender: Player,
    attackerAction: BaseAction,
    defenderAction: BaseAction,
    attackerEnergyInvestment: number,
    defenderEnergyInvestment: number
  ) {
    // Berechne Tempo
    const tempoA = attackerAction.calculateTempo(attackerEnergyInvestment);
    const tempoD = defenderAction.calculateTempo(defenderEnergyInvestment);

    // Berechne Gesamtkosten und ziehe sie ab
    const attackerCost = attackerAction.totalEnergyCost(attackerEnergyInvestment);
    const defenderCost = defenderAction.totalEnergyCost(defenderEnergyInvestment);

    if (!attacker.spendEnergy(attackerCost)) {
      logger.warn(`${attacker.name} hat keine Energie für ${attackerAction.type}`);
      return;
    }

    if (!defender.spendEnergy(defenderCost)) {
      logger.warn(`${defender.name} hat keine Energie für ${defenderAction.type}`);
      return;
    }

    logger.debug(
      `Tempo: ${attacker.name} (${attackerAction.type})=${tempoA}, ${defender.name} (${defenderAction.type})=${tempoD}`
    );

    // Hauptlogik: Effektivität abhängig von Aktionstyp und Tempo
    if (attackerAction.type === ActionType.ATTACK && defenderAction.type === ActionType.DEFEND) {
      this.resolveAttackVsDefend(attacker, defender, attackerAction, defenderAction, tempoA, tempoD);
    }
    else if (attackerAction.type === ActionType.ATTACK &&
      [ActionType.UTILITY, ActionType.UTILITY_ATTACK, ActionType.UTILITY_DEFEND].includes(defenderAction.type)) {
      this.resolveAttackVsUtility(attacker, defender, attackerAction, defenderAction, tempoA, tempoD);
    }
    else {
      // Standardausführung für alle anderen Kombinationen
      // Tempo entscheidet, wer zuerst ausführt
      const firstIsAttacker = tempoA > tempoD;
      if (firstIsAttacker) {
        attackerAction.execute(attacker, defender);
        if (defender.hp > 0) defenderAction.execute(defender, attacker);
      } else {
        defenderAction.execute(defender, attacker);
        if (attacker.hp > 0) attackerAction.execute(attacker, defender);
      }
    }

    logger.info(
      `${attacker.name}[HP:${attacker.hp},E:${attacker.energy}] vs ${defender.name}[HP:${defender.hp},E:${defender.energy}]`
    );
  }

  /** -----------------------------
   * Attack vs Defend
   * ----------------------------- */
  private resolveAttackVsDefend(
    attacker: Player,
    defender: Player,
    attackAction: BaseAction,
    defendAction: BaseAction,
    tempoA: number,
    tempoD: number
  ) {
    const baseDamage = 5 + attacker.nextAttackBonus;
    const baseBlock = 5 + defender.nextDefenseBonus;

    if (tempoD >= tempoA) {
      // Verteidigung rechtzeitig → vollständiger Block
      logger.debug(`${defender.name} blockt rechtzeitig - kein Schaden.`);
    } else {
      // Verteidigung zu spät → nur 1 Schaden geblockt
      const netDamage = Math.max(0, baseDamage - 1);
      defender.takeDamage(netDamage);
      logger.debug(`${defender.name} zu spät - blockt nur 1, erleidet ${netDamage} Schaden.`);
    }

    // Buffs resetten
    attacker.resetBuffs();
    defender.resetBuffs();
  }

  /** -----------------------------
   * Attack vs Utility (inkl. Na, Nv)
   * ----------------------------- */
  private resolveAttackVsUtility(
    attacker: Player,
    defender: Player,
    attackAction: BaseAction,
    utilityAction: BaseAction,
    tempoA: number,
    tempoN: number
  ) {
    const baseDamage = 5 + attacker.nextAttackBonus;

    if (tempoN >= tempoA) {
      // Nutzen kommt rechtzeitig → Energiegewinn
      utilityAction.execute(defender, attacker);
      logger.debug(`${defender.name} war schneller - gewinnt Energie, bevor Schaden kommt.`);
    } else {
      // Nutzen zu spät → keine Wirkung, voller Schaden
      logger.debug(`${defender.name} zu spät - Nutzen wirkungslos.`);
      defender.takeDamage(baseDamage);
    }

    attacker.resetBuffs();
    defender.resetBuffs();
  }
}
