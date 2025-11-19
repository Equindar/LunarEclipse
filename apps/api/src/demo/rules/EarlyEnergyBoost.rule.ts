import logger from "../../utils/apiLogger";
import { Rule } from "../interfaces/Rule";

export const EarlyEnergyBoostRule: Rule = {
  name: "early-energy-boost",
  phase: "preCombatRound",
  priority: 11,
  matches: (ctx) => {
    if (ctx.roundContext) return ctx.roundContext.roundNumber <= 2;
    return false;
  },
  apply: (ctx) => {
    logger.debug(`"${EarlyEnergyBoostRule.name}"-Rule angewendet. Energie-Regeneration erhöht: +2.`);
    ctx.roundContext!.fighters.forEach((character) => {
      logger.debug(`${character.id} hat 2 Energie erhalten.`)
      character.energy += 2;
    });
  }
};
