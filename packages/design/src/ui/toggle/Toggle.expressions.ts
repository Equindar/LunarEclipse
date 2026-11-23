import { createSignals } from "../../utils/SignalManager";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import type { ToggleSignals, ToggleSize, ToggleVariant } from "./Toggle.types";

/**
 * Datastar-Expressions und Attribut-Bausteine des Toggles.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 */

export const DEFAULT_TOGGLE_VARIANT: ToggleVariant = "default";
export const DEFAULT_TOGGLE_SIZE: ToggleSize = "default";

/** Erzeugt eine Zufalls-ID im Format toggle_<8 Hex-Zeichen> */
export function generateToggleId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

  return `toggle_${hex}`;
}

/** Signal-Manager eines Toggles (Signal-Name = ID mit "-" zu "_") */
export const toggleSignals = (id: string, pressed = false) =>
  createSignals<ToggleSignals>(id, { pressed });

/** Click-Handler: Zustand umschalten, danach optional die Expression des Nutzers ausführen */
export function buildToggleClickHandler(id: string, onPressedChange?: string): string {
  const signals = toggleSignals(id);
  const statements = [signals.toggle("pressed")];

  if (onPressedChange) statements.push(onPressedChange);

  return statements.join("; ");
}

interface ToggleAttributeOptions {
  id: string;
  pressed: boolean;
  disabled?: boolean;
  onPressedChange?: string;
  /** Wert von data-slot aus den Nutzer-Attributen; ersetzt den Standard (kein doppeltes data-slot) */
  slot?: string | number | boolean;
}

/**
 * Standard-Attribute des Toggles.
 * aria-pressed und data-pressed werden serverseitig vorbelegt (kein Flackern vor dem Laden von Datastar)
 * und danach per data-attr an das Signal gebunden.
 */
export function buildToggleAttributes(options: ToggleAttributeOptions): HtmlAttributes {
  const signals = toggleSignals(options.id, options.pressed);
  const pressedRef = signals.signal("pressed");

  const attrs: HtmlAttributes = {
    id: options.id,
    type: "button",
    "data-slot": typeof options.slot === "string" && options.slot ? options.slot : "toggle",
    "data-signals": signals.dataSignals,
    "aria-pressed": options.pressed ? "true" : "false",
    "data-pressed": options.pressed ? true : undefined,
    // aria-pressed braucht die Strings "true"/"false" (ein boolesches data-attr würde das Attribut entfernen)
    "data-attr:aria-pressed": `${pressedRef} ? 'true' : 'false'`,
    "data-attr:data-pressed": pressedRef,
    "data-on:click": buildToggleClickHandler(options.id, options.onPressedChange),
  };

  // Nur bedingt setzen, damit ein Nutzerwert aus attributes nicht von undefined überschrieben wird
  if (options.disabled) {
    attrs.disabled = true;
    attrs["data-disabled"] = true;
  }

  return attrs;
}
