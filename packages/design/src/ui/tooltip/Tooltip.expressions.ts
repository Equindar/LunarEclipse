import { newExpression } from "../../utils/DatastarExpression";
import { createSignals } from "../../utils/SignalManager";
import type { TooltipDirection, TooltipSide, TooltipSignals } from "./Tooltip.types";

/**
 * Datastar-Expressions und Attribut-Bausteine des Tooltips.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 */

/** Verzögerung ohne TooltipProvider (Standard von Base UI) */
export const FALLBACK_DELAY_MS = 600;

/** Verzögerung eines TooltipProvider ohne Angabe (Standard von shadcn) */
export const PROVIDER_DEFAULT_DELAY_MS = 0;

/** Initialer Signal-State eines Tooltips */
export const tooltipInitialSignals: TooltipSignals = {
  showTimeout: 0,
};

/** Signal-Manager eines Tooltips (Signal-Name = ID mit "-" zu "_") */
export const tooltipSignals = (tooltipId: string) =>
  createSignals<TooltipSignals>(tooltipId, tooltipInitialSignals);

/**
 * Popover per togglePopover(force) setzen. Anders als showPopover()/hidePopover() wirft diese
 * Methode keinen Fehler, wenn der Zustand schon erreicht ist.
 */
const setPopover = (tooltipId: string, open: boolean): string =>
  `document.getElementById(${JSON.stringify(tooltipId)}).togglePopover(${open})`;

/** Verzögerung als JS-Ausdruck: explizit, sonst vom nächsten TooltipProvider, sonst Fallback */
function buildDelayExpression(delay: number | undefined): string {
  if (delay !== undefined) return String(delay);

  return `+(el.closest('[data-slot="tooltip-provider"]')?.dataset.tooltipDelay ?? ${FALLBACK_DELAY_MS})`;
}

/** Hover/Fokus: wartende Anzeige abbrechen und den Tooltip nach der Verzögerung anzeigen */
export function buildShowHandler(tooltipId: string, delay: number | undefined): string {
  const s = tooltipSignals(tooltipId);

  return newExpression()
    .statement(`clearTimeout(${s.signal("showTimeout")})`)
    .statement(
      s.set("showTimeout", `setTimeout(() => { ${setPopover(tooltipId, true)}; }, ${buildDelayExpression(delay)})`)
    )
    .build();
}

/** Verlassen/Blur/Klick: wartende Anzeige abbrechen und den Tooltip ausblenden */
export function buildHideHandler(tooltipId: string): string {
  const s = tooltipSignals(tooltipId);

  return newExpression()
    .statement(`clearTimeout(${s.signal("showTimeout")})`)
    .statement(s.set("showTimeout", "0"))
    .statement(setPopover(tooltipId, false))
    .build();
}

/** Escape am Trigger: Tooltip ausblenden */
export function buildEscapeHandler(tooltipId: string): string {
  const s = tooltipSignals(tooltipId);

  return newExpression()
    .conditional(
      "evt.key === 'Escape'",
      `(${s.set("showTimeout", "0")}, ${setPopover(tooltipId, false)})`,
      "null"
    )
    .build();
}

/** `inline-start`/`inline-end` zu einer physischen Seite auflösen */
export function resolveSide(side: TooltipSide, dir: TooltipDirection): "top" | "bottom" | "left" | "right" {
  if (side === "inline-start") return dir === "rtl" ? "right" : "left";
  if (side === "inline-end") return dir === "rtl" ? "left" : "right";

  return side;
}

/** transform-origin passend zur Seite (die Animation wächst vom Trigger weg) */
export function getTransformOrigin(side: "top" | "bottom" | "left" | "right"): string {
  const origins = { top: "bottom", bottom: "top", left: "right", right: "left" } as const;

  return origins[side];
}

/** Versatz entlang der Ausrichtung als margin (waagerecht bei top/bottom, senkrecht bei left/right) */
export function getAlignOffsetStyle(side: "top" | "bottom" | "left" | "right", alignOffset: number): string {
  if (!alignOffset) return "";

  return side === "top" || side === "bottom" ? `margin-left: ${alignOffset}px` : `margin-top: ${alignOffset}px`;
}

/** Inline-Styles zusammenführen (leere Teile entfallen) */
export function joinStyles(...parts: Array<string | number | boolean | undefined>): string {
  return parts
    .filter((part): part is string => typeof part === "string" && part.trim() !== "")
    .map((part) => part.trim().replace(/;$/, ""))
    .join("; ");
}
