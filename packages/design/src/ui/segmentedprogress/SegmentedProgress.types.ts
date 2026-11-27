import type { Children } from "../../types/Children";
import type { ProgressFormatArgs, ProgressMeasureArgs } from "../../utils/progressValue";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Form der Segmente: abgerundet oder nach rechts geneigtes Parallelogramm */
export type SegmentedProgressShape = "rounded" | "slanted";

/**
 * Platzhalter für offene Skalen (ohne sinnvolles Maximum). Jedes Segment steht dann für genau einen
 * Punkt (Wert minus `min`): Die ersten `head` Punkte stehen vorn, die letzten `tail` Punkte hinten, und
 * dazwischen steht ein Ellipsis-Element, sobald mehr Punkte vorhanden sind als Segmente (head + tail).
 */
export interface SegmentedProgressEllipsisArgs {
  /** Segmente vor dem Platzhalter, ganzzahlig von 1 bis 99 (Standard: 5) */
  head?: number;
  /** Segmente nach dem Platzhalter, ganzzahlig von 1 bis 99, head + tail höchstens 100 (Standard: 3) */
  tail?: number;
  /** Beschriftung (title) des Platzhalters; `{count}` steht für die ausgeblendeten Punkte (Standard: "{count} more") */
  label?: string;
}

export interface SegmentedProgressSegmentsArgs {
  /** Anzahl gleich breiter Segmente, ganzzahlig von 1 bis 100 (Standard: 10) */
  segments?: number;
  /** Form der Segmente (Standard: "rounded") */
  shape?: SegmentedProgressShape;
  /**
   * Zeigt Anfang und Ende der Skala mit einem Ellipsis-Element dazwischen. `true` nutzt die Standardwerte.
   * Mit `ellipsis` ist `segments` ohne Wirkung (die Anzahl ist head + tail). Für offene Skalen sollte
   * `max` groß gewählt werden, damit Wert und ARIA-Werte nicht begrenzt werden.
   */
  ellipsis?: boolean | SegmentedProgressEllipsisArgs;
  /**
   * Nur mit `ellipsis`: Punkte bis zu diesem Wert gelten als bestehend, Segmente für Punkte darüber
   * bekommen `data-new` und werden heller (Dark Mode) bzw. dunkler (Light Mode) dargestellt.
   * Ohne Angabe wird nichts hervorgehoben.
   */
  baseline?: number;
}

export interface SegmentedProgressArgs
  extends ProgressMeasureArgs,
    ProgressFormatArgs,
    SegmentedProgressSegmentsArgs {
  /** ID des Elements. Mit `hasLabel` wird aria-labelledby auf `<id>-label` gesetzt */
  id?: string;
  /**
   * Setzt aria-labelledby auf `<id>-label`. Erfordert `id` und ein `ProgressLabel` (aus ui/progress)
   * mit derselben `id`. Ohne Label sollte `attributes: { "aria-label": "..." }` gesetzt werden.
   */
  hasLabel?: boolean;
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
  /** Inhalt vor den Segmenten, z. B. ProgressLabel und ProgressValue */
  children?: Children;
}

export interface SegmentedProgressTrackArgs extends ProgressMeasureArgs, SegmentedProgressSegmentsArgs {
  class?: string;
  attributes?: HtmlAttributes;
}

export interface SegmentedProgressSegmentArgs extends ProgressMeasureArgs {
  /** Position des Segments (ab 0) */
  index: number;
  /** Gesamtzahl der Segmente */
  count: number;
  shape?: SegmentedProgressShape;
  /** Jedes Segment steht für genau einen Punkt (Wert minus `min`), Füllung ab `index` (für `ellipsis`) */
  unit?: boolean;
  /** Setzt `data-new` statisch (für `unit`) */
  isNew?: boolean;
  /** Datastar-Ausdruck für `data-new` (für `unit`, wenn der Punkt vom Wert abhängt) */
  isNewExpression?: string;
  class?: string;
  /** Hinweis: `style` des inneren Indicators wird vom Segment selbst gesetzt */
  attributes?: HtmlAttributes;
}
