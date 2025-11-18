import { IActionContext } from "./ActionContext";
import { ICombatContext } from "./CombatContext";
import { IRoundContext } from "./RoundContext";

/** RuleContext
 *
 */
export default interface RuleContext {
  /** CombatContext (readonly Reference)
   *
   * wird benötigt für Regeln auf Umwelt
  */
  combat: ICombatContext;
  /** RoundContext
   * wird benötigt, um Werte im Context anzupassen
   */
  round?: IRoundContext;
  /** ActionContext (optional)
   * wird für Regeln mit Phase preAction/postAction benötigt
   * * Beispiel: CriticalStrike
   */
  action?: IActionContext;
}
