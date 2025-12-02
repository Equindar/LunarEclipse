import { Response } from "express";
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
import { NoneAction } from "../demo/actions/None";
import { ActionType } from "../demo/types/ActionType";
import { ActionPattern } from "../demo/interfaces/ActionPattern";
import { FighterAction } from "../demo/interfaces/FighterAction";
import { CombatContext } from "../demo/contexts/CombatContext";
import { ulid } from "ulid";


interface TypedRequestBody extends Express.Request {
  body: {
    limit?: number,
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
    res: Response) => {
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
            { nextAttack: 0, nextDefense: 0 },
            this.parseActionPatterns(item.actions)
          ));
        }
      }

      const ctx = new CombatContext(ulid(), startTime, new RuleRegistry());
      ctx.fighters = combatFighters;

      const engine = new CombatEngine(ctx)
      logger.error(ctx.identifier);

      engine.initCombat();
      const limit = req.body.limit ?? 3;
      for (let i = 0; i < limit; i++) {
        engine.resolveCombatRound();
        if (engine.isCombatOver()) {
          logger.error("Kampf vorbei, YAY!");
          let temp: { name: string, hp: number, energy: number }[] = [];
          engine.combatContext.fighters.forEach(item => {
            temp.push({
              name: item.name,
              hp: item.health.actual,
              energy: item.energy.actual
            });
          });
          logger.info(engine.combatContext.log);
          return res.status(200).json(
            {
              "status": "ended",
              "data": temp
            }
          );
        }
      }


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

