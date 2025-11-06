import logger from "../../utils/apiLogger";
import { Fighter } from "../Fighter";
import { RoundContext } from "../interfaces/RoundContext";
import { Rule } from "../interfaces/RuleContext";
import { ActionType } from "../types/types";

export const VengefulComebackRule: Rule = {
  name: "vengeful-comeback",
  phase: "postRound",
  priority: 100,
  matches: (ctx) => {
    return (
      ctx.round.self.character.health.remaining <= 0 && ctx.round.self.character.name == "Maro") ||
      (ctx.round.target.character.health.remaining <= 0 && ctx.round.target.character.name == "Maro");
  },
  apply: (ctx) => {
    var subject: Fighter = ctx.round.self.character.health.remaining <= 0 ? ctx.round.self.character : ctx.round.target.character;
    subject.health.remaining += 20;
    subject.applyBuff(ActionType.UTILITY_ATTACK);
    subject.applyBuff(ActionType.UTILITY_ATTACK);
    logger.debug(`"${VengefulComebackRule.name}"-Rule angewendet. ${subject.name} erhält 20 HP, verstärkt seinen Angriff um +2.`);
  }
};
