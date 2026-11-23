import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Schreibrichtung (Attribut `dir`) */
export type TimelineDirection = "ltr" | "rtl";

/** Ausrichtung der Timeline */
export type TimelineOrientation = "vertical" | "horizontal";

/** Darstellung: "default" (alle Items auf einer Seite) oder "alternate" (Inhalt wechselt die Seite) */
export type TimelineVariant = "default" | "alternate";

/** Zustand eines Items, abgeleitet aus `activeIndex` des Roots */
export type TimelineStatus = "completed" | "active" | "pending";

/** Kontext des Roots, aus dem die Item-Kontexte berechnet werden */
export interface TimelineRootContext {
  orientation: TimelineOrientation;
  variant: TimelineVariant;
  dir?: TimelineDirection;
  /** Nullbasierter Index des aktiven Items */
  activeIndex?: number;
}

/**
 * Kontext eines Items. Ersetzt TimelineContext, TimelineItemContext und den Store der React-Vorlage:
 * Das Root berechnet ihn pro Item und reicht ihn an Item und Teilkomponenten weiter.
 */
export interface TimelineItemContext {
  orientation: TimelineOrientation;
  variant: TimelineVariant;
  dir?: TimelineDirection;
  /** Nullbasierter Index des Items */
  index: number;
  status: TimelineStatus;
  /** Nur in der Variante "alternate": Item steht rechts bzw. unten (ungerader Index) */
  isAlternateRight: boolean;
  /** Status des folgenden Items, `undefined` beim letzten Item */
  nextStatus?: TimelineStatus;
}

/** Gemeinsame Felder aller Teilkomponenten */
export interface TimelineBaseArgs {
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
  /** Inhalt */
  children?: Children;
}

export interface TimelineItemArgs {
  /** Pflicht: Kontext des Items (vom Root berechnet, siehe `Timeline`) */
  context: TimelineItemContext;
  /** Optional: ID des Items. Ohne Angabe wird keine `id` gerendert */
  id?: string;
  class?: string;
  attributes?: HtmlAttributes;
  /** Inhalt oder Funktion, die mit dem Item-Kontext den Inhalt liefert (Ersatz für useTimelineItemContext) */
  children?: Children | ((context: TimelineItemContext) => Children);
}

export interface TimelineArgs {
  /** Schreibrichtung. Ohne Angabe wird kein `dir` gerendert, die Timeline erbt die Richtung vom Dokument */
  dir?: TimelineDirection;
  /** Ausrichtung (Standard: "vertical") */
  orientation?: TimelineOrientation;
  /** Darstellung (Standard: "default") */
  variant?: TimelineVariant;
  /** Nullbasierter Index des aktiven Items: davor "completed", danach "pending". Ohne Angabe sind alle "pending" */
  activeIndex?: number;
  class?: string;
  attributes?: HtmlAttributes;
  /** Items der Timeline; der Kontext (`context`) wird vom Root ergänzt */
  items?: Omit<TimelineItemArgs, "context">[];
}

export interface TimelineDotArgs extends TimelineBaseArgs {
  /** Pflicht: Kontext des Items */
  context: TimelineItemContext;
}

export interface TimelineConnectorArgs extends TimelineBaseArgs {
  /** Pflicht: Kontext des Items */
  context: TimelineItemContext;
  /** Connector auch beim letzten Item rendern (Standard: false) */
  forceMount?: boolean;
}

export interface TimelineContentArgs extends TimelineBaseArgs {
  /** Pflicht: Kontext des Items */
  context: TimelineItemContext;
}

export type TimelineHeaderArgs = TimelineBaseArgs;

export type TimelineTitleArgs = TimelineBaseArgs;

export type TimelineDescriptionArgs = TimelineBaseArgs;

export interface TimelineTimeArgs extends TimelineBaseArgs {
  /** Maschinenlesbares Datum (Attribut `datetime`), z. B. "2025-01-15" */
  dateTime?: string;
}
