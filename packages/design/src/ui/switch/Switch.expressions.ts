import { newExpression } from "../../utils/DatastarExpression";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { createSignals } from "../../utils/SignalManager";
import type { SwitchSignals, SwitchSize } from "./Switch.types";

/**
 * Datastar-Expressions und Attribut-Bausteine des Switches.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 */

export const DEFAULT_SWITCH_SIZE: SwitchSize = "default";

/** Initialer Signal-State eines Switches */
export const switchInitialSignals: SwitchSignals = { checked: false };

/** Signal-Manager eines Switches (Signal-Name = ID mit "-" zu "_") */
export const switchSignals = (id: string, checked: boolean = switchInitialSignals.checked) =>
  createSignals<SwitchSignals>(id, { checked });

/** Zufalls-ID `switch_<8 Hex-Zeichen>` für Switches ohne eigene ID */
export function generateSwitchId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return `switch_${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

/** Standard-Attribute des Buttons: data-slot und data-size */
export function buildSwitchDataAttributes(size: SwitchSize = DEFAULT_SWITCH_SIZE): HtmlAttributes {
  return { "data-slot": "switch", "data-size": size };
}

/**
 * Zustands-Attribute im Initial-Render (ohne Datastar sichtbar):
 * `data-checked` bzw. `data-unchecked` (Präsenz-Attribute wie bei Base UI), beim Button zusätzlich `aria-checked`.
 */
export function buildSwitchStateAttributes(checked: boolean, withAria: boolean): HtmlAttributes {
  const attrs: HtmlAttributes = { "data-checked": checked, "data-unchecked": !checked };
  if (withAria) attrs["aria-checked"] = String(checked);
  return attrs;
}

/** data-attr-Objekt, das die Zustands-Attribute mit dem Signal synchron hält */
export function buildSwitchStateBinding(id: string, withAria: boolean): string {
  const checked = switchSignals(id).signal("checked");
  const entries = [`'data-checked': ${checked}`, `'data-unchecked': !${checked}`];
  if (withAria) entries.push(`'aria-checked': String(${checked})`);
  return `{${entries.join(", ")}}`;
}

/** Klick-Handler: Signal umschalten, danach optional die Expression des Nutzers ausführen */
export function buildSwitchToggleHandler(id: string, onCheckedChange?: string): string {
  return newExpression()
    .statement(switchSignals(id).toggle("checked"))
    .statement(onCheckedChange ?? "")
    .build();
}

/** Effekt der verborgenen Checkbox: Zustand aus dem Signal übernehmen */
export function buildSwitchInputEffect(id: string): string {
  return `el.checked = ${switchSignals(id).signal("checked")}`;
}
