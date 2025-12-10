import { BaseAction } from "./Base";
import { ActionType } from "../types/ActionType";
import { IActionContext } from "../interfaces/ActionContext";
import logger from "../../utils/apiLogger";

export class UtilityAction extends BaseAction {
  energyGain: number = 3;

  constructor() {
    super(ActionType.UTILITY);
  }

  resolveAsEngage(ctx: IActionContext): void {
    const actor = ctx.actor.id;

    const energy = this.energyGain + ctx.actor.action.investedImpact
    ctx.ctxRound.addPlannedEnergyGain(actor, energy);
    logger.debug(`${actor} regeneriert: erhält ${this.energyGain} + ${ctx.actor.action.investedImpact} Energie.`);
  }

  resolveAsReaction(ctx: IActionContext): void {
    this.resolveAsEngage(ctx);
  }
  resolveAsMoment(ctx: IActionContext): void {
    this.resolveAsEngage(ctx);
  }

  // // --- Attack trifft auf Utility
  // resolveAttack(params: resolveProps): void {
  //   const { self, target, other, tempoSelf, tempoOther, impactSelf, impactOther } = params;
  //   const damage = other.baseDamage + impactOther;
  //   if (tempoSelf >= tempoOther) {
  //     self.gainEnergy(this.energyGain + impactSelf);
  //     logger.debug(`${self.name} regeneriert: erhält ${this.energyGain + impactSelf} Energie.`);
  //   } else {
  //     self.gainEnergy(2);
  //     logger.debug(`${self.name} regeneriert zu spät: erhält ${2} Energie.`);
  //   }
  //   self.takeDamage(damage);
  //   logger.debug(`${target.name} greift an: ${self.name} erleidet ${damage} Schaden.`);
  //   target.resetAttackBuff();
  // }

  // // --- UtilityAction reagiert auf Utility von other.ActionType.UTILITY
  // // Utility vs Utility: Beide regenerieren Energy
  // resolveUtility(params: resolveProps): void {
  //   const { self: self, impactSelf: impactSelf } = params;
  //   const energy = this.energyGain + impactSelf;
  //   self.gainEnergy(energy);
  //   logger.debug(`${self.name} regeneriert sich (Regeneration: ${this.energyGain} + ${impactSelf}): erhält ${energy} Energie.`);
  // }

  // // --- UtilityAction reagiert auf UtilityAttack von other.ActionType.UTILITY_ATTACK
  // // Utility vs UtilityAttack: Beide regenerieren Energy, Buff wird angewendet
  // resolveUtilityAttack(params: resolveProps): void {
  //   const { self: self, impactSelf: impactSelf, target: target, impactOther: impactOther, other } = params;
  //   self.gainEnergy(this.energyGain + impactSelf);
  //   logger.debug(`${self.name} regeneriert sich (Regeneration: ${this.energyGain} + ${impactSelf}): erhält ${this.energyGain + impactSelf} Energie.`);
  //   target.gainEnergy(this.energyGain + impactOther);
  //   logger.debug(`${target.name} regeneriert sich (Regeneration: ${other.energyGain} + ${impactOther}): erhält ${other.energyGain + impactOther} Energie.`);
  //   target.applyBuff(ActionType.UTILITY_ATTACK);
  //   logger.debug(`${target.name} erhöht Angriffs-Buff (+1) auf ${target.nextAttackBonus}`);
  // }
}
