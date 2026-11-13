import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import type { TableCellSpanArgs, TableHeadScope, TableSlot } from "./Table.types";

/**
 * Die Tabelle hat keine Datastar-Logik; diese Datei enthält nur Attribut-Bausteine.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 */

/** Standard-Attribut jeder Teilkomponente: data-slot */
export function buildTableDataAttributes(slot: TableSlot): HtmlAttributes {
  return { "data-slot": slot };
}

/**
 * colspan, rowspan und scope nur setzen, wenn sie angegeben sind.
 * Ein `undefined`-Wert würde sonst gleichnamige Nutzer-Attribute überschreiben.
 */
export function buildTableCellAttributes(args: TableCellSpanArgs, scope?: TableHeadScope): HtmlAttributes {
  const attrs: HtmlAttributes = {};
  if (args.colSpan !== undefined) attrs.colspan = args.colSpan;
  if (args.rowSpan !== undefined) attrs.rowspan = args.rowSpan;
  if (scope !== undefined) attrs.scope = scope;
  return attrs;
}
