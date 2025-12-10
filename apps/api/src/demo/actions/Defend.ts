import { BaseAction } from "./Base";
import { ActionType } from "../types/ActionType";
import { IActionContext } from "../interfaces/ActionContext";
import logger from "../../utils/apiLogger";
import { formatDuration } from "../utils/time";

export class DefendAction extends BaseAction {
  constructor() {
    super(ActionType.DEFEND);
  }

  resolveAsEngage(ctx: IActionContext): void {
    const actor = ctx.actor.id;
    const state = ctx.ctxRound.fighters.get(actor)!;
    const execution = ctx.ctxCombat.time.elapsed + (1000 - (ctx.actor.action.investedTempo * 100));

    const block = this.baseBlock + ctx.actor.action.investedImpact + ctx.actor.state.nextDefenseBonus
    ctx.ctxRound.addPlannedBlock(actor, block);
    logger.debug(`[${formatDuration(execution)}] ${actor} blockt: erhält ${this.baseBlock} + ${ctx.actor.action.investedImpact} + ${ctx.actor.state.nextDefenseBonus} Schild.`);
    state.resetDefenseBuff();

  }

  resolveAsReaction(ctx: IActionContext): void {
    const actor = ctx.actor.id;
    const state = ctx.ctxRound.fighters.get(actor)!;
    const execution = ctx.ctxCombat.time.elapsed + (1000 - (ctx.actor.action.investedTempo * 100));

    const block = 1 + ctx.actor.action.investedImpact + ctx.actor.state.nextDefenseBonus
    ctx.ctxRound.addPlannedBlock(actor, block);
    logger.debug(`[${formatDuration(execution)}] ${actor} blockt (verspätet): erhält ${1} + ${ctx.actor.action.investedImpact} + ${ctx.actor.state.nextDefenseBonus} Schild.`);
    state.resetDefenseBuff();
  }

  resolveAsMoment(ctx: IActionContext): void {
    this.resolveAsEngage(ctx);
  }

  // // --- DefendAction reagiert auf Attack von other.ActionType.ATTACK
  // // Attack vs Attack: Ziel erleidet Schaden (+ Impact)
  // // --- Attack trifft auf Defend
  // // Defender erleidet anteilig Schaden (+ Impact)
  // resolveAttack(params: resolveProps): void {
  //   const { self, target, other, tempoSelf, tempoOther, impactSelf, impactOther } = params;
  //   const damage = other.baseDamage + impactOther;
  //   const block = this.baseBlock + impactSelf + self.nextDefenseBonus;
  //   if (tempoSelf >= tempoOther) {
  //     const netDamage = Math.max(0, damage - block);
  //     self.takeDamage(netDamage);
  //     logger.debug(`${self.name} verteidigt sich (Block: ${this.baseBlock} + ${impactSelf} + ${self.nextDefenseBonus}): erleidet ${netDamage} Schaden.`);
  //   }
  //   else {
  //     const netDamage = Math.max(0, damage - 1 + impactSelf + self.nextDefenseBonus);
  //     self.takeDamage(netDamage);
  //     logger.debug(`${self.name} verteidigt sich (Block: ${1} + ${impactSelf} + ${self.nextDefenseBonus}): erleidet ${netDamage} Schaden. (zu spät)`);
  //   }
  //   self.resetDefenseBuff();
  // }

  // resolveDefend(params: resolveProps): void {
  //   const { self: self, impactSelf: impactSelf } = params;
  //   logger.debug(`${self.name} verteidigt sich (Block: ${this.baseBlock} + ${impactSelf} + ${self.nextDefenseBonus})`);
  // }
}
