import logger from "../../utils/apiLogger";
import { Rule } from "../interfaces/RuleContext";
import { ActionType } from "../types/ActionType";

export const CriticalStrikeRule: Rule = {
  name: "critical-strike",
  phase: "preAction",
  priority: 10,
  matches: (ctx) => {
    if (!ctx.action) return false;
    return ctx.action.self.action.type === ActionType.ATTACK &&
      ctx.action.self.tempo >= ctx.action.target.tempo + 5;
  },
  apply: (ctx) => {
    //  ctx.damageDealt = ctx.attackerAction.baseDamage * 2;
    ctx.action!.target.character.takeDamage((ctx.action!.self.action.baseDamage + ctx.action!.self.character.nextAttackBonus + ctx.action!.self.impact));
    logger.debug(`"${CriticalStrikeRule.name}"-Rule angewendet. Angreifer erzielt Kritischen Treffer.`);
  }
};
