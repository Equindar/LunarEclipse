import { buildAnchorStyle, buildPositionAnchorStyle } from "../../utils/AnchorStyle";
import { cn } from "../../utils/cn";
import { getAnchorPosition } from "../../utils/getAnchorPosition";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { safeUrl } from "../../utils/safeUrl";
import { tw } from "../../utils/tw";
import {
    buildAlignOffsetStyle,
    buildEscapeHandler,
    buildFocusOpenHandler,
    buildHoverOpenHandler,
    buildKeepOpenHandler,
    buildScheduleHideHandler,
    buildToggleHandler,
    buildTransformOriginStyle,
    DEFAULT_ALIGN,
    DEFAULT_ALIGN_OFFSET,
    DEFAULT_CLOSE_DELAY,
    DEFAULT_OPEN_DELAY,
    DEFAULT_SIDE,
    DEFAULT_SIDE_OFFSET,
    hoverCardAnchorName,
    hoverCardContentDomId,
    hoverCardSignals,
    normalizeDelay,
} from "./HoverCard.expressions";
import type {
    HoverCardArgs,
    HoverCardContentArgs,
    HoverCardTriggerArgs,
} from "./HoverCard.types";

/**
 * Das Root rendert in shadcn kein eigenes Element. Hier ist es ein Wrapper mit display: contents,
 * der den Signal-State (data-signals) trägt und das Layout nicht beeinflusst.
 */
const hoverCardTw = tw`contents`;

/**
 * Klassen des Karten-Contents (shadcn/ui, Base-Variante).
 * Die Quelle verwendet Platzhalter-Klassen (cn-hover-card-content*), die konkreten Klassen stammen aus dem Style "vega".
 * Die logischen Seiten (data-[side=inline-start|inline-end]) entfallen, weil side nur top, bottom, left und right kennt.
 */
const hoverCardContentTw = tw`z-50 origin-(--transform-origin) outline-hidden data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 bg-popover text-popover-foreground w-64 rounded-lg p-4 text-sm shadow-md ring-1 duration-100`;

export function hoverCardContentVariants(args: Pick<HoverCardContentArgs, "class"> = {}): string {
  return cn(hoverCardContentTw, args.class);
}

/** Inline-Styles zusammensetzen, ein `style` aus den Nutzer-Attributen wird angehängt (statt ersetzt) */
function joinStyles(parts: string[], userStyle: HtmlAttributes[string]): string {
  const extra = typeof userStyle === "string" ? userStyle : "";

  return [...parts, extra]
    .map((part) => part.trim().replace(/;$/, ""))
    .filter(Boolean)
    .join("; ");
}

/**
 * Hover Card (Wurzel): hält den Signal-State und umschließt Trigger und Content.
 * Nutzer-Attribute werden zuerst übernommen und von den Standard-Attributen überschrieben.
 */
export function HoverCard(args: HoverCardArgs): string {
  const signals = hoverCardSignals(args.id);

  const attrs: HtmlAttributes = {
    ...args.attributes,
    "data-slot": "hover-card",
    "data-signals": signals.dataSignals,
    class: cn(hoverCardTw, args.class),
  };

  return `<span${renderAttributes(attrs)}>${renderChildren(args.children)}</span>`;
}

/**
 * Trigger: in shadcn ein `<a>`. Öffnet die Karte beim Hover (nach `delay`) und sofort bei Fokus.
 * Mit `asChild` ein `<span>`-Wrapper für beliebiges Markup (z. B. einen Button).
 */
export function HoverCardTrigger(args: HoverCardTriggerArgs): string {
  const signals = hoverCardSignals(args.id);
  const delay = normalizeDelay(args.delay, DEFAULT_OPEN_DELAY);
  const closeDelay = normalizeDelay(args.closeDelay, DEFAULT_CLOSE_DELAY);

  const attrs: HtmlAttributes = {
    ...args.attributes,
    "data-slot": "hover-card-trigger",
    // Anchor-Name geteilt mit dem Content (CSS Anchor Positioning)
    style: joinStyles([buildAnchorStyle(hoverCardAnchorName(args.id))], args.attributes?.style),
    "data-attr:data-popup-open": signals.signal("open"),
    "data-on:mouseenter": buildHoverOpenHandler(args.id, delay, closeDelay),
    "data-on:mouseleave": buildScheduleHideHandler(args.id),
    "data-on:focusin": buildFocusOpenHandler(args.id, closeDelay),
    "data-on:focusout": buildScheduleHideHandler(args.id),
  };

  if (args.class) attrs.class = args.class;

  if (!args.asChild) {
    // Ohne href ist ein `<a>` nicht fokussierbar, deshalb tabindex
    if (args.href !== undefined) attrs.href = safeUrl(args.href);
    else attrs.tabindex = 0;
  }

  const tag = args.asChild ? "span" : "a";

  return `<${tag}${renderAttributes(attrs)}>${renderChildren(args.children)}</${tag}>`;
}

/**
 * Karten-Inhalt: natives Popover (popover="manual") mit CSS Anchor Positioning.
 * Bleibt offen, solange Zeiger oder Fokus im Content sind; Escape schließt.
 */
export function HoverCardContent(args: HoverCardContentArgs): string {
  const side = args.side ?? DEFAULT_SIDE;
  const align = args.align ?? DEFAULT_ALIGN;
  const sideOffset = args.sideOffset ?? DEFAULT_SIDE_OFFSET;
  const alignOffset = args.alignOffset ?? DEFAULT_ALIGN_OFFSET;

  const keepOpen = buildKeepOpenHandler(args.id);
  const scheduleHide = buildScheduleHideHandler(args.id);

  const style = joinStyles(
    [
      "position: absolute",
      buildPositionAnchorStyle(hoverCardAnchorName(args.id)),
      getAnchorPosition(side, align, sideOffset),
      buildAlignOffsetStyle(side, align, alignOffset),
      buildTransformOriginStyle(side, align),
    ],
    args.attributes?.style
  );

  const attrs: HtmlAttributes = {
    ...args.attributes,
    id: hoverCardContentDomId(args.id),
    "data-slot": "hover-card-content",
    "data-side": side,
    "data-align": align,
    popover: "manual",
    class: hoverCardContentVariants({ class: args.class }),
    style,
    "data-on:toggle": buildToggleHandler(args.id),
    "data-on:mouseenter": keepOpen,
    "data-on:mouseleave": scheduleHide,
    "data-on:focusin": keepOpen,
    "data-on:focusout": scheduleHide,
    "data-on:keydown__window": buildEscapeHandler(args.id),
  };

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}
