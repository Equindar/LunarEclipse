import { newExpression } from "../../utils/DatastarExpression";
import type { AnchorAlign, AnchorSide } from "../../utils/getAnchorPosition";
import { createSignals } from "../../utils/SignalManager";
import type { HoverCardSignals } from "./HoverCard.types";

/**
 * Datastar-Expressions und Positionierungs-Bausteine der Hover Card
 * (Ersatz für PreviewCard.Root/Trigger/Positioner aus Base UI).
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 */

/** Standardwerte (Base UI: delay 600, closeDelay 300; shadcn: side bottom, align center, sideOffset 4, alignOffset 4) */
export const DEFAULT_OPEN_DELAY = 600;
export const DEFAULT_CLOSE_DELAY = 300;
export const DEFAULT_SIDE: AnchorSide = "bottom";
export const DEFAULT_ALIGN: AnchorAlign = "center";
export const DEFAULT_SIDE_OFFSET = 4;
export const DEFAULT_ALIGN_OFFSET = 4;

/** Initialer Signal-State einer Hover Card */
export const hoverCardInitialSignals: HoverCardSignals = {
  open: false,
  showTimeout: "",
  hideTimeout: "",
  closeDelay: DEFAULT_CLOSE_DELAY,
};

/** Signal-Manager einer Hover Card (Signal-Name = ID mit "-" zu "_") */
export const hoverCardSignals = (id: string) => createSignals<HoverCardSignals>(id, hoverCardInitialSignals);

/** DOM-ID des Popover-Contents (die Original-ID gilt nur für DOM-Zugriffe) */
export const hoverCardContentDomId = (id: string): string => `${id}-content`;

/** Anchor-Name (CSS dashed-ident): Zeichen außerhalb von a-z, A-Z, 0-9, "_" und "-" werden zu "_" */
export const hoverCardAnchorName = (id: string): string => id.replace(/[^a-zA-Z0-9_-]/g, "_");

/** Verzögerung als nicht-negative ganze Zahl (ungültige Werte fallen auf den Standard zurück) */
export function normalizeDelay(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value)) return fallback;
  return Math.max(0, Math.round(value));
}

const popoverElement = (id: string): string => `document.getElementById(${JSON.stringify(hoverCardContentDomId(id))})`;

/** Popover öffnen: data-open vorher setzen, damit die Einblend-Animation (data-open:animate-in) startet */
const showPopover = (id: string): string =>
  `(p => p && !p.matches(':popover-open') ? (p.setAttribute('data-open', ''), p.showPopover()) : null)(${popoverElement(id)})`;

/** Popover schließen (die Ausblend-Animation entfällt, weil das Popover sofort ausgeblendet wird) */
const hidePopover = (id: string): string =>
  `(p => p && p.matches(':popover-open') ? (p.hidePopover(), p.removeAttribute('data-open')) : null)(${popoverElement(id)})`;

/** Trigger-Hover: Karte nach delayMs öffnen und die Schließverzögerung für den Content merken */
export function buildHoverOpenHandler(id: string, delayMs: number, closeDelayMs: number): string {
  const s = hoverCardSignals(id);

  return newExpression()
    .statement(`clearTimeout(${s.signal("hideTimeout")})`)
    .statement(`clearTimeout(${s.signal("showTimeout")})`)
    .statement(s.set("closeDelay", String(closeDelayMs)))
    .statement(s.set("showTimeout", `setTimeout(() => { ${showPopover(id)}; }, ${delayMs})`))
    .build();
}

/** Trigger-Fokus: Karte sofort öffnen */
export function buildFocusOpenHandler(id: string, closeDelayMs: number): string {
  const s = hoverCardSignals(id);

  return newExpression()
    .statement(`clearTimeout(${s.signal("hideTimeout")})`)
    .statement(`clearTimeout(${s.signal("showTimeout")})`)
    .statement(s.set("closeDelay", String(closeDelayMs)))
    .statement(showPopover(id))
    .build();
}

/** Trigger oder Content verlassen: ausstehendes Öffnen abbrechen, Schließen nach closeDelay einplanen */
export function buildScheduleHideHandler(id: string): string {
  const s = hoverCardSignals(id);

  return newExpression()
    .statement(`clearTimeout(${s.signal("showTimeout")})`)
    .statement(`clearTimeout(${s.signal("hideTimeout")})`)
    .statement(s.set("hideTimeout", `setTimeout(() => { ${hidePopover(id)}; }, ${s.signal("closeDelay")})`))
    .build();
}

/** Zeiger oder Fokus im Content: geplantes Schließen abbrechen (die Karte bleibt offen) */
export function buildKeepOpenHandler(id: string): string {
  const s = hoverCardSignals(id);

  return `clearTimeout(${s.signal("hideTimeout")})`;
}

/** Escape (am Window): offene Karte sofort schließen */
export function buildEscapeHandler(id: string): string {
  const s = hoverCardSignals(id);
  const condition = `${s.signal("open")} && evt.key === 'Escape'`;

  return s.conditionalMultiAction(
    condition,
    `clearTimeout(${s.signal("showTimeout")})`,
    `clearTimeout(${s.signal("hideTimeout")})`,
    hidePopover(id)
  );
}

/** toggle-Event des Popovers: Signal `open` mit dem tatsächlichen Zustand abgleichen */
export function buildToggleHandler(id: string): string {
  const s = hoverCardSignals(id);

  return s.set("open", "evt.newState === 'open'");
}

/** Versatz entlang der Ausrichtungsachse als margin (nur bei start/end, positiv = nach innen) */
export function buildAlignOffsetStyle(side: AnchorSide, align: AnchorAlign, alignOffset: number): string {
  if (!alignOffset || align === "center") return "";

  const property = side === "top" || side === "bottom" ? "margin-left" : "margin-top";
  const value = align === "end" ? -alignOffset : alignOffset;

  return `${property}: ${value}px`;
}

const ORIGIN_X: Record<AnchorAlign, string> = { start: "left", center: "center", end: "right" };
const ORIGIN_Y: Record<AnchorAlign, string> = { start: "top", center: "center", end: "bottom" };

/**
 * CSS-Variable `--transform-origin` für `origin-(--transform-origin)`:
 * Die Animation startet an der dem Trigger zugewandten Kante (Base UI setzt die Variable selbst).
 */
export function buildTransformOriginStyle(side: AnchorSide, align: AnchorAlign): string {
  switch (side) {
    case "top":
      return `--transform-origin: ${ORIGIN_X[align]} bottom`;
    case "bottom":
      return `--transform-origin: ${ORIGIN_X[align]} top`;
    case "left":
      return `--transform-origin: right ${ORIGIN_Y[align]}`;
    case "right":
      return `--transform-origin: left ${ORIGIN_Y[align]}`;
  }
}
