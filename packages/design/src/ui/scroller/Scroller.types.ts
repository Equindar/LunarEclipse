import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Scrollrichtung des Containers */
export type ScrollerOrientation = "vertical" | "horizontal";

/** Richtung eines Navigationsbuttons */
export type ScrollDirection = "up" | "down" | "left" | "right";

/**
 * Auslöser der Navigationsbuttons:
 * - "press": Scrollen, solange der Button gedrückt wird
 * - "hover": Scrollen, solange der Mauszeiger über dem Button steht
 * - "click": ein Schritt pro Klick
 */
export type ScrollTriggerMode = "press" | "hover" | "click";

/** Signal-State eines Scrollers mit Navigationsbuttons */
export interface ScrollerSignals {
  /** Es kann nach oben gescrollt werden (Button "up" sichtbar) */
  up: boolean;
  /** Es kann nach unten gescrollt werden (Button "down" sichtbar) */
  down: boolean;
  /** Es kann nach links gescrollt werden (Button "left" sichtbar) */
  left: boolean;
  /** Es kann nach rechts gescrollt werden (Button "right" sichtbar) */
  right: boolean;
  /** ID des laufenden Auto-Scroll-Intervalls, 0 = keins (null wäre in data-signals ein Löschbefehl) */
  autoScrollTimer: number;
}

export interface ScrollerArgs {
  /**
   * ID des scrollbaren Elements. Mit `withNavigation` wird sie für Signale und Buttons gebraucht;
   * ohne Angabe wird dann eine zufällige ID (`scroller_<8 hex>`) erzeugt.
   * Erlaubt sind Buchstaben, Ziffern, "-" und "_" (daraus werden die Signal-Namen gebildet).
   */
  id?: string;
  /** Scrollrichtung (Standard: "vertical") */
  orientation?: ScrollerOrientation;
  /** Blendet die Scrollbar aus, das Scrollen bleibt möglich (Standard: false) */
  hideScrollbar?: boolean;
  /** Breite bzw. Höhe des Scroll-Schattens in Pixeln (Standard: 40) */
  size?: number;
  /** Scroll-Abstand in Pixeln, ab dem ein Schatten erscheint (Standard: 0) */
  offset?: number;
  /** Rendert Navigationsbuttons, die nur erscheinen, wenn in die Richtung gescrollt werden kann (Standard: false) */
  withNavigation?: boolean;
  /** Scroll-Schritt der Navigationsbuttons in Pixeln (Standard: 40) */
  scrollStep?: number;
  /** Auslöser der Navigationsbuttons (Standard: "press") */
  scrollTriggerMode?: ScrollTriggerMode;
  /** Zusätzliche CSS-Klassen für das scrollbare Element, z. B. eine Höhe ("h-72") */
  class?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben, `style` wird ergänzt) */
  attributes?: HtmlAttributes;
  /** Scrollbarer Inhalt */
  children?: Children;
}

/** Args eines Navigationsbuttons (intern) */
export interface ScrollButtonArgs {
  /** ID des scrollbaren Elements, das gesteuert wird (zugleich Basis der Signale) */
  scrollerId: string;
  direction: ScrollDirection;
  /** Scroll-Schritt in Pixeln */
  scrollStep: number;
  triggerMode: ScrollTriggerMode;
}
