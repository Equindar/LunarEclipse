import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Zustand des Fortschritts (entspricht den data-Attributen von Base UI) */
export type ProgressStatus = "indeterminate" | "progressing" | "complete";

/** Aufgelöster Wertebereich (siehe resolveProgressRange) */
export interface ProgressRange {
  min: number;
  max: number;
}

/**
 * Wert und Wertebereich. Die Teile (Track, Indicator, Label, Value) kennen den Root nicht
 * (kein React-Context), deshalb bekommen sie dieselben Angaben wie der Root.
 */
export interface ProgressMeasureArgs {
  /** Aktueller Wert. `null` oder nicht gesetzt: unbestimmter Fortschritt (indeterminate) */
  value?: number | null;
  /** Untergrenze (Standard: 0) */
  min?: number;
  /** Obergrenze (Standard: 100) */
  max?: number;
  /**
   * Datastar-Ausdruck, der den Wert liefert, z. B. `$upload.value`.
   * Damit folgen Breite, ARIA-Werte und Anzeige dem Signal. `value` dient dann als Startwert
   * für das Rendering vor dem Laden von Datastar.
   */
  valueSignal?: string;
}

/** Formatierung der Wertanzeige und von aria-valuetext */
export interface ProgressFormatArgs {
  /** Locale für Intl.NumberFormat (Standard: "en-US") */
  locale?: string;
  /**
   * Eigene Formatierung des Rohwerts. Ohne Angabe wird der Anteil am Wertebereich
   * als Prozent ausgegeben.
   */
  format?: Intl.NumberFormatOptions;
}

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
