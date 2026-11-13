import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Werte des data-slot-Attributs der Teilkomponenten */
export type TableSlot =
  | "table-container"
  | "table"
  | "table-header"
  | "table-body"
  | "table-footer"
  | "table-row"
  | "table-head"
  | "table-cell"
  | "table-caption";

/** Gemeinsame Args aller Teilkomponenten */
export interface TablePartArgs {
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
  /** Inhalt der Komponente */
  children?: Children;
}

/** Table: rendert einen Wrapper mit Overflow (`table-container`) und darin das `<table>`. `class` und `attributes` gelten für das `<table>`, nicht für den Wrapper. */
export type TableArgs = TablePartArgs;

/** TableHeader: `<thead>` */
export type TableHeaderArgs = TablePartArgs;

/** TableBody: `<tbody>` */
export type TableBodyArgs = TablePartArgs;

/** TableFooter: `<tfoot>` */
export type TableFooterArgs = TablePartArgs;

/** TableRow: `<tr>`. Eine ausgewählte Zeile wird über `attributes: { "data-state": "selected" }` markiert. */
export type TableRowArgs = TablePartArgs;

/** TableCaption: `<caption>` (steht unterhalb der Tabelle) */
export type TableCaptionArgs = TablePartArgs;

/** Wert des scope-Attributs einer Kopfzelle */
export type TableHeadScope = "col" | "row" | "colgroup" | "rowgroup";

/** Zellen, die sich über mehrere Spalten oder Zeilen erstrecken können */
export interface TableCellSpanArgs extends TablePartArgs {
  /** Anzahl der Spalten, über die sich die Zelle erstreckt (colspan) */
  colSpan?: number;
  /** Anzahl der Zeilen, über die sich die Zelle erstreckt (rowspan) */
  rowSpan?: number;
}

/** TableHead: `<th>` */
export interface TableHeadArgs extends TableCellSpanArgs {
  /** scope-Attribut für Screenreader */
  scope?: TableHeadScope;
}

/** TableCell: `<td>` */
export type TableCellArgs = TableCellSpanArgs;
