import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { createSignals } from "../../utils/SignalManager";
import type {
    ScrollDirection,
    ScrollerOrientation,
    ScrollerSignals,
    ScrollTriggerMode,
} from "./Scroller.types";

/**
 * Datastar-Expressions und Attribut-Bausteine des Scrollers
 * (ersetzt das useLayoutEffect, die Scroll-Handler und die Timer der ScrollButton-Komponente).
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 *
 * Hinweis zu Datastar: Die Engine zerlegt Expressions an Semikola, ohne Klammerblöcke zu beachten.
 * Geschützt sind nur Strings, Regex-Literale und IIFEs ohne Argumente. Deshalb steckt der Scroll-Handler
 * in einer IIFE, und die Auto-Scroll-Funktion kommt ohne Semikola und ohne Block aus.
 */

export const DEFAULT_ORIENTATION: ScrollerOrientation = "vertical";
export const DEFAULT_TRIGGER_MODE: ScrollTriggerMode = "press";
export const DEFAULT_SHADOW_SIZE = 40;
export const DEFAULT_OFFSET = 0;
export const DEFAULT_SCROLL_STEP = 40;

/** Intervall des Auto-Scrollens (press, hover) in Millisekunden */
export const AUTO_SCROLL_INTERVAL_MS = 50;

/** Initialer Signal-State eines Scrollers mit Navigation */
export const scrollerInitialSignals: ScrollerSignals = {
  up: false,
  down: false,
  left: false,
  right: false,
  autoScrollTimer: 0,
};

/** Signal-Manager eines Scrollers (Signal-Name = ID mit "-" → "_") */
export const scrollerSignals = (scrollerId: string) =>
  createSignals<ScrollerSignals>(scrollerId, scrollerInitialSignals);

/** Gibt `value` zurück, wenn es eine endliche Zahl ist, sonst den Standardwert (schützt Expressions und Inline-Style) */
export function toFiniteNumber(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

/** Standard-Attribute des scrollbaren Elements */
export function buildScrollerDataAttributes(): HtmlAttributes {
  return { "data-slot": "scroller" };
}

/** Standard-Attribute des Wrappers (nur mit Navigationsbuttons) */
export function buildScrollerWrapperDataAttributes(scrollerId: string): HtmlAttributes {
  return {
    "data-slot": "scroller-wrapper",
    "data-signals": scrollerSignals(scrollerId).dataSignals,
  };
}

/** Standard-Attribute eines Navigationsbuttons: sichtbar nur, wenn in die Richtung gescrollt werden kann */
export function buildScrollButtonDataAttributes(scrollerId: string, direction: ScrollDirection): HtmlAttributes {
  return {
    "data-slot": "scroll-button",
    "data-show": scrollerSignals(scrollerId).signal(direction),
    // kein Flackern vor dem Laden von Datastar
    style: "display: none;",
  };
}

/** Die beiden Richtungen der Navigationsbuttons je Orientierung */
export const navigationDirections: Record<ScrollerOrientation, readonly [ScrollDirection, ScrollDirection]> = {
  vertical: ["up", "down"],
  horizontal: ["left", "right"],
};

/** Achsen-Eigenschaften des Containers je Orientierung */
const axisByOrientation: Record<
  ScrollerOrientation,
  { position: string; client: string; total: string; start: ScrollDirection; end: ScrollDirection }
> = {
  vertical: { position: "scrollTop", client: "clientHeight", total: "scrollHeight", start: "up", end: "down" },
  horizontal: { position: "scrollLeft", client: "clientWidth", total: "scrollWidth", start: "left", end: "right" },
};

/** Attribute, die den Scroll-Zustand für die Mask-Klassen markieren (siehe scrollerVariants) */
const stateAttributesByOrientation: Record<ScrollerOrientation, { start: string; end: string; both: string }> = {
  vertical: { start: "data-top-scroll", end: "data-bottom-scroll", both: "data-top-bottom-scroll" },
  horizontal: { start: "data-left-scroll", end: "data-right-scroll", both: "data-left-right-scroll" },
};

interface ScrollStateHandlerOptions {
  orientation: ScrollerOrientation;
  offset: number;
  /** Mit ID werden zusätzlich die Signale der Navigationsbuttons gesetzt */
  navigationId?: string;
}

/**
 * Handler für data-init, data-on:scroll und data-on:resize__window.
 * Setzt die Zustands-Attribute am Element (`el`) und, mit Navigation, die Sichtbarkeits-Signale.
 * Berechnet nur die Achse der aktiven Orientierung (die andere Achse hatte in der Vorlage keine Wirkung).
 */
export function buildScrollStateHandler({ orientation, offset, navigationId }: ScrollStateHandlerOptions): string {
  const axis = axisByOrientation[orientation];
  const attributes = stateAttributesByOrientation[orientation];

  const statements = [
    `const pos = el.${axis.position}, size = el.${axis.client}, total = el.${axis.total}`,
    `const start = pos > (${offset})`,
    `const end = pos + size + (${offset}) < total`,
    "const scrollable = total > size",
    "const both = start && end && scrollable",
    `const mark = (name, on) => on ? el.setAttribute(name, "true") : el.removeAttribute(name)`,
    `mark(${JSON.stringify(attributes.both)}, both)`,
    `mark(${JSON.stringify(attributes.start)}, !both && start)`,
    `mark(${JSON.stringify(attributes.end)}, !both && end && scrollable)`,
  ];

  if (navigationId) {
    const s = scrollerSignals(navigationId);
    // Wie in der Vorlage: Sichtbarkeit der Buttons mit offset nur am Anfang, nicht am Ende
    statements.push(s.set(axis.start, "start"), s.set(axis.end, "pos + size < total"));
  }

  return `(() => { ${statements.join("; ")} })()`;
}

/** Ein Scroll-Schritt des Containers in die Richtung (Expression, ohne Semikolon) */
export function buildScrollByExpression(scrollerId: string, direction: ScrollDirection, step: number): string {
  const target = `document.getElementById(${JSON.stringify(scrollerId)})`;

  const scrollBy: Record<ScrollDirection, string> = {
    up: `${target}.scrollTop -= ${step}`,
    down: `${target}.scrollTop += ${step}`,
    left: `${target}.scrollLeft -= ${step}`,
    right: `${target}.scrollLeft += ${step}`,
  };

  return scrollBy[direction];
}

/**
 * Startet das Auto-Scrollen (press, hover), falls kein Timer läuft.
 * Der Tick beendet sich selbst, sobald die Richtung nicht mehr verfügbar ist (Button ausgeblendet):
 * Die Vorlage entfernt den Button dann aus dem DOM, und das Cleanup-Effect stoppt den Timer.
 */
export function buildAutoScrollStartHandler(scrollerId: string, direction: ScrollDirection, step: number): string {
  const s = scrollerSignals(scrollerId);
  const timer = s.signal("autoScrollTimer");

  const tick = `() => ${s.signal(direction)} ? (${buildScrollByExpression(scrollerId, direction, step)}) : (clearInterval(${timer}), ${s.set("autoScrollTimer", "0")})`;

  return s.conditionalAction(`${timer} === 0`, "autoScrollTimer", `setInterval(${tick}, ${AUTO_SCROLL_INTERVAL_MS})`);
}

/** Stoppt das Auto-Scrollen, falls ein Timer läuft */
export function buildAutoScrollStopHandler(scrollerId: string): string {
  const s = scrollerSignals(scrollerId);
  const timer = s.signal("autoScrollTimer");

  return s.conditionalMultiAction(`${timer} !== 0`, `clearInterval(${timer})`, s.set("autoScrollTimer", "0"));
}

/** Event-Attribute eines Navigationsbuttons je Auslöser */
export function buildScrollButtonTriggerAttributes(
  mode: ScrollTriggerMode,
  scrollerId: string,
  direction: ScrollDirection,
  step: number
): HtmlAttributes {
  switch (mode) {
    case "press": {
      const stop = buildAutoScrollStopHandler(scrollerId);
      return {
        "data-on:pointerdown": buildAutoScrollStartHandler(scrollerId, direction, step),
        "data-on:pointerup": stop,
        "data-on:pointerleave": stop,
      };
    }
    case "hover":
      return {
        "data-on:pointerenter": buildAutoScrollStartHandler(scrollerId, direction, step),
        "data-on:pointerleave": buildAutoScrollStopHandler(scrollerId),
      };
    case "click":
      return { "data-on:click": buildScrollByExpression(scrollerId, direction, step) };
    default:
      return {};
  }
}
