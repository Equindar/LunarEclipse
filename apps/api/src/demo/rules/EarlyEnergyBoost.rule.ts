import logger from "../../utils/apiLogger";
import { RoundContext } from "../interfaces/RoundContext";
import { Rule } from "../interfaces/Rule";

export const EarlyEnergyBoostRule: Rule = {
  name: "early-energy-boost",
  priority: 11,
  matches: (ctx: RoundContext) => {
    return ctx.roundNumber <= 2;
  },
  apply: (ctx: RoundContext) => {
    ctx.self.character.gainEnergy(2);
    ctx.target.character.gainEnergy(2);
    logger.debug(`"${EarlyEnergyBoostRule.name}"-Rule angewendet. Energie-Regeneration erhöht: +2.`);
  }
};
