import type { Children } from "../../types/Children";
import type { ProgressFormatArgs, ProgressMeasureArgs } from "../../utils/progressValue";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Form der Segmente: abgerundet oder nach rechts geneigtes Parallelogramm */
export type SegmentedProgressShape = "rounded" | "slanted";

export interface SegmentedProgressSegmentsArgs {
  /** Anzahl gleich breiter Segmente, ganzzahlig von 1 bis 100 (Standard: 10) */
  segments?: number;
  /** Form der Segmente (Standard: "rounded") */
  shape?: SegmentedProgressShape;
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
  class?: string;
  /** Hinweis: `style` des inneren Indicators wird vom Segment selbst gesetzt */
  attributes?: HtmlAttributes;
}
