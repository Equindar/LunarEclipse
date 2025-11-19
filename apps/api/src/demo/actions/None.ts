import { BaseAction } from "./Base";
import { ActionType } from "../types/ActionType";
import { IActionContext } from "../interfaces/ActionContext";
import logger from "../../utils/apiLogger";


export class NoneAction extends BaseAction {
  /** Basiswerte */
  energyCost = 0;

  constructor() {
    super(ActionType.NONE);
  }

  resolveAsEngage(ctx: IActionContext): void {
    logger.error("NoneAction.resolveAsEngage()");
    throw new Error("Method not implemented.");
  }
  resolveAsReaction(ctx: IActionContext): void {
    logger.error("NoneAction.resolveAsReaction()");
    throw new Error("Method not implemented.");
  }
  resolveAsMoment(ctx: IActionContext): void {
    logger.error("NoneAction.resolveAsMoment()");
    throw new Error("Method not implemented.");
  }
}
