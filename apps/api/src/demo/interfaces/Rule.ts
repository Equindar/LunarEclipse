import { RoundContext } from "./RoundContext";

export interface Rule {

  /** Name der Regel */
  name?: string;
  /** Reihenfolge in der Logik */
  priority?: number; // größer → früher
  /** Auslöse-Kriterien der Regel */
  matches(ctx: RoundContext): boolean;
  /** Wirkung der Regel
   * - modifiziert CombatContext (ctx)
   */
  apply(ctx: RoundContext): void;

  /** Flag zum Stoppen der weiteren Regelüberprüfungen */
  stopPropagation?: boolean;

}
