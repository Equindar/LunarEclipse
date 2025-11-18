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
  phase: "postActionRound",
  priority: 100,
  matches: (ctx) => {
    if (ctx.round)
      return (ctx.round.fighters.has("Maro") && (ctx.round.fighters.get("Maro")?.health! <= 0))
    return false;
  },
  apply: (ctx) => {
    const subject = ctx.round!.fighters.get("Maro");
    if (subject) {
      logger.debug(`"${VengefulComebackRule.name}"-Rule angewendet. "Maro erhält 20 HP, verstärkt seinen Angriff um +2.`);
      subject.health += 20;
      subject.nextAttackBonus ? subject.nextAttackBonus += 2 : 2;
    }
  }
};
