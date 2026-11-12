import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import type {
    InputGroupAddonAlign,
    InputGroupButtonSize,
    InputGroupButtonType,
    InputGroupButtonVariant,
} from "./InputGroup.types";

/**
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 * Enthält die Attribut-Bausteine und den einzigen Datastar-Handler (Fokus beim Klick auf ein Addon).
 */

export const DEFAULT_ADDON_ALIGN: InputGroupAddonAlign = "inline-start";
export const DEFAULT_BUTTON_SIZE: InputGroupButtonSize = "xs";
export const DEFAULT_BUTTON_VARIANT: InputGroupButtonVariant = "ghost";
export const DEFAULT_BUTTON_TYPE: InputGroupButtonType = "button";

/** Wert von data-slot am Eingabefeld; darauf zielen die Fokus- und Fehler-Selektoren der Gruppe */
export const INPUT_GROUP_CONTROL_SLOT = "input-group-control";

/**
 * Klick auf ein Addon fokussiert das Eingabefeld, außer der Klick traf einen Button.
 * Die Vorlage sucht nur nach "input"; hier wird auch "textarea" gefunden, damit Addons
 * von Textfeld-Gruppen (block-start, block-end) ebenfalls fokussieren.
 */
export function buildAddonFocusHandler(): string {
  return "evt.target.closest('button') ? void 0 : el.parentElement?.querySelector('input, textarea')?.focus()";
}

/** Standard-Attribute der Gruppe */
export function buildInputGroupAttributes(): HtmlAttributes {
  return { "data-slot": "input-group", role: "group" };
}

/** Standard-Attribute eines Addons: role, data-slot, data-align und der Fokus-Handler */
export function buildInputGroupAddonAttributes(align: InputGroupAddonAlign = DEFAULT_ADDON_ALIGN): HtmlAttributes {
  return {
    role: "group",
    "data-slot": "input-group-addon",
    "data-align": align,
    "data-on:click": buildAddonFocusHandler(),
  };
}

/** Standard-Attribute des Buttons: type und data-size */
export function buildInputGroupButtonAttributes(
  size: InputGroupButtonSize = DEFAULT_BUTTON_SIZE,
  type: InputGroupButtonType = DEFAULT_BUTTON_TYPE
): HtmlAttributes {
  return { type, "data-size": size };
}

/** data-slot für Input und Textarea der Gruppe */
export function buildInputGroupControlAttributes(): HtmlAttributes {
  return { "data-slot": INPUT_GROUP_CONTROL_SLOT };
}
