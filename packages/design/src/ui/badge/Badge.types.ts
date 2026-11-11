import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Visueller Stil des Badges */
export type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";

/** Position eines Icons im Badge (data-icon) */
export type BadgeIconPosition = "inline-start" | "inline-end";

export interface BadgeArgs {
  /** Visueller Stil (Standard: "default") */
  variant?: BadgeVariant;
  /** Zusätzliche CSS-Klassen, z. B. eigene Farben ("bg-green-50 dark:bg-green-800") */
  class?: string;
  /** Wenn gesetzt, wird das Badge als Link (`<a>`) statt als `<span>` gerendert */
  href?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
  /** Inhalt des Badges (Text, optional mit Icon oder Spinner) */
  children?: Children;
}
