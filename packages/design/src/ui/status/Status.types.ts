import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Farbvariante des Status (steuert auch die Farbe des Indikators) */
export type StatusVariant = "default" | "success" | "error" | "warning" | "info";

export interface StatusArgs {
  /** Farbvariante (Standard: "default") */
  variant?: StatusVariant;
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Wenn gesetzt, wird der Status als Link (`<a>`) statt als `<div>` gerendert */
  href?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
  /** Inhalt des Status, üblicherweise `StatusIndicator()` und `StatusLabel()` */
  children?: Children;
}

export interface StatusIndicatorArgs {
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
  /** Inhalt des Indikators (in der Regel leer) */
  children?: Children;
}

export interface StatusLabelArgs {
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
  /** Text des Labels */
  children?: Children;
}
