import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Ausrichtung: "horizontal" = Navigation neben dem Inhalt, "vertical" = Navigation über dem Inhalt */
export type ScrollSpyOrientation = "horizontal" | "vertical";

export type ScrollSpyDirection = "ltr" | "rtl";

/** Entspricht ScrollBehavior des Browsers */
export type ScrollSpyBehavior = "auto" | "instant" | "smooth";

export type ScrollSpyLinkState = "active" | "inactive";

/** Signal-State eines ScrollSpy */
export interface ScrollSpySignals {
  /** Wert des aktiven Abschnitts (leer, solange keiner aktiv ist) */
  value: string;
  /** Wahr während des programmatischen Scrollens (der Beobachter schreibt dann nicht) */
  scrolling: boolean;
}

export interface ScrollSpyArgs {
  /**
   * ID des ScrollSpy. Links brauchen dieselbe ID (`scrollSpyId`).
   * Ohne Angabe wird eine Zufalls-ID erzeugt, dann lassen sich Links nicht verknüpfen.
   */
  id?: string;
  class?: string;
  /**
   * Startwert des aktiven Abschnitts. In der Quelle ist `value` kontrolliert; hier legt es nur den Startwert fest.
   * Danach wird der Wert über das Signal gesteuert (Beispiel: `scrollSpySetValue`), eine Änderung scrollt zum Abschnitt.
   */
  value?: string;
  /** Startwert des aktiven Abschnitts (wirkt wie `value`, `value` hat Vorrang) */
  defaultValue?: string;
  /**
   * Datastar-Expression, die bei jeder Änderung des aktiven Abschnitts läuft (nicht beim Start).
   * Die Variable `value` enthält den neuen Wert. Als einzelner Ausdruck ohne Semikolons schreiben.
   */
  onValueChange?: string;
  /** Band des IntersectionObservers (Standard: `${-offset}px 0px -70% 0px`) */
  rootMargin?: string;
  /** Schwellwert des IntersectionObservers (Standard: 0.1) */
  threshold?: number | readonly number[];
  /** Abstand in Pixeln oberhalb eines Abschnitts beim Scrollen und im Beobachtungsband (Standard: 0) */
  offset?: number;
  /** Scrollverhalten (Standard: "smooth", bei prefers-reduced-motion "auto") */
  scrollBehavior?: ScrollSpyBehavior;
  /** CSS-Selektor des Scroll-Containers; ohne Angabe scrollt die Seite */
  scrollContainer?: string;
  /** Schreibrichtung, gilt für alle Teile (wird vererbt). Ohne Angabe gilt die des Dokuments. */
  dir?: ScrollSpyDirection;
  /** Ausrichtung (Standard: "horizontal"). Die Teile brauchen denselben Wert. */
  orientation?: ScrollSpyOrientation;
  attributes?: HtmlAttributes;
  /** Nav, Viewport und so weiter */
  children?: Children;
}

export interface ScrollSpyNavArgs {
  /** Muss dem Wert des Roots entsprechen (Standard: "horizontal") */
  orientation?: ScrollSpyOrientation;
  class?: string;
  attributes?: HtmlAttributes;
  /** Üblicherweise mehrere ScrollSpyLink */
  children?: Children;
}

export interface ScrollSpyLinkArgs {
  /** Pflicht: ID des ScrollSpy (ScrollSpyArgs.id) */
  scrollSpyId: string;
  /** Pflicht: Wert des Abschnitts, auf den der Link zeigt (ScrollSpySectionArgs.value) */
  value: string;
  /** Muss dem Wert des Roots entsprechen (Standard: "horizontal") */
  orientation?: ScrollSpyOrientation;
  class?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}

export interface ScrollSpyViewportArgs {
  /** Muss dem Wert des Roots entsprechen (Standard: "horizontal") */
  orientation?: ScrollSpyOrientation;
  class?: string;
  attributes?: HtmlAttributes;
  /** Üblicherweise mehrere ScrollSpySection */
  children?: Children;
}

export interface ScrollSpySectionArgs {
  /** Pflicht: Wert des Abschnitts, wird auch seine `id` */
  value: string;
  /** Muss dem Wert des Roots entsprechen (Standard: "horizontal") */
  orientation?: ScrollSpyOrientation;
  class?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}
