import { cn } from "../../utils/cn";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { safeUrl } from "../../utils/safeUrl";
import { tw } from "../../utils/tw";
import { withSlot } from "../../utils/withSlot";
import { DEFAULT_TOC_LABEL, buildTableOfContentIndicatorExpression, buildTableOfContentLinkAttributes, buildTableOfContentSpyExpression, createTableOfContentId, tableOfContentSignals } from "./TableOfContent.expressions";
import { type TableOfContentArgs, type TableOfContentIndicatorArgs, type TableOfContentItemArgs, type TableOfContentLinkArgs, type TableOfContentLinkDepth, type TableOfContentListArgs, type TableOfContentTitleArgs } from "./TableOfContent.types";

const DEFAULT_LINK_DEPTH: TableOfContentLinkDepth = 1;

/**
 * Tailwind-Klassen des Inhaltsverzeichnisses.
 * Eigenentwicklung nach der API von shadcn.io/ui/TableOfContent (die Quelle war nicht zugänglich), Tokens wie in shadcn/ui.
 */
export const TableOfContentTw = tw`flex flex-col gap-3 text-sm`;
export const TableOfContentTitleTw = tw`font-medium text-foreground`;
export const TableOfContentListTw = tw`relative m-0 flex list-none flex-col border-l border-border p-0`;
export const TableOfContentItemTw = tw``;
export const TableOfContentLinkTw = tw`block rounded-sm py-1 pr-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 data-[active=true]:font-bold data-[active=true]:text-foreground`;
export const TableOfContentIndicatorTw = tw`pointer-events-none absolute -left-px w-0.5 rounded-full bg-primary transition-[top,height] duration-200 ease-out motion-reduce:transition-none`;

/** Einrückung je Stufe */
export const TableOfContentLinkDepthTw: Record<TableOfContentLinkDepth, string> = {
  1: tw`pl-4`,
  2: tw`pl-8`,
  3: tw`pl-12`,
  4: tw`pl-16`,
};

export function TableOfContentVariants(args: Pick<TableOfContentArgs, "class"> = {}): string {
  return cn(TableOfContentTw, args.class);
}

export function TableOfContentTitleVariants(args: Pick<TableOfContentTitleArgs, "class"> = {}): string {
  return cn(TableOfContentTitleTw, args.class);
}

export function TableOfContentListVariants(args: Pick<TableOfContentListArgs, "class"> = {}): string {
  return cn(TableOfContentListTw, args.class);
}

export function TableOfContentItemVariants(args: Pick<TableOfContentItemArgs, "class"> = {}): string {
  return cn(TableOfContentItemTw, args.class);
}

export function TableOfContentLinkVariants(args: Pick<TableOfContentLinkArgs, "depth" | "class"> = {}): string {
  return cn(TableOfContentLinkTw, TableOfContentLinkDepthTw[args.depth ?? DEFAULT_LINK_DEPTH], args.class);
}

export function TableOfContentIndicatorVariants(args: Pick<TableOfContentIndicatorArgs, "class"> = {}): string {
  return cn(TableOfContentIndicatorTw, args.class);
}

/**
 * Wurzel: `<nav>` mit Signal-State und Scroll-Spy (`data-init`).
 * Funktioniert nur mit geladenem Datastar; ohne Datastar bleiben die Links normale Anker.
 */
export function TableOfContent(args: TableOfContentArgs): string {
  const id = args.id || createTableOfContentId();

  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, "TableOfContent"),
    id,
    "aria-label": args.label ?? DEFAULT_TOC_LABEL,
    "data-signals": tableOfContentSignals(id).dataSignals,
    class: TableOfContentVariants({ class: args.class }),
  };

  // data-init erst nach data-signals setzen, damit das Signal beim Start existiert
  const spy = buildTableOfContentSpyExpression(id, args);
  if (spy) attrs["data-init"] = spy;

  return `<nav${renderAttributes(attrs)}>${renderChildren(args.children)}</nav>`;
}

/** Überschrift des Inhaltsverzeichnisses */
export function TableOfContentTitle(args: TableOfContentTitleArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, "TableOfContent-title"),
    class: TableOfContentTitleVariants({ class: args.class }),
  };

  return `<p${renderAttributes(attrs)}>${renderChildren(args.children)}</p>`;
}

/** Liste der Einträge (`<ul>`, `relative` als Bezug für den Indicator) */
export function TableOfContentList(args: TableOfContentListArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, "TableOfContent-list"),
    class: TableOfContentListVariants({ class: args.class }),
  };

  return `<ul${renderAttributes(attrs)}>${renderChildren(args.children)}</ul>`;
}

/** Eintrag der Liste (`<li>`) */
export function TableOfContentItem(args: TableOfContentItemArgs = {}): string {
  const classes = TableOfContentItemVariants({ class: args.class });

  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, "TableOfContent-item"),
    class: classes || undefined,
  };

  return `<li${renderAttributes(attrs)}>${renderChildren(args.children)}</li>`;
}

/** Link auf eine Überschrift. Aktiv (`data-active="true"`, `aria-current="location"`), solange die Überschrift im Band liegt. */
export function TableOfContentLink(args: TableOfContentLinkArgs): string {
  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, "TableOfContent-link"),
    href: safeUrl(`#${encodeURIComponent(args.targetId)}`),
    ...buildTableOfContentLinkAttributes(args.tocId, args.targetId),
    class: TableOfContentLinkVariants({ depth: args.depth, class: args.class }),
  };

  return `<a${renderAttributes(attrs)}>${renderChildren(args.children)}</a>`;
}

/**
 * Balken am linken Rand der Liste, der den aktiven Bereich markiert (`<li>`, nur dekorativ).
 * Gehört als Kind in die TocList.
 */
export function TableOfContentIndicator(args: TableOfContentIndicatorArgs): string {
  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, "TableOfContent-indicator"),
    "aria-hidden": "true",
    role: "presentation",
    style: "top: var(--TableOfContent-indicator-top, 0px); height: var(--TableOfContent-indicator-height, 0px);",
    "data-effect": buildTableOfContentIndicatorExpression(args.tocId),
    class: TableOfContentIndicatorVariants({ class: args.class }),
  };

  return `<li${renderAttributes(attrs)}></li>`;
}
