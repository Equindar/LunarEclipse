import logger from "../../utils/apiLogger";
import { Rule } from "../interfaces/RuleContext";

export const EarlyEnergyBoostRule: Rule = {
  name: "early-energy-boost",
  phase: "preRound",
  priority: 11,
  matches: (ctx) => {
    return ctx.round.roundNumber <= 2;
  },
  apply: (ctx) => {
    ctx.round.self.character.gainEnergy(2);
    ctx.round.target.character.gainEnergy(2);
    logger.debug(`"${EarlyEnergyBoostRule.name}"-Rule angewendet. Energie-Regeneration erhöht: +2.`);
  }
};
