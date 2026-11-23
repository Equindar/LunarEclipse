import { createSignals } from "../../utils/SignalManager";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import type {
    ResizableHandleSignals,
    ResizableOrientation,
    ResizablePanelArgs,
    ResizableSize,
} from "./Resizable.types";

/**
 * Datastar-Expressions und Attribut-Bausteine der Resizable-Komponenten.
 * Ersetzt react-resizable-panels: Die Grössen liegen als flex-grow direkt im DOM,
 * Signale halten nur den Drag-Zustand. Interne Datei: wird bewusst nicht über index.ts exportiert.
 *
 * Alle Expressions sind bewusst einzeilig, weil Datastar Statements zeilenweise und an ";" trennt.
 */

export const DEFAULT_ORIENTATION: ResizableOrientation = "horizontal";

/** Schrittweite der Pfeiltasten in Prozent des Gruppenplatzes */
export const KEYBOARD_STEP_PERCENT = 10;

/** Werte für data-slot (wie in shadcn/ui) */
export const SLOT = {
  group: "resizable-panel-group",
  panel: "resizable-panel",
  handle: "resizable-handle",
} as const;

/** Initialer Signal-State eines Handles */
export const resizableHandleInitialSignals: ResizableHandleSignals = {
  dragging: false,
  startPos: 0,
  startA: 0,
  startB: 0,
};

/** Signal-Manager eines Handles (Signal-Name = ID mit "-" zu "_") */
export const resizableHandleSignals = (handleId: string) =>
  createSignals<ResizableHandleSignals>(handleId, resizableHandleInitialSignals);

/** Zufalls-ID für Handles ohne eigene ID: resizable_<8 Hex-Zeichen> */
export function createHandleId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return `resizable_${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

/** Wandelt eine Grössenangabe (50 oder "50%") in Prozent um; ungültige Werte und Pixel ergeben undefined */
export function toPercent(size: ResizableSize | undefined): number | undefined {
  if (size === undefined) return undefined;
  if (typeof size === "string" && !size.trim().endsWith("%")) return undefined;

  const value = typeof size === "number" ? size : Number.parseFloat(size);
  return Number.isFinite(value) ? value : undefined;
}

/** Attribute der Gruppe: aria-orientation (die Tailwind-Klassen der Quelle zielen darauf) und Init-Handler */
export function buildGroupDataAttributes(orientation: ResizableOrientation): HtmlAttributes {
  return { "aria-orientation": orientation, "data-init": buildGroupInitHandler() };
}

/** Inline-Style eines Panels: flex-grow trägt die Grösse, overflow hält den Inhalt im Panel */
export function buildPanelStyle(defaultSize: number | undefined): string {
  return `flex: ${defaultSize ?? 1} 1 0px; overflow: hidden`;
}

/** data-Attribute eines Panels: Start- und Grenzwerte in Prozent (werden von den Handle-Handlern gelesen) */
export function buildPanelDataAttributes(
  args: Pick<ResizablePanelArgs, "defaultSize" | "minSize" | "maxSize">
): HtmlAttributes {
  const defaultSize = toPercent(args.defaultSize);
  const minSize = toPercent(args.minSize);
  const maxSize = toPercent(args.maxSize);

  const attrs: HtmlAttributes = { style: buildPanelStyle(defaultSize) };
  if (defaultSize !== undefined) attrs["data-default-size"] = defaultSize;
  if (minSize !== undefined) attrs["data-min-size"] = minSize;
  if (maxSize !== undefined) attrs["data-max-size"] = maxSize;

  return attrs;
}

/** Standard-Attribute eines Handles (ARIA, Fokus, Touch und Cursor). Der Handle steht senkrecht zur Gruppe */
export function buildHandleDataAttributes(groupOrientation: ResizableOrientation): HtmlAttributes {
  const vertical = groupOrientation === "vertical";

  return {
    role: "separator",
    tabindex: 0,
    "aria-orientation": vertical ? "horizontal" : "vertical",
    "aria-valuemin": 0,
    "aria-valuemax": 100,
    // touch-action: Ziehen per Touch darf nicht scrollen
    style: `touch-action: none; cursor: ${vertical ? "row-resize" : "col-resize"}`,
  };
}

/* ------------------------------------------------------------------ */
/* Gemeinsamer JavaScript-Baustein der Handle-Handler                  */
/* ------------------------------------------------------------------ */

const joinLine = (parts: readonly string[]): string => parts.join(" ");

/**
 * Vorspann der Handle-Handler (läuft innerhalb einer IIFE, `el` ist der Handle, `evt` das Event):
 * - group, vertical, rtl: Gruppe, Ausrichtung und Schreibrichtung
 * - px(n): Grösse eines Elements entlang der Hauptachse
 * - panels, a, b, total: alle Panels der Gruppe, Nachbar-Panels des Handles, Gesamtgrösse der Panels
 * - freeze(): schreibt die aktuellen Pixelgrössen als flex-grow (Prozentwerte und Pixel dürfen nicht gemischt werden;
 *   erst alle Panels messen, dann schreiben, sonst verschiebt jede Zuweisung die Messung der übrigen)
 * - move(sizeA, sizeB, wanted): setzt Panel a auf `wanted` Pixel (begrenzt durch min/max beider Nachbarn), b erhält den Rest
 */
const RESIZE_PRELUDE = joinLine([
  "const group = el.parentElement;",
  "const vertical = group.getAttribute('aria-orientation') === 'vertical';",
  "const rtl = !vertical && getComputedStyle(group).direction === 'rtl';",
  `const isPanel = (n) => n.dataset.slot === '${SLOT.panel}';`,
  "const px = (n) => { const r = n.getBoundingClientRect(); return vertical ? r.height : r.width; };",
  "const panels = Array.from(group.children).filter(isPanel);",
  "const a = el.previousElementSibling;",
  "const b = el.nextElementSibling;",
  "if (!a || !b || !isPanel(a) || !isPanel(b)) return;",
  "const total = panels.reduce((sum, n) => sum + px(n), 0);",
  "if (total <= 0) return;",
  "const limit = (n, key, fallback) => (n.dataset[key] === undefined ? fallback : parseFloat(n.dataset[key])) * total / 100;",
  "const freeze = () => { const sizes = panels.map(px); panels.forEach((n, i) => { n.style.flexGrow = sizes[i]; }); };",
  "const move = (sizeA, sizeB, wanted) => {",
  "const pair = sizeA + sizeB;",
  "const lo = Math.max(limit(a, 'minSize', 0), pair - limit(b, 'maxSize', 100));",
  "const hi = Math.max(lo, Math.min(limit(a, 'maxSize', 100), pair - limit(b, 'minSize', 0)));",
  "const next = Math.min(Math.max(wanted, lo), hi);",
  "a.style.flexGrow = next;",
  "b.style.flexGrow = pair - next;",
  "el.setAttribute('aria-valuenow', Math.round(next / total * 100));",
  "};",
]);

/** Verpackt einen Rumpf in eine IIFE (einzeilig, damit Datastar nicht an inneren ";" trennt) */
const iife = (...body: string[]): string => `(() => { ${joinLine(body)} })()`;

/**
 * Init-Handler der Gruppe (data-init): Panels ohne defaultSize teilen sich den Rest zu gleichen Teilen,
 * die Handles bekommen ihren Startwert für aria-valuenow.
 */
export function buildGroupInitHandler(): string {
  return iife(
    "const kids = Array.from(el.children);",
    `const panels = kids.filter((n) => n.dataset.slot === '${SLOT.panel}');`,
    "const sized = panels.filter((n) => n.dataset.defaultSize !== undefined);",
    "const free = panels.filter((n) => n.dataset.defaultSize === undefined);",
    "const used = sized.reduce((sum, n) => sum + parseFloat(n.dataset.defaultSize), 0);",
    "free.forEach((n) => { n.style.flexGrow = Math.max(0, 100 - used) / free.length; });",
    "const sum = panels.reduce((acc, n) => acc + parseFloat(n.style.flexGrow || '0'), 0);",
    `kids.filter((n) => n.dataset.slot === '${SLOT.handle}').forEach((h) => {`,
    "const prev = h.previousElementSibling;",
    "if (prev && sum > 0) h.setAttribute('aria-valuenow', Math.round(parseFloat(prev.style.flexGrow || '0') / sum * 100));",
    "});"
  );
}

/** pointerdown am Handle: Pointer Capture, Pixelgrössen einfrieren, Startwerte merken, Textauswahl sperren */
export function buildPointerDownHandler(handleId: string): string {
  const s = resizableHandleSignals(handleId);

  return iife(
    "if (evt.button !== 0) return;",
    RESIZE_PRELUDE,
    "freeze();",
    "el.setPointerCapture(evt.pointerId);",
    "group.style.userSelect = 'none';",
    `${s.set("startPos", "(vertical ? evt.clientY : evt.clientX)")};`,
    `${s.set("startA", "px(a)")};`,
    `${s.set("startB", "px(b)")};`,
    s.set("dragging", "true")
  );
}

/** pointermove am Handle (durch Pointer Capture auch außerhalb des Elements): Panels neu aufteilen */
export function buildPointerMoveHandler(handleId: string): string {
  const s = resizableHandleSignals(handleId);

  const body = iife(
    RESIZE_PRELUDE,
    `const delta = ((vertical ? evt.clientY : evt.clientX) - ${s.signal("startPos")}) * (rtl ? -1 : 1);`,
    `move(${s.signal("startA")}, ${s.signal("startB")}, ${s.signal("startA")} + delta);`
  );

  return `${s.signal("dragging")} ? ${body} : void 0`;
}

/** pointerup und pointercancel: Ziehen beenden und Textauswahl wieder freigeben */
export function buildPointerEndHandler(handleId: string): string {
  const s = resizableHandleSignals(handleId);

  return s.conditionalMultiAction(
    s.signal("dragging"),
    s.set("dragging", "false"),
    "el.parentElement.style.userSelect = ''"
  );
}

/**
 * keydown am Handle: Pfeiltasten entlang der Hauptachse verschieben um KEYBOARD_STEP_PERCENT,
 * Home setzt das vordere Panel auf sein Minimum, End auf sein Maximum.
 */
export function buildKeyDownHandler(): string {
  return iife(
    RESIZE_PRELUDE,
    "const dec = vertical ? 'ArrowUp' : (rtl ? 'ArrowRight' : 'ArrowLeft');",
    "const inc = vertical ? 'ArrowDown' : (rtl ? 'ArrowLeft' : 'ArrowRight');",
    "if (![dec, inc, 'Home', 'End'].includes(evt.key)) return;",
    "evt.preventDefault();",
    "freeze();",
    "const sizeA = px(a);",
    "const sizeB = px(b);",
    `const step = ${KEYBOARD_STEP_PERCENT} * total / 100;`,
    "move(sizeA, sizeB, evt.key === dec ? sizeA - step : evt.key === inc ? sizeA + step : evt.key === 'Home' ? 0 : sizeA + sizeB);"
  );
}
