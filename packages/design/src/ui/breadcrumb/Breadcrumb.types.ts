import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Gemeinsame Args aller Teilkomponenten des Breadcrumbs */
export interface BreadcrumbPartArgs {
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
  /** Inhalt der Teilkomponente */
  children?: Children;
}

/** Wurzelelement (`<nav>`), enthält die `BreadcrumbList` */
export type BreadcrumbArgs = BreadcrumbPartArgs;

/** Geordnete Liste (`<ol>`) der Einträge */
export type BreadcrumbListArgs = BreadcrumbPartArgs;

/** Einzelner Eintrag (`<li>`) */
export type BreadcrumbItemArgs = BreadcrumbPartArgs;

/** Link auf eine übergeordnete Ebene (`<a>`) */
export interface BreadcrumbLinkArgs extends BreadcrumbPartArgs {
  /** Ziel des Links; wird über safeUrl abgesichert. Ohne Angabe wird kein href gerendert */
  href?: string;
}

/** Aktuelle Seite (`<span>`, nicht klickbar) */
export type BreadcrumbPageArgs = BreadcrumbPartArgs;

/** Trenner zwischen den Einträgen (`<li>`); `children` ersetzt das Standard-Icon (Chevron) */
export type BreadcrumbSeparatorArgs = BreadcrumbPartArgs;

/** Platzhalter für eingeklappte Ebenen (`<span>` mit Icon) */
export interface BreadcrumbEllipsisArgs extends Omit<BreadcrumbPartArgs, "children"> {
  /** Text für Screenreader (Standard: "More") */
  label?: string;
}
