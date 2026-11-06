import type { HtmlAttributes } from "./renderHtmlAttributes";

/**
 * Setzt `data-slot` auf den Standardwert der Komponente, lässt aber einen Wert aus `attributes`
 * diesen Standard ersetzen (so entsteht kein doppeltes `data-slot`).
 * Gibt immer ein neues Objekt zurück, die übergebenen `attributes` werden nicht verändert.
 */
export function withSlot(attributes: HtmlAttributes | undefined, slot: string): HtmlAttributes {
  return { ...attributes, "data-slot": attributes?.["data-slot"] ?? slot };
}
