import RuleContext from "./RuleContext";

/** RulePhase(s)
 * * preRound — vor Aktionswahl / Setup (z. B. Runde 1 Boni).
 * * preGroup — vor Auflösung einer Tempo-Gruppe.
 * * preAction — unmittelbar bevor eine einzelne Aktion resolved (Engage/React/Moment).
 * * postAction — direkt nach einer Aktion (z. B. apply DoT).
 * * postGroup — nach einer Tempo-Gruppenauflösung (commit group planned effects).
 * * postRound — nach kompletter Round, vor Commit to GameState. */
export type RulePhase =
  "preCombat" | "preCombatRound" | "preActionRound" | "preGroup" | "preAction" |
  "postAction" | "postGroup" | "postActionRound" | "postCombatRound" | "postCombat";

export interface Rule {
  /** Name der Regel */
  name?: string;
  /** Phase, in der die Regel angewendet wird */
  phase: RulePhase;
  /** Reihenfolge in der Logik */
  priority?: number; // größer → früher
  /** Flag zum Stoppen der weiteren Regelüberprüfungen */
  stopPropagation?: boolean;

  /** Auslöse-Kriterien der Regel */
  matches(ctx: RuleContext): boolean;
  /** Wirkung der Regel
   * - modifiziert CombatContext (ctx)
   */
  apply(ctx: RuleContext): void;
}
