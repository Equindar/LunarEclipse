import { buildConditional } from "../../utils/buildConditional";
import { jsString } from "../../utils/jsString";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { buildScrollSpyExpression } from "../../utils/scrollSpy";
import { createSignals } from "../../utils/SignalManager";
import type { ScrollSpyArgs, ScrollSpyOrientation, ScrollSpySignals } from "./ScrollSpy.types";

/**
 * Datastar-Expressions des ScrollSpy.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 *
 * Alle Expressions sind Einzeiler ohne Semikolons (siehe utils/scrollSpy.ts). Zustand am Root-Element:
 * - `__scrollSpyValue`: zuletzt vom Beobachter oder per Scrollen gesetzter Wert (zur Unterscheidung von externen Änderungen)
 * - `__scrollSpyLast`: zuletzt an `onValueChange` gemeldeter Wert
 * - `__scrollSpyScrollTo(value)`: scrollt zum Abschnitt und setzt den Wert
 * - `__scrollSpyTimer`: Timeout, das `scrolling` wieder zurücksetzt
 */

export const DEFAULT_SCROLL_SPY_ORIENTATION: ScrollSpyOrientation = "horizontal";
export const DEFAULT_SCROLL_SPY_THRESHOLD = 0.1;
export const DEFAULT_SCROLL_SPY_OFFSET = 0;

/** Dauer, in der der Beobachter nach einem Klick auf einen Link nicht schreibt (wie in der Quelle) */
export const SCROLL_SPY_SCROLLING_MS = 500;

export const SECTION_SELECTOR = '[data-slot="scroll-spy-section"]';

/** Signal-Manager eines ScrollSpy (Signal-Name = ID mit "-" zu "_") */
export const scrollSpySignals = (id: string, initialValue = "") =>
  createSignals<ScrollSpySignals>(id, { value: initialValue, scrolling: false });

/** Zufalls-ID: `scroll_spy_<8 Hex-Zeichen>` */
export function createScrollSpyId(): string {
  const hex = Array.from(crypto.getRandomValues(new Uint8Array(4)), (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `scroll_spy_${hex}`;
}

/** data-orientation-Attribut eines Teils (data-slot kommt über withSlot) */
export function buildScrollSpyOrientationAttributes(orientation: ScrollSpyOrientation): HtmlAttributes {
  return { "data-orientation": orientation };
}

function resolveOffset(offset: number | undefined): number {
  return Number.isFinite(offset) ? (offset as number) : DEFAULT_SCROLL_SPY_OFFSET;
}

/**
 * Scrollt zu einem Abschnitt und setzt den Wert. Liegt kein Abschnitt vor, wird nur der Wert gesetzt.
 * Wird am Root als `el.__scrollSpyScrollTo` abgelegt, Links und externe Auslöser rufen sie darüber auf.
 */
function buildScrollToDefinition(id: string, args: ScrollSpyArgs): string {
  const s = scrollSpySignals(id);
  const offset = resolveOffset(args.offset);
  const container = args.scrollContainer ? `document.querySelector(${jsString(args.scrollContainer)})` : "null";
  const behavior = args.scrollBehavior
    ? jsString(args.scrollBehavior)
    : '(matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth")';

  return [
    "el.__scrollSpyScrollTo = (target) => ((",
    "section = document.getElementById(target),",
    `box = ${container},`,
    `behavior = ${behavior}`,
    ") => (",
    "clearTimeout(el.__scrollSpyTimer),",
    "el.__scrollSpyValue = target,",
    "section ? (",
    `${s.set("scrolling", "true")},`,
    `${s.set("value", "target")},`,
    "box",
    `? box.scrollTo({ top: section.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop - ${offset}, behavior })`,
    `: window.scrollTo({ top: section.getBoundingClientRect().top + window.scrollY - ${offset}, behavior }),`,
    `el.__scrollSpyTimer = setTimeout(() => ${s.set("scrolling", "false")}, ${SCROLL_SPY_SCROLLING_MS})`,
    `) : (${s.set("value", "target")})`,
    "))()",
  ].join(" ");
}

/**
 * `data-init` am Root: Startzustand, Beobachter der Abschnitte und die Funktion zum Scrollen.
 * Der Beobachter schreibt nicht, solange `scrolling` wahr ist.
 */
export function buildScrollSpyInitExpression(id: string, initialValue: string, args: ScrollSpyArgs): string {
  const s = scrollSpySignals(id);
  const offset = resolveOffset(args.offset);
  const initial = jsString(initialValue);

  const spy = buildScrollSpyExpression({
    targetSignal: s.signal("value"),
    selector: SECTION_SELECTOR,
    mode: "topmost",
    edges: false,
    suppressWhile: s.signal("scrolling"),
    beforeWrite: "el.__scrollSpyValue = value",
    scrollContainer: args.scrollContainer,
    rootMargin: args.rootMargin ?? `${-offset}px 0px -70% 0px`,
    threshold: args.threshold ?? DEFAULT_SCROLL_SPY_THRESHOLD,
  });

  return `(el.__scrollSpyValue = ${initial}, el.__scrollSpyLast = ${initial}, ${spy}, ${buildScrollToDefinition(id, args)})`;
}

/**
 * `data-effect` am Root, reagiert auf Änderungen des Werts:
 * - Von außen gesetzter Wert (weder Beobachter noch Link): zum Abschnitt scrollen.
 * - `onValueChange` aufrufen, wenn sich der Wert gegenüber dem zuletzt gemeldeten ändert.
 * Vor dem Start (Marker noch nicht gesetzt) passiert nichts, daher kein Scrollen und keine Meldung beim Laden.
 */
export function buildScrollSpyEffectExpression(id: string, args: Pick<ScrollSpyArgs, "onValueChange">): string {
  const s = scrollSpySignals(id);

  const scrollToExternal =
    "el.__scrollSpyValue !== undefined && value && value !== el.__scrollSpyValue && el.__scrollSpyScrollTo?.(value)";

  const notify = args.onValueChange
    ? `, el.__scrollSpyLast !== undefined && value && value !== el.__scrollSpyLast && (el.__scrollSpyLast = value, (${args.onValueChange}))`
    : "";

  return `((value = ${s.signal("value")}) => (${scrollToExternal}${notify}))()`;
}

/** Klick auf einen Link: Standardverhalten verhindern, zum Abschnitt scrollen */
export function buildScrollSpyLinkClickExpression(scrollSpyId: string, value: string): string {
  return `(evt.preventDefault(), document.getElementById(${jsString(scrollSpyId)}).__scrollSpyScrollTo(${jsString(value)}))`;
}

/** Zustand eines Links: "active", wenn sein Abschnitt der aktive ist, sonst "inactive" */
export function buildScrollSpyLinkStateExpression(scrollSpyId: string, value: string): string {
  const s = scrollSpySignals(scrollSpyId);
  return buildConditional(`${s.signal("value")} === ${jsString(value)}`, jsString("active"), jsString("inactive"));
}

/** Ausdruck, der den aktiven Abschnitt von außen setzt (scrollt dorthin), z. B. für `data-on:click` */
export function buildScrollSpySetValueExpression(id: string, value: string): string {
  return scrollSpySignals(id).set("value", jsString(value));
}
