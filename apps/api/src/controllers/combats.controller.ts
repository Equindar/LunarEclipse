import { Request, Response, NextFunction } from "express";
import logger from "../utils/apiLogger";
import { Database } from "../app";
import { AttackAction } from "../demo/actions/Attack";
import { DefendAction } from "../demo/actions/Defend";
import { UtilityAction } from "../demo/actions/Utility";
import { UtilityAttackAction } from "../demo/actions/UtilityAttack";
import { UtilityDefendAction } from "../demo/actions/UtilityDefend";
import { CombatEngine } from "../demo/CombatEngine";
import { Fighter } from "../demo/Fighter";
import { RuleRegistry } from "../demo/RuleRegistry";
import { CriticalStrikeRule } from "../demo/rules/CriticalStrike.rule";
import { NoneAction } from "../demo/actions/None";
import { RoundContext } from "../demo/interfaces/RoundContext";
import { EarlyEnergyBoostRule } from "../demo/rules/EarlyEnergyBoost.rule";
import { VengefulComebackRule } from "../demo/rules/VengefulComeback.rule";
import { CombatContext } from "../demo/interfaces/CombatContext";
import { ActionType } from "../demo/types/ActionType";
import { ActionPattern } from "../demo/interfaces/ActionPattern";
import { FighterAction } from "../demo/interfaces/FighterAction";
import { BaseAction } from "../demo/actions/Base";

export default class CombatsController {
  private engine: CombatEngine;
  private registry: RuleRegistry;
  public database;

  constructor(db: Database) {
    this.database = db;
    this.registry = new RuleRegistry()
    this.engine = new CombatEngine(this.registry);
  }

  public onGetCombat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const startTime = new Date(Date.now());
      const { attackerData, defenderData } = req.body;

      logger.warn(req.body);
      // Alles vorbereiten:
      // ActionPattern
      const actions: ActionPattern[] = this.parseActionPatterns(
        attackerData.actions[0].name,
        attackerData.actions[0].probability,
        attackerData.actions[0].pattern
      );

      // Fighter
      const attacker = new Fighter(
        attackerData.name,
        { maximal: attackerData.hp.maximal, actual: attackerData.hp.actual },
        { maximal: attackerData.energy.maximal, actual: attackerData.energy.actual },
        actions
      );

      logger.debug(attacker);
      logger.debug(attacker.actionPatterns![0].pattern[0]);

      return;



      // const attacker = new Fighter(attackerData.name, { maximal: attackerData.hp.maximal, actual: attackerData.hp.actual }, { maximal: attackerData.energy.maximal, actual: attackerData.energy.actual });
      // const defender = new Fighter(defenderData.name, { maximal: defenderData.hp.maximal, actual: defenderData.hp.actual }, { maximal: defenderData.energy.maximal, actual: defenderData.energy.actual });

      const attackerActions = this.parseActions(attackerData.actions[0].pattern);
      const defenderActions = this.parseActions(defenderData.actions[0].pattern);


      this.registry.register(CriticalStrikeRule);
      this.registry.register(EarlyEnergyBoostRule);
      this.registry.register(VengefulComebackRule);


      // Rundenweise Kampf
      const rounds = Math.min(attackerActions.length, defenderActions.length);
      let log: any[] = [];

      for (let i = 1; i <= rounds; i++) {
        const { action: aAction, tempoEnergy: aTempoEnergy, impactEnergy: aImpactEnergy } = attackerActions[i - 1];
        const { action: dAction, tempoEnergy: dTempoEnergy, impactEnergy: dImpactEnergy } = defenderActions[i - 1];

        const attackerAction = this.getAction(aAction);
        const defenderAction = this.getAction(dAction);

        var combatContext: CombatContext = {
          identifier: "test-identifier",
          time: {
            start: startTime
          },
          attacker: attacker,
          defender: defender,
        }

        var roundContext: RoundContext = {
          roundNumber: i,
          self: {
            character: attacker,
            action: attackerAction,
            tempo: aTempoEnergy,
            impact: aImpactEnergy,
            nextAttackBonus: 0,
            nextDefenseBonus: 0
          },
          target: {
            character: defender,
            action: defenderAction,
            tempo: dTempoEnergy,
            impact: dImpactEnergy,
            nextAttackBonus: 0,
            nextDefenseBonus: 0
          },
          plannedDamage: new Map(),
          plannedBlock: new Map(),
          plannedEnergyGain: new Map(),
          extraDamageById: new Map(),
          energyGainAddById: new Map(),
          damageMultipliersById: new Map(),
          combatContext: combatContext
        }

        roundContext = this.engine.resolveRound(combatContext, roundContext);

        log.push({
          round: i + 1,
          attacker: { hp: attacker.health.actual, energy: attacker.energy },
          defender: { hp: defender.health.actual, energy: defender.energy },
        });

        // Kampfende, sobald jemand 0 oder weniger HP hat
        if (attacker.health.actual <= 0 || defender.health.actual <= 0) {
          break;
        }
      }

      const winner =
        attacker.health.actual <= 0 && defender.health.actual <= 0
          ? "Draw"
          : attacker.health.actual <= 0
            ? defender.name
            : defender.health.actual <= 0
              ? attacker.name
              : "None";

      return res.status(200).json({
        result: "Kampf beendet",
        winner,
        finalState: { attacker, defender },
        rounds: log,
      });
    } catch (err) {
      logger.error(err);
      return res.status(500).send("Fehler im Kampf");
    }
  };



  // Pattern: A:t5,i3
  private parseActionPatterns(name: string, probability: number, actionStrings: string[]): ActionPattern[] {
    var result = new Array<ActionPattern>();
    var pattern = new Array<FighterAction>();
    logger.debug(actionStrings);
    actionStrings.map(
      (raw) => {
        let tempoEnergy = 0, impactEnergy = 0;
        const [actionPart, energyPart] = raw.split(":");
        const action = actionPart.trim();
        if (energyPart) {
          const [tempoPart, impactPart] = energyPart.split(",");
          tempoEnergy = tempoPart ? parseInt(tempoPart.substring(1)) : 0;
          impactEnergy = impactPart ? parseInt(impactPart.substring(1)) : 0;
        }
        pattern.push({
          action: this.getAction(action),
          investedTempo: tempoEnergy,
          investedImpact: impactEnergy
        });
      }
    );
    result.push(
      {
        name: name,
        probability: probability,
        pattern: pattern
      });
    return result;
  }


  private getAction(symbol: string) {
    switch (symbol) {
      case ActionType.NONE:
        return new NoneAction();
      case ActionType.ATTACK:
        return new AttackAction();
      case ActionType.DEFEND:
        return new DefendAction();
      case ActionType.UTILITY:
        return new UtilityAction();
      case ActionType.UTILITY_ATTACK:
        return new UtilityAttackAction();
      case ActionType.UTILITY_DEFEND:
        return new UtilityDefendAction();
      default:
        throw new Error("Unbekannte Aktion");
    }
  }

}

