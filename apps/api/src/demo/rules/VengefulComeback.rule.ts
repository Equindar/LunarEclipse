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
      return (ctx.round.fighters.has("Maro") && (ctx.round.fighters.get("Maro")?.hp! <= 0))
    return false;
  },
  apply: (ctx) => {
    logger.debug(`"${VengefulComebackRule.name}"-Rule angewendet. "Maro erhält 20 HP, verstärkt seinen Angriff um +2.`);
    ctx.round!.fighters.get("Maro")?.gainHealth(20);
    ctx.round!.fighters.get("Maro")?.applyBuff(ActionType.UTILITY_ATTACK);
    ctx.round!.fighters.get("Maro")?.applyBuff(ActionType.UTILITY_ATTACK);
  }
};
