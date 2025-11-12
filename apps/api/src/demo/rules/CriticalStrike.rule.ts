import logger from "../../utils/apiLogger";
import { FighterAction } from "../interfaces/FighterAction";
import { Rule } from "../interfaces/Rule";
import { ActionType } from "../types/ActionType";

export const CriticalStrikeRule: Rule = {
  name: "critical-strike",
  phase: "postAction",
  priority: 10,
  matches: (ctx) => {
    if (!ctx.action) return false;
    return ctx.action.fighter.forEach(
      item => item.action.type === ActionType.ATTACK
  },
  apply: (ctx) => {
    //  ctx.damageDealt = ctx.attackerAction.baseDamage * 2;
    ctx.action!.target.character.takeDamage((ctx.action!.self.action.baseDamage + ctx.action!.self.character.nextAttackBonus + ctx.action!.self.impact));
    logger.debug(`"${CriticalStrikeRule.name}"-Rule angewendet. Angreifer erzielt Kritischen Treffer.`);
  }
};
