import { Request, Response, NextFunction } from "express";
import logger from "../utils/apiLogger";
import { Database } from "../app";
import { AttackAction } from "../demo/actions/Attack";
import { DefendAction } from "../demo/actions/Defend";
import { UtilityAction } from "../demo/actions/Utility";
import { UtilityAttackAction } from "../demo/actions/UtilityAttack";
import { UtilityDefendAction } from "../demo/actions/UtilityDefend";
import { CombatEngine } from "../demo/CombatEngine";
import { Fighter, FighterId } from "../demo/Fighter";
import { RuleRegistry } from "../demo/RuleRegistry";
import { CriticalStrikeRule } from "../demo/rules/CriticalStrike.rule";
import { NoneAction } from "../demo/actions/None";
import { EarlyEnergyBoostRule } from "../demo/rules/EarlyEnergyBoost.rule";
import { VengefulComebackRule } from "../demo/rules/VengefulComeback.rule";
import { ActionType } from "../demo/types/ActionType";
import { ActionPattern } from "../demo/interfaces/ActionPattern";
import { FighterAction } from "../demo/interfaces/FighterAction";
import { BaseAction } from "../demo/actions/Base";
import { CombatContext } from "../demo/contexts/CombatContext";


interface TypedRequestBody extends Express.Request {
  body: {
    fighters: {
      name: string;
      energy: {
        maximal: number;
        actual: number;
      };
      health: {
        maximal: number;
        actual: number;
      };
      actions: {
        name: string;
        probability: number;
        pattern: string[];
      }[]
    }[];
  }
}


export default class CombatsController {
  public database;

  constructor(db: Database) {
    this.database = db;
  }

  public onGetCombat = async (
    req: TypedRequestBody,
    res: Response,
    next: NextFunction) => {
    try {
      const startTime = new Date(Date.now());
      const { fighters } = req.body;

      var combatFighters = new Map<FighterId, Fighter>();

      // Fighter (Attacker)
      if (fighters !== null) {
        for (var item of fighters) {
          combatFighters.set(item.name, new Fighter(
            item.name,
            { maximal: item.health.maximal, actual: item.health.actual },
            { maximal: item.energy.maximal, actual: item.energy.actual },
            this.parseActionPatterns(item.actions)
          ));
        }
      }

      const ctx = new CombatContext("Test12345", startTime, new RuleRegistry());
      ctx.fighters = combatFighters;

      const engine = new CombatEngine(ctx)

      engine.initCombat();

      for (let i = 0; i < 2; i++) {
        engine.resolveCombatRound();

      }

      //   log.push({
      //     round: i + 1,
      //     attacker: { hp: attacker.health.actual, energy: attacker.energy },
      //     defender: { hp: defender.health.actual, energy: defender.energy },
      //   });

      //   // Kampfende, sobald jemand 0 oder weniger HP hat
      //   if (attacker.health.actual <= 0 || defender.health.actual <= 0) {
      //     break;
      //   }
      // }

      // const winner =
      //   attacker.health.actual <= 0 && defender.health.actual <= 0
      //     ? "Draw"
      //     : attacker.health.actual <= 0
      //       ? defender.name
      //       : defender.health.actual <= 0
      //         ? attacker.name
      //         : "None";

      // return res.status(200).json({
      //   result: "Kampf beendet",
      //   winner,
      //   finalState: { attacker, defender },
      //   rounds: log,
      // });
      return res.sendStatus(200);
    } catch (err) {
      logger.error(err);
      return res.status(500).send("Fehler im Kampf");
    }
  };



  // Pattern: A:t5,i3
  private parseActionPatterns(actions: Array<{ name: string, probability: number, pattern: string[] }>): ActionPattern[] {
    var result = new Array<ActionPattern>();

    if (!actions || actions.length === 0) {
      logger.warn("parseActionPatterns: no actions provided");
      return result;
    }

    actions.forEach(action => {
      const temp: FighterAction[] = []

      if (!action.pattern || action.pattern.length === 0) {
        result.push({ name: action.name, probability: action.probability, pattern: temp });
        return;
      }

      action.pattern.forEach(item => {
        if (!item) return;
        let tempoEnergy = 0, impactEnergy = 0;
        const [actionPart, energyPart] = item.split(":");
        if (energyPart) {
          const [tempoPart, impactPart] = energyPart.split(",");
          tempoEnergy = tempoPart ? parseInt(tempoPart.substring(1)) : 0;
          impactEnergy = impactPart ? parseInt(impactPart.substring(1)) : 0;
        }
        temp.push({
          action: this.getAction(actionPart.trim()),
          investedTempo: tempoEnergy,
          investedImpact: impactEnergy
        });
      });
      result.push({ name: action.name, probability: action.probability, pattern: temp });
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

