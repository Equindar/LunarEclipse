import logger from "../../utils/apiLogger";
import { Fighter } from "../Fighter";
import { Rule } from "../interfaces/Rule";
import { ActionType } from "../types/ActionType";

/** VengefulComebackRule
 * Wenn der Charakter unter 0 aktuelles Leben fällt:
 * * - wird er mit 20 HP wiederbelebt
 * * - erhält +2 Schaden für den nächsten Angriff
 */
export const VengefulComebackRule: Rule = {
  name: "vengeful-comeback",
  phase: "postRound",
  priority: 100,
  matches: (ctx) => {
    return (
      ctx.round.self.character.health.actual <= 0 && ctx.round.self.character.name == "Maro") ||
      (ctx.round.target.character.health.actual <= 0 && ctx.round.target.character.name == "Maro");
  },
  apply: (ctx) => {
    var subject: Fighter = ctx.round.self.character.health.actual <= 0 ? ctx.round.self.character : ctx.round.target.character;
    subject.health.actual += 20;
    // subject.applyBuff(ActionType.UTILITY_ATTACK);
    // subject.applyBuff(ActionType.UTILITY_ATTACK);
    logger.debug(`"${VengefulComebackRule.name}"-Rule angewendet. ${subject.name} erhält 20 HP, verstärkt seinen Angriff um +2.`);
  }
};
