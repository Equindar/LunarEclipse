import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import type { ItemMediaVariant, ItemSize, ItemVariant } from "./Item.types";

/**
 * Das Item hat keine Datastar-Logik; diese Datei enthält nur die Attribut-Bausteine.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 */

export const DEFAULT_ITEM_VARIANT: ItemVariant = "default";
export const DEFAULT_ITEM_SIZE: ItemSize = "default";
export const DEFAULT_ITEM_MEDIA_VARIANT: ItemMediaVariant = "default";

/** Werte von data-slot der Teilkomponenten */
export type ItemSlot =
  | "item"
  | "item-group"
  | "item-separator"
  | "item-media"
  | "item-content"
  | "item-title"
  | "item-description"
  | "item-actions"
  | "item-header"
  | "item-footer";

/** Nur data-slot (Teilkomponenten ohne weitere Zustände) */
export function buildItemSlotAttributes(slot: ItemSlot): HtmlAttributes {
  return { "data-slot": slot };
}

/**
 * Standard-Attribute des Items: data-slot, data-variant und data-size.
 * Die Teilkomponenten greifen über group-data-[size=...]/item auf data-size zu.
 */
export function buildItemDataAttributes(
  variant: ItemVariant = DEFAULT_ITEM_VARIANT,
  size: ItemSize = DEFAULT_ITEM_SIZE,
): HtmlAttributes {
  return { "data-slot": "item", "data-variant": variant, "data-size": size };
}

/** Standard-Attribute des Medienbereichs: data-slot und data-variant */
export function buildItemMediaDataAttributes(variant: ItemMediaVariant = DEFAULT_ITEM_MEDIA_VARIANT): HtmlAttributes {
  return { "data-slot": "item-media", "data-variant": variant };
}

/** Die Gruppe ist wie in der Quelle eine Liste (role="list") */
export function buildItemGroupAttributes(): HtmlAttributes {
  return { "data-slot": "item-group", role: "list" };
}

/**
 * Attribute des Separators (horizontal).
 * Die Quelle nutzt den Separator von Base UI mit den Klassen data-horizontal:h-px und data-horizontal:w-full.
 * Damit diese greifen, werden data-orientation und das boolesche data-horizontal gerendert.
 */
export function buildItemSeparatorAttributes(): HtmlAttributes {
  return {
    "data-slot": "item-separator",
    role: "separator",
    "aria-orientation": "horizontal",
    "data-orientation": "horizontal",
    "data-horizontal": true,
  };
}
