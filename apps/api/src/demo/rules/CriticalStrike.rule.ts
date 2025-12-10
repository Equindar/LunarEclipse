import logger from "../../utils/apiLogger";
import { Rule } from "../interfaces/Rule";
import { ActionType } from "../types/ActionType";

export const CriticalStrikeRule: Rule = {
  name: "critical-strike",
  phase: "postAction",
  priority: 10,
  matches: (ctx) => {
    if (!ctx.actionContext) return false;
    return ctx.actionContext.actor.action.investedTempo >= 5 && ctx.actionContext.actor.action.action.type === ActionType.ATTACK;
  },
  apply: (ctx) => {
    //  ctx.damageDealt = ctx.attackerAction.baseDamage * 2;
    // ctx.action!.ctxRound.fighters.get(ctx.action?.targets[0].id)?.health = ((ctx.action!.self.action.baseDamage + ctx.action!.self.character.nextAttackBonus + ctx.action!.self.impact));
    logger.debug(`"${CriticalStrikeRule.name}"-Rule angewendet. Angreifer erzielt Kritischen Treffer.`);
  }
};
