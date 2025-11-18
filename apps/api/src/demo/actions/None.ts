import { BaseAction } from "./Base";
import { ActionType } from "../types/ActionType";
import { IActionContext } from "../interfaces/ActionContext";


export class NoneAction extends BaseAction {
  /** Basiswerte */
  energyCost = 0;

  constructor() {
    super(ActionType.NONE);
  }

  resolveAsEngage(ctx: IActionContext): void {
    throw new Error("Method not implemented.");
  }
  resolveAsReaction(ctx: IActionContext): void {
    throw new Error("Method not implemented.");
  }
  resolveAsMoment(ctx: IActionContext): void {
    throw new Error("Method not implemented.");
  }
}
