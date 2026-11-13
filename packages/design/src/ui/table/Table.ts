import { cn } from "../../utils/cn";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import { buildTableCellAttributes, buildTableDataAttributes } from "./Table.expressions";
import type {
    TableArgs,
    TableBodyArgs,
    TableCaptionArgs,
    TableCellArgs,
    TableFooterArgs,
    TableHeadArgs,
    TableHeaderArgs,
    TablePartArgs,
    TableRowArgs,
    TableSlot,
} from "./Table.types";

/*
 * Klassen aus shadcn/ui (Base-Variante). Die Quelle verwendet Platzhalter-Klassen (cn-table*),
 * die konkreten Klassen stammen aus dem Style "vega".
 */
const tableContainerTw = tw`relative w-full overflow-x-auto`;
const tableTw = tw`w-full caption-bottom text-sm`;
const tableHeaderTw = tw`[&_tr]:border-b`;
const tableBodyTw = tw`[&_tr:last-child]:border-0`;
const tableFooterTw = tw`bg-muted/50 border-t font-medium [&>tr]:last:border-b-0`;
const tableRowTw = tw`hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors has-aria-expanded:bg-muted/50`;
const tableHeadTw = tw`text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap has-[[role=checkbox]]:pr-0`;
const tableCellTw = tw`p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0`;
const tableCaptionTw = tw`text-muted-foreground mt-4 text-sm`;

/**
 * Rendert ein Element einer Tabelle.
 * Nutzer-Attribute werden zuerst übernommen und von den Standard-Attributen überschrieben.
 */
function renderPart(
  tag: string,
  slot: TableSlot,
  baseClass: string,
  args: TablePartArgs,
  extra: HtmlAttributes = {},
): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...extra,
    ...buildTableDataAttributes(slot),
    class: cn(baseClass, args.class),
  };

  return `<${tag}${renderAttributes(attrs)}>${renderChildren(args.children)}</${tag}>`;
}

/** Table: Wrapper mit horizontalem Scrollen und darin das `<table>` */
export function Table(args: TableArgs = {}): string {
  const attrs: HtmlAttributes = { "data-slot": "table-container", class: tableContainerTw };

  return `<div${renderAttributes(attrs)}>${renderPart("table", "table", tableTw, args)}</div>`;
}

/** TableHeader: `<thead>` */
export function TableHeader(args: TableHeaderArgs = {}): string {
  return renderPart("thead", "table-header", tableHeaderTw, args);
}

/** TableBody: `<tbody>` */
export function TableBody(args: TableBodyArgs = {}): string {
  return renderPart("tbody", "table-body", tableBodyTw, args);
}

/** TableFooter: `<tfoot>` */
export function TableFooter(args: TableFooterArgs = {}): string {
  return renderPart("tfoot", "table-footer", tableFooterTw, args);
}

/** TableRow: `<tr>` */
export function TableRow(args: TableRowArgs = {}): string {
  return renderPart("tr", "table-row", tableRowTw, args);
}

/** TableHead: `<th>` */
export function TableHead(args: TableHeadArgs = {}): string {
  return renderPart("th", "table-head", tableHeadTw, args, buildTableCellAttributes(args, args.scope));
}

/** TableCell: `<td>` */
export function TableCell(args: TableCellArgs = {}): string {
  return renderPart("td", "table-cell", tableCellTw, args, buildTableCellAttributes(args));
}

/** TableCaption: `<caption>` */
export function TableCaption(args: TableCaptionArgs = {}): string {
  return renderPart("caption", "table-caption", tableCaptionTw, args);
}
