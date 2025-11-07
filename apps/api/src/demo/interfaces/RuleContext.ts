import { ActionContext } from "./ActionContext";
import { CombatContext } from "./CombatContext";
import { RoundContext } from "./RoundContext";

/** RuleContext
 *
 */
export default interface RuleContext {
  /** CombatContext (readonly Reference)
   *
   * wird benötigt für Regeln auf Umwelt
  */
  readonly combat: CombatContext;
  /** RoundContext
   * wird benötigt, um Werte im Context anzupassen
   */
  round: RoundContext;
  /** ActionContext (optional)
   * wird für Regeln mit Phase preAction/postAction benötigt
   * * Beispiel: CriticalStrike
   */
  action?: ActionContext;
}
