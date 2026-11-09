import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import type { FieldErrorItem, FieldLegendVariant, FieldOrientation } from "./Field.types";

/**
 * Field hat keine Datastar-Logik; diese Datei enthält nur Attribut-Bausteine und kleine Helfer.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 */

export const DEFAULT_FIELD_ORIENTATION: FieldOrientation = "vertical";
export const DEFAULT_FIELD_LEGEND_VARIANT: FieldLegendVariant = "legend";

/**
 * Ein `data-slot` aus den Nutzer-Attributen ersetzt den Standardwert
 * (wie in shadcn, wo `{...props}` nach `data-slot` kommt). So entsteht kein doppeltes Attribut,
 * und z. B. `data-slot="checkbox-group"` an einer FieldGroup greift die passenden Selektoren.
 */
export function resolveFieldSlot(slot: string, attributes?: HtmlAttributes): string {
  const custom = attributes?.["data-slot"];
  return typeof custom === "string" && custom !== "" ? custom : slot;
}

/** Standard-Attribut `data-slot` für einen Teil */
export function buildFieldSlotAttributes(slot: string, attributes?: HtmlAttributes): HtmlAttributes {
  return { "data-slot": resolveFieldSlot(slot, attributes) };
}

/** Standard-Attribute des Fields: role, data-slot und data-orientation */
export function buildFieldDataAttributes(
  orientation: FieldOrientation = DEFAULT_FIELD_ORIENTATION,
  attributes?: HtmlAttributes,
): HtmlAttributes {
  return {
    role: "group",
    ...buildFieldSlotAttributes("field", attributes),
    "data-orientation": orientation,
  };
}

/**
 * Setzt `data-invalid` bzw. `data-disabled` so, dass die Selektoren `data-[invalid=true]` und
 * `group-data-[disabled=true]` greifen. React rendert `data-invalid={true}` als `"true"`,
 * ein boolesches HTML-Attribut ohne Wert würde dagegen nicht matchen.
 * `value` (Arg) hat Vorrang vor einem Wert aus den Nutzer-Attributen; `false` und `undefined` entfernen das Attribut.
 */
export function applyFieldStateAttribute(
  attrs: HtmlAttributes,
  name: "data-invalid" | "data-disabled",
  value?: boolean,
): void {
  const state = value ?? attrs[name];
  if (state === true || state === "true") {
    attrs[name] = "true";
  } else {
    delete attrs[name];
  }
}

/**
 * Sammelt die Meldungen für FieldError: leere und fehlende Meldungen entfallen,
 * Duplikate werden entfernt (Reihenfolge des ersten Auftretens).
 */
export function collectFieldErrorMessages(errors?: FieldErrorItem[]): string[] {
  const messages = new Set<string>();
  for (const error of errors ?? []) {
    if (error?.message) messages.add(error.message);
  }
  return [...messages];
}
