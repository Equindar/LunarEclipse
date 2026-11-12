import { escapeHtml } from "../../utils/escapeHtml";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes } from "../../utils/renderHtmlAttributes";
import { safeUrl } from "../../utils/safeUrl";
import { tw } from "../../utils/tw";
import {
    buildBreadcrumbSlotAttributes,
    chevronRightIcon,
    DEFAULT_BREADCRUMB_LABEL,
    DEFAULT_ELLIPSIS_LABEL,
    ellipsisIcon,
    mergeBreadcrumbAttributes,
} from "./Breadcrumb.expressions";
import type {
    BreadcrumbArgs,
    BreadcrumbEllipsisArgs,
    BreadcrumbItemArgs,
    BreadcrumbLinkArgs,
    BreadcrumbListArgs,
    BreadcrumbPageArgs,
    BreadcrumbSeparatorArgs,
} from "./Breadcrumb.types";

/*
 * Klassen aus shadcn/ui (Base-Variante). Die Quelle verwendet Platzhalter-Klassen (cn-breadcrumb-*),
 * die konkreten Klassen stammen aus dem Style "vega".
 */
const breadcrumbListTw = tw`flex flex-wrap items-center gap-1.5 text-sm wrap-break-word text-muted-foreground sm:gap-2.5`;
const breadcrumbItemTw = tw`inline-flex items-center gap-1.5`;
const breadcrumbLinkTw = tw`transition-colors hover:text-foreground`;
const breadcrumbPageTw = tw`font-normal text-foreground`;
const breadcrumbSeparatorTw = tw`[&>svg]:size-3.5`;
const breadcrumbEllipsisTw = tw`flex size-5 items-center justify-center [&>svg]:size-4`;

/**
 * Wurzelelement `<nav>`. Das aria-label kann über `attributes` ersetzt werden
 * (in der Quelle überschreiben die Props ebenfalls das Standard-Label).
 */
export function Breadcrumb(args: BreadcrumbArgs = {}): string {
  const attrs = mergeBreadcrumbAttributes(
    args.attributes,
    { ...buildBreadcrumbSlotAttributes("breadcrumb") },
    args.class,
  );
  if (args.attributes?.["aria-label"] === undefined) attrs["aria-label"] = DEFAULT_BREADCRUMB_LABEL;

  return `<nav${renderAttributes(attrs)}>${renderChildren(args.children)}</nav>`;
}

/** Geordnete Liste der Einträge */
export function BreadcrumbList(args: BreadcrumbListArgs = {}): string {
  const attrs = mergeBreadcrumbAttributes(
    args.attributes,
    buildBreadcrumbSlotAttributes("breadcrumb-list"),
    breadcrumbListTw,
    args.class,
  );

  return `<ol${renderAttributes(attrs)}>${renderChildren(args.children)}</ol>`;
}

/** Einzelner Eintrag der Liste */
export function BreadcrumbItem(args: BreadcrumbItemArgs = {}): string {
  const attrs = mergeBreadcrumbAttributes(
    args.attributes,
    buildBreadcrumbSlotAttributes("breadcrumb-item"),
    breadcrumbItemTw,
    args.class,
  );

  return `<li${renderAttributes(attrs)}>${renderChildren(args.children)}</li>`;
}

/**
 * Link auf eine übergeordnete Ebene. Die Quelle bietet `render` (Base UI) bzw. `asChild` (Radix) für eigene
 * Link-Komponenten. Im Port gibt es dafür `href` und `attributes` (z. B. für Router-Attribute).
 */
export function BreadcrumbLink(args: BreadcrumbLinkArgs = {}): string {
  const attrs = mergeBreadcrumbAttributes(
    args.attributes,
    buildBreadcrumbSlotAttributes("breadcrumb-link"),
    breadcrumbLinkTw,
    args.class,
  );
  if (args.href !== undefined) attrs.href = safeUrl(args.href);

  return `<a${renderAttributes(attrs)}>${renderChildren(args.children)}</a>`;
}

/** Aktuelle Seite: nicht klickbar, mit aria-current="page" */
export function BreadcrumbPage(args: BreadcrumbPageArgs = {}): string {
  const attrs = mergeBreadcrumbAttributes(
    args.attributes,
    {
      ...buildBreadcrumbSlotAttributes("breadcrumb-page"),
      role: "link",
      "aria-disabled": "true",
      "aria-current": "page",
    },
    breadcrumbPageTw,
    args.class,
  );

  return `<span${renderAttributes(attrs)}>${renderChildren(args.children)}</span>`;
}

/** Trenner zwischen zwei Einträgen; ohne `children` wird ein Chevron gerendert */
export function BreadcrumbSeparator(args: BreadcrumbSeparatorArgs = {}): string {
  const attrs = mergeBreadcrumbAttributes(
    args.attributes,
    {
      ...buildBreadcrumbSlotAttributes("breadcrumb-separator"),
      role: "presentation",
      "aria-hidden": "true",
    },
    breadcrumbSeparatorTw,
    args.class,
  );
  const content = args.children !== undefined ? renderChildren(args.children) : chevronRightIcon;

  return `<li${renderAttributes(attrs)}>${content}</li>`;
}

/** Platzhalter für eingeklappte Ebenen, mit Text für Screenreader */
export function BreadcrumbEllipsis(args: BreadcrumbEllipsisArgs = {}): string {
  const attrs = mergeBreadcrumbAttributes(
    args.attributes,
    {
      ...buildBreadcrumbSlotAttributes("breadcrumb-ellipsis"),
      role: "presentation",
      "aria-hidden": "true",
    },
    breadcrumbEllipsisTw,
    args.class,
  );
  const label = escapeHtml(args.label ?? DEFAULT_ELLIPSIS_LABEL);

  return `<span${renderAttributes(attrs)}>${ellipsisIcon}<span class="sr-only">${label}</span></span>`;
}
