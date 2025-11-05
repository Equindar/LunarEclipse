import { BaseAction, resolveProps } from "./Base";
import { ActionType } from "../types/types";
import logger from "../../utils/apiLogger";

export class NoneAction extends BaseAction {
  /** Basiswerte */
  energyCost = 0;

  constructor() {
    super(ActionType.NONE);
  }

  resolveAgainst(params: resolveProps): void {
    logger.debug(`${params.self.name} macht nichts.`);
  }
}
