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
  combatContext: ICombatContext;
  /** RoundContext
   * wird benötigt, um Werte im Context anzupassen
   */
  roundContext?: IRoundContext;
  /** ActionContext (optional)
   * wird für Regeln mit Phase preAction/postAction benötigt
   * * Beispiel: CriticalStrike
   */
  actionContext?: IActionContext;
}
