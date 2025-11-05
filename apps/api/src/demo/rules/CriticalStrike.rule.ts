import logger from "../../utils/apiLogger";
import { CombatContext } from "../interfaces/CombatContext";
import { RoundContext } from "../interfaces/RoundContext";
import { Rule } from "../interfaces/Rule";
import { ActionType } from "../types/types";

export const CriticalStrikeRule: Rule = {
  name: "critical-strike",
  priority: 10,
  matches: (ctx: RoundContext) => {
    return ctx.self.action.type === ActionType.ATTACK &&
      ctx.self.tempo >= ctx.target.tempo + 5;
  },
  apply: (ctx: RoundContext) => {
    //  ctx.damageDealt = ctx.attackerAction.baseDamage * 2;
    ctx.target.character.takeDamage((ctx.self.action.baseDamage + ctx.self.character.nextAttackBonus + ctx.self.impact));
    logger.debug(`"${CriticalStrikeRule.name}"-Rule angewendet. Angreifer erzielt Kritischen Treffer.`);
  }
};
