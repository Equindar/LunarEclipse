import logger from "../../utils/apiLogger";
import { Rule } from "../interfaces/Rule";

export const EarlyEnergyBoostRule: Rule = {
  name: "early-energy-boost",
  phase: "preCombatRound",
  priority: 11,
  matches: (ctx) => {
    if (ctx.round) return ctx.round.roundNumber <= 2;
    return false;
  },
  apply: (ctx) => {
    logger.debug(`"${EarlyEnergyBoostRule.name}"-Rule angewendet. Energie-Regeneration erhöht: +2.`);
    ctx.round!.fighters.forEach((character) => {
      character.gainEnergy(2)
      logger.debug(`${character.id} hat 2 Energie erhalten.`)
    });
  }
};
