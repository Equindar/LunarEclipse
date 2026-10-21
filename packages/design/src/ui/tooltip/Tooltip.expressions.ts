import { buildConditional } from "../../utils/buildConditional";
import { newExpression } from "../../utils/DatastarExpression";
import { createSignals } from "../../utils/SignalManager";
import type { TooltipSignals } from "./Tooltip.types";

/**
 * Datastar-Expressions des Tooltips (ersetzt TooltipHandler aus expressions.go).
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 */

export const DEFAULT_TOUCH_HOLD_MS = 500;

/** Initialer Signal-State eines Tooltips */
export const tooltipInitialSignals: TooltipSignals = {
  open: false,
  showTimeout: "",
  hideTimeout: "",
  touchHeld: false,
  touchTimer: "",
};

/** Signal-Manager eines Tooltips (Signal-Name = ID mit "-" → "_") */
export const tooltipSignals = (tooltipId: string) =>
  createSignals<TooltipSignals>(tooltipId, tooltipInitialSignals);

const showPopover = (tooltipId: string): string => `document.getElementById('${tooltipId}').showPopover()`;
const hidePopover = (tooltipId: string): string => `document.getElementById('${tooltipId}').hidePopover()`;

/** Hover/Focus-Handler: Tooltip nach delayMs anzeigen */
export function buildShowHandler(tooltipId: string, delayMs: number): string {
  return `setTimeout(() => { ${showPopover(tooltipId)}; }, ${delayMs})`;
}

/** Handler zum Ausblenden des Tooltips */
export function buildHideHandler(tooltipId: string): string {
  return hidePopover(tooltipId);
}

/** Handler zum sofortigen Anzeigen: Timeouts löschen und open = true setzen */
export function buildInstantShowHandler(tooltipId: string): string {
  const s = tooltipSignals(tooltipId);

  return newExpression()
    .statement(`clearTimeout(${s.signal("hideTimeout")})`)
    .statement(`clearTimeout(${s.signal("showTimeout")})`)
    .statement(s.set("hideTimeout", "null"))
    .statement(s.set("showTimeout", "null"))
    .statement(s.set("open", "true"))
    .build();
}

/** Handler zum verzögerten Ausblenden */
export function buildDelayedHideHandler(tooltipId: string, delayMs: number): string {
  const s = tooltipSignals(tooltipId);

  return newExpression()
    .statement(`clearTimeout(${s.signal("showTimeout")})`)
    .statement(s.set("showTimeout", "null"))
    .statement(s.set("hideTimeout", `setTimeout(() => { ${s.set("open", "false")}; }, ${delayMs})`))
    .build();
}

/** Touch-Start (Mobile, Touch-and-hold) */
export function buildTouchStartHandler(tooltipId: string, touchHoldMs = DEFAULT_TOUCH_HOLD_MS): string {
  const s = tooltipSignals(tooltipId);
  const holdMs = touchHoldMs || DEFAULT_TOUCH_HOLD_MS;

  return newExpression()
    .statement("evt.preventDefault()") // verhindert Textauswahl bei langem Druck
    .statement(`clearTimeout(${s.signal("touchTimer")})`)
    .statement(
      s.set(
        "touchTimer",
        `setTimeout(() => { ${s.set("touchHeld", "true")}; ${showPopover(tooltipId)}; }, ${holdMs})`
      )
    )
    .build();
}

/** Touch-Ende: Timer abbrechen und ausblenden, falls nicht lange genug gehalten */
export function buildTouchEndHandler(tooltipId: string): string {
  const s = tooltipSignals(tooltipId);

  return newExpression()
    .statement(`clearTimeout(${s.signal("touchTimer")})`)
    .statement(s.set("touchTimer", "null"))
    .conditional(`!${s.signal("touchHeld")}`, hidePopover(tooltipId), "null")
    .build();
}

/** Klick außerhalb: per Touch geöffneten Tooltip schließen */
export function buildClickOutsideHandler(tooltipId: string, triggerSelector: string): string {
  const s = tooltipSignals(tooltipId);
  const condition = `${s.signal("touchHeld")} && !evt.target.closest('${triggerSelector}')`;

  // Komma-Operator, um mehrere Ausdrücke im Ternary-Zweig zu verbinden
  const action = `(${s.set("touchHeld", "false")}, ${hidePopover(tooltipId)})`;

  return buildConditional(condition, action, "null");
}
