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
import { ActionType } from "../demo/types/types";
import { RuleRegistry } from "../demo/RuleRegistry";
import { CriticalStrikeRule } from "../demo/rules/CriticalStrike.rule";
import { NoneAction } from "../demo/actions/None";
import { RoundContext } from "../demo/interfaces/RoundContext";
import { EarlyEnergyBoostRule } from "../demo/rules/EarlyEnergyBoost.rule";
import { VengefulComebackRule } from "../demo/rules/VengefulComeback.rule";
import { CombatContext } from "../demo/interfaces/CombatContext";

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
      const { attackerData, defenderData } = req.body;

      const attacker = new Fighter(attackerData.name, { maximal: attackerData.hp, remaining: attackerData.hp }, attackerData.energy);
      const defender = new Fighter(defenderData.name, { maximal: defenderData.hp, remaining: defenderData.hp }, defenderData.energy);

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
          attacker: attacker,
          defender: defender,
        }

        var roundContext: RoundContext = {
          roundNumber: i,
          self: {
            character: attacker,
            action: attackerAction,
            tempo: aTempoEnergy,
            impact: aImpactEnergy
          },
          target: {
            character: defender,
            action: defenderAction,
            tempo: dTempoEnergy,
            impact: dImpactEnergy
          }
        }

        roundContext = this.engine.resolveRound(combatContext, roundContext);

        log.push({
          round: i + 1,
          attacker: { hp: attacker.health.remaining, energy: attacker.energy },
          defender: { hp: defender.health.remaining, energy: defender.energy },
        });

        // Kampfende, sobald jemand 0 oder weniger HP hat
        // if (attacker.hp <= 0 || defender.hp <= 0) {
        //   break;
        // }
      }

      const winner =
        attacker.health.remaining <= 0 && defender.health.remaining <= 0
          ? "Draw"
          : attacker.health.remaining <= 0
            ? defender.name
            : defender.health.remaining <= 0
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
  private parseActions(actionStrings: string[]): { action: string; tempoEnergy: number, impactEnergy: number }[] {
    return actionStrings.map((raw) => {
      let tempoEnergy = 0, impactEnergy = 0;
      const [actionPart, energyPart] = raw.split(":");
      const action = actionPart.trim();
      if (energyPart) {
        const [tempoPart, impactPart] = energyPart.split(",");
        tempoEnergy = tempoPart ? parseInt(tempoPart.substring(1)) : 0;
        impactEnergy = impactPart ? parseInt(impactPart.substring(1)) : 0;
      }
      return { action, tempoEnergy, impactEnergy };
    });
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

