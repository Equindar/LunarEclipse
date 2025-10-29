import { Request, Response, NextFunction } from "express";
import logger from "../utils/apiLogger";
import { Database } from "../app";
import { AttackAction } from "../demo/actions/Attack";
import { DefendAction } from "../demo/actions/Defend";
import { UtilityAction } from "../demo/actions/Utility";
import { UtilityAttackAction } from "../demo/actions/UtilityAttack";
import { UtilityDefendAction } from "../demo/actions/UtilityDefend";
import { CombatEngine } from "../demo/CombatEngine";
import { Player } from "../demo/Player";
import { ActionType } from "../demo/types";

export default class CombatsController {
  private engine: CombatEngine;
  public database;

  constructor(db: Database) {
    this.database = db;
    this.engine = new CombatEngine();
  }

  public onGetCombat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { attackerData, defenderData } = req.body;

      const attacker = new Player(attackerData.name, attackerData.hp, attackerData.energy);
      const defender = new Player(defenderData.name, defenderData.hp, defenderData.energy);

      const attackerActions = this.parseActions(attackerData.actions);
      const defenderActions = this.parseActions(defenderData.actions);

      const engine = this.engine;

      // Rundenweise Kampf
      const rounds = Math.min(attackerActions.length, defenderActions.length);
      let log: any[] = [];

      for (let i = 0; i < rounds; i++) {
        const { action: aAction, tempoEnergy: aTempoEnergy, impactEnergy: aImpactEnergy } = attackerActions[i];
        const { action: dAction, tempoEnergy: dTempoEnergy, impactEnergy: dImpactEnergy } = defenderActions[i];

        const attackerAction = this.getAction(aAction);
        const defenderAction = this.getAction(dAction);

        engine.resolveRound(
          attacker,
          defender,
          attackerAction,
          defenderAction,
          aTempoEnergy,
          aImpactEnergy,
          dTempoEnergy,
          dImpactEnergy
        );

        log.push({
          round: i + 1,
          attacker: { hp: attacker.hp, energy: attacker.energy },
          defender: { hp: defender.hp, energy: defender.energy },
        });

        // Kampfende, sobald jemand 0 oder weniger HP hat
        if (attacker.hp <= 0 || defender.hp <= 0) {
          break;
        }
      }

      const winner =
        attacker.hp <= 0 && defender.hp <= 0
          ? "Draw"
          : attacker.hp <= 0
            ? defender.name
            : defender.hp <= 0
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

