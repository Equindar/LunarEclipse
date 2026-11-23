import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Signal-State eines Inhaltsverzeichnisses */
export interface TableOfContentSignals {
  /** IDs der Überschriften, die gerade aktiv sind (in Dokumentreihenfolge) */
  activeIds: string[];
}

/** Einrückungsstufe eines Links (1 = oberste Ebene) */
export type TableOfContentLinkDepth = 1 | 2 | 3 | 4;

export interface TableOfContentArgs {
  /**
   * ID des Inhaltsverzeichnisses. Teilkomponenten (Link, Indicator) brauchen dieselbe ID.
   * Ohne Angabe wird eine Zufalls-ID erzeugt, dann lassen sich Teilkomponenten nicht verknüpfen.
   */
  id?: string;
  class?: string;
  /** Beschriftung der Navigation für Screenreader (Standard: "Table of contents") */
  label?: string;
  /** Pflicht: IDs der Überschriften im Dokument, in Dokumentreihenfolge (Grundlage des Scroll-Spy) */
  targetIds: readonly string[];
  /** CSS-Selektor des Scroll-Containers; ohne Angabe wird die Seite beobachtet */
  scrollContainer?: string;
  /** Band, in dem eine Überschrift als aktiv gilt (Standard: "-20px 0px -40% 0px") */
  rootMargin?: string;
  /** Schwellwert des IntersectionObservers (Standard: 0) */
  threshold?: number | readonly number[];
  /** Abstand zum Ende in Pixeln, ab dem der letzte Eintrag aktiv ist (Standard: 48) */
  endOffset?: number;
  attributes?: HtmlAttributes;
  /** Inhalt: Title, List und so weiter */
  children?: Children;
}

export interface TableOfContentTitleArgs {
  class?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}

export interface TableOfContentListArgs {
  class?: string;
  attributes?: HtmlAttributes;
  /** Indicator und Items */
  children?: Children;
}

export interface TableOfContentItemArgs {
  class?: string;
  attributes?: HtmlAttributes;
  /** Üblicherweise ein TocLink */
  children?: Children;
}

export interface TableOfContentLinkArgs {
  /** Pflicht: ID des Inhaltsverzeichnisses (TocArgs.id) */
  tocId: string;
  /** Pflicht: ID der Überschrift im Dokument, auf die der Link zeigt */
  targetId: string;
  /** Einrückung (Standard: 1) */
  depth?: TableOfContentLinkDepth;
  class?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}

export interface TableOfContentIndicatorArgs {
  /** Pflicht: ID des Inhaltsverzeichnisses (TocArgs.id) */
  tocId: string;
  class?: string;
  attributes?: HtmlAttributes;
}
