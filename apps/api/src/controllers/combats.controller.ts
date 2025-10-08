import { NextFunction, Request, Response } from 'express';
import { Database } from '../app';
import logger from '../utils/apiLogger';


export default class CombatsController {
  public database;

  constructor(db: Database) {
    this.database = db;
  }

  // UseCase in Feature/application
  public onGetCombat = async (req: Request, res: Response, next: NextFunction) => {
    logger.http(req.body);
    const attacker = req.body.attacker;
    const defender = req.body.defender;
    const combat = req.body.combat;


    this.compare_actions(attacker, defender, combat);
    return res.status(200).send("Kämpfe...");

  };

  public compare_actions(attacker: any, defender: any, combat: any): void {
    const attacker_actions = attacker.attacks;
    const defenders_actions = defender.attacks;
    const damage = parseInt(combat.attack);
    const block = parseInt(combat.defense);
    const utility = parseInt(combat.utility);
    const cost = parseInt(combat.action_cost);



    if (attacker_actions.length != defenders_actions.length) {
      throw new Error("Angriffsmuster sind nicht gleich lang");
    }
    for (var i = 0; i < attacker_actions.length; i++) {
      const action = attacker_actions[i].toLowerCase();
      const reaction = defenders_actions[i].toLowerCase();
      logger.debug(`Vergleiche: ${action} > ${reaction}`);

      // Action A
      if (action == "a") {
        attacker.energy -= cost;
        if (reaction == "a") {
          defender.hp -= damage;
          defender.energy -= cost;
          attacker.hp -= damage;
        }
        if (reaction == "v") {
          defender.hp -= (damage - block);
          defender.energy -= cost;
        }
        if (reaction == "n") {
          defender.hp -= damage;
        }
      } else {
        // Action V
        if (action == "v") {
          attacker.energy -= cost;
          if (reaction == "a") {
            defender.energy -= cost;
            attacker.hp -= (damage - block);
          }
          if (reaction == "v") {
            defender.energy -= cost;
          }
          if (reaction == "n") {
            defender.energy += utility;
          }
        } else {
          // Action N
          if (action == "n") {

            if (reaction == "a") {
              defender.energy -= cost;
              attacker.hp -= damage;
            }
            if (reaction == "v") {
              defender.energy -= cost;
              attacker.energy += utility;
            }
            if (reaction == "n") {
              defender.energy += utility;
              attacker.energy += utility;
            }
          }
        }
      }
      logger.info(`${attacker.name} [HP: ${attacker.hp}, E: ${attacker.energy}] --- vs --- ${defender.name} [HP: ${defender.hp}, E: ${defender.energy}]`);
    }
    return;
  }
}
