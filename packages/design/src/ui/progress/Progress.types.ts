import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

import type { ProgressFormatArgs, ProgressMeasureArgs } from "../../utils/progressValue";

/** Gemeinsame Typen liegen in utils/progressValue.ts und bleiben über dieses Modul verfügbar */
export type {
    ProgressFormatArgs,
    ProgressMeasureArgs,
    ProgressRange,
    ProgressStatus
} from "../../utils/progressValue";

export interface ProgressArgs extends ProgressMeasureArgs, ProgressFormatArgs {
  /** ID des Elements. Mit `hasLabel` wird aria-labelledby auf `<id>-label` gesetzt */
  id?: string;
  /**
   * Setzt aria-labelledby auf `<id>-label`. Erfordert `id` und ein `ProgressLabel` mit derselben `id`.
   * Ohne Label sollte `attributes: { "aria-label": "..." }` gesetzt werden.
   */
  hasLabel?: boolean;
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
  /** Inhalt vor dem Track, z. B. ProgressLabel und ProgressValue */
  children?: Children;
}

export interface ProgressTrackArgs extends ProgressMeasureArgs {
  class?: string;
  attributes?: HtmlAttributes;
  /** Inhalt des Tracks, in der Regel der ProgressIndicator */
  children?: Children;
}

export interface ProgressIndicatorArgs extends ProgressMeasureArgs {
  class?: string;
  /** Hinweis: `style` wird vom Indicator selbst gesetzt (Breite) und überschreibt ein Nutzer-`style` */
  attributes?: HtmlAttributes;
}

export interface ProgressLabelArgs extends ProgressMeasureArgs {
  /** ID des Progress-Roots (zwingend), das Label bekommt die ID `<id>-label` */
  id: string;
  class?: string;
  attributes?: HtmlAttributes;
  /** Text des Labels */
  children?: Children;
}

export interface ProgressValueArgs extends ProgressMeasureArgs, ProgressFormatArgs {
  class?: string;
  attributes?: HtmlAttributes;
  /** Überschreibt die formatierte Anzeige (z. B. "3 von 5") */
  children?: Children;
}
