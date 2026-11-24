import { buildAnchorStyle, buildPositionAnchorStyle } from "../../utils/AnchorStyle";
import { cn } from "../../utils/cn";
import { escapeHtml } from "../../utils/escapeHtml";
import { getAnchorPosition } from "../../utils/getAnchorPosition";
import { renderChildren } from "../../utils/renderChildren";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { renderAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import { withSlot } from "../../utils/withSlot";
import {
    PROVIDER_DEFAULT_DELAY_MS,
    buildEscapeHandler,
    buildHideHandler,
    buildShowHandler,
    getAlignOffsetStyle,
    getTransformOrigin,
    joinStyles,
    resolveSide,
    tooltipSignals,
} from "./Tooltip.expressions";
import type {
    TooltipArgs,
    TooltipContentArgs,
    TooltipProviderArgs,
    TooltipTriggerArgs,
} from "./Tooltip.types";

const DEFAULT_SIDE_OFFSET = 4;

/**
 * Tailwind-Klassen des Tooltip-Panels (shadcn, Stil vega, `cn-tooltip-content` aufgelöst).
 * Anpassungen für die native Popover API:
 * - `open:` statt `data-open:` (Tailwind v4: greift bei :popover-open), `open:inline-flex` statt `inline-flex`,
 *   weil ein gesetztes `display` sonst das `display: none` des geschlossenen Popovers überschreibt
 * - `overflow-visible`, damit der Pfeil nicht abgeschnitten wird (Popover-Standard ist `overflow: auto`)
 * - ohne Exit-Animationen (`data-closed:*`), die native Popover API kennt keinen Closed-Zustand
 */
const tooltipContentTw = tw`z-50 w-fit max-w-xs origin-(--transform-origin) overflow-visible bg-foreground text-background open:animate-in open:fade-in-0 open:zoom-in-95 data-[side=bottom]:open:slide-in-from-top-2 data-[side=left]:open:slide-in-from-right-2 data-[side=right]:open:slide-in-from-left-2 data-[side=top]:open:slide-in-from-bottom-2 data-[side=inline-start]:open:slide-in-from-right-2 data-[side=inline-end]:open:slide-in-from-left-2 open:inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs has-data-[slot=kbd]:pr-1.5 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm`;

/**
 * Tailwind-Klassen des Pfeils (shadcn: size-2.5 rotate-45 rounded-[2px] bg-foreground).
 * Die Position kommt je Seite und Ausrichtung aus tooltipArrowSideTw und tooltipArrowAlignTw (bei Base UI übernimmt das der Positioner).
 */
const tooltipArrowTw = tw`pointer-events-none absolute z-50 size-2.5 rotate-45 rounded-xs bg-foreground fill-foreground`;

/** Pfeil-Position je physischer Seite: Mittelpunkt 2px innerhalb der Kante des Panels */
const tooltipArrowSideTw: Record<"top" | "bottom" | "left" | "right", string> = {
  top: tw`bottom-0 translate-y-[calc(50%-2px)]`,
  bottom: tw`top-0 translate-y-[calc(-50%+2px)]`,
  left: tw`right-0 translate-x-[calc(50%-2px)]`,
  right: tw`left-0 translate-x-[calc(-50%+2px)]`,
};

/**
 * Pfeil-Position entlang der Kante je Ausrichtung des Panels
 * (`horizontal` bei side=top/bottom, `vertical` bei side=left/right).
 */
const tooltipArrowAlignTw: Record<"start" | "center" | "end", { horizontal: string; vertical: string }> = {
  start: { horizontal: tw`left-3`, vertical: tw`top-2` },
  center: { horizontal: tw`left-1/2 -translate-x-1/2`, vertical: tw`top-1/2 -translate-y-1/2` },
  end: { horizontal: tw`right-3`, vertical: tw`bottom-2` },
};

export function tooltipContentVariants(args: Pick<TooltipContentArgs, "class"> = {}): string {
  return cn(tooltipContentTw, args.class);
}

/** Klassen des Pfeils für Seite und Ausrichtung des Panels */
export function tooltipArrowVariants(
  side: "top" | "bottom" | "left" | "right",
  align: "start" | "center" | "end"
): string {
  const alignClasses =
    side === "top" || side === "bottom" ? tooltipArrowAlignTw[align].horizontal : tooltipArrowAlignTw[align].vertical;

  return cn(tooltipArrowTw, tooltipArrowSideTw[side], alignClasses);
}

/**
 * Gruppiert Tooltips und gibt ihnen eine gemeinsame Standard-Verzögerung.
 * Ohne eigenes Layout (`display: contents`). Trigger ohne eigenes `delay` lesen den Wert zur Laufzeit.
 */
export function TooltipProvider(args: TooltipProviderArgs = {}): string {
  const attrs: HtmlAttributes = withSlot(args.attributes, "tooltip-provider");

  attrs["data-tooltip-delay"] = args.delay ?? PROVIDER_DEFAULT_DELAY_MS;
  attrs.class = cn("contents", args.class);

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Wurzel eines Tooltips: umschließt Trigger und Content, ohne eigenes Layout (`display: contents`) */
export function Tooltip(args: TooltipArgs = {}): string {
  const attrs: HtmlAttributes = withSlot(args.attributes, "tooltip");

  if (args.id) attrs.id = args.id;
  attrs.class = cn("contents", args.class);

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Trigger, der beliebiges Markup umschließt (Hover und Fokus, Escape und Klick blenden aus) */
export function TooltipTrigger(args: TooltipTriggerArgs): string {
  const signals = tooltipSignals(args.tooltipId);
  const showHandler = buildShowHandler(args.tooltipId, args.delay);
  const hideHandler = buildHideHandler(args.tooltipId);

  const attrs: HtmlAttributes = withSlot(args.attributes, "tooltip-trigger");

  if (args.id) attrs.id = args.id;
  if (args.focusable) attrs.tabindex = 0;

  attrs.class = cn("inline-flex", args.class);
  attrs["data-signals"] = signals.dataSignals;
  attrs["data-tooltip-id"] = args.tooltipId;
  attrs["aria-describedby"] = args.tooltipId;

  // Die TooltipID dient als Anchor-Name (geteilt mit dem Content)
  attrs.style = joinStyles(buildAnchorStyle(args.tooltipId), attrs.style);

  // focusin/focusout statt focus/blur: sie bubblen, so greift der Handler auch bei fokussierbaren Kindern
  attrs["data-on:mouseenter"] = showHandler;
  attrs["data-on:mouseleave"] = hideHandler;
  attrs["data-on:focusin"] = showHandler;
  attrs["data-on:focusout"] = hideHandler;
  attrs["data-on:click"] = hideHandler;
  attrs["data-on:keydown"] = buildEscapeHandler(args.tooltipId);

  return `<span${renderAttributes(attrs)}>${renderChildren(args.children)}</span>`;
}

/** Tooltip-Panel (native Popover API, CSS Anchor Positioning) mit Pfeil */
export function TooltipContent(args: TooltipContentArgs): string {
  const requestedSide = args.side ?? "top";
  const align = args.align ?? "center";
  const sideOffset = args.sideOffset ?? DEFAULT_SIDE_OFFSET;
  const side = resolveSide(requestedSide, args.dir ?? "ltr");

  const attrs: HtmlAttributes = withSlot(args.attributes, "tooltip-content");

  attrs.id = args.id;
  // "manual" statt "auto": ein Tooltip soll geöffnete Popover, Dialoge oder Menüs nicht schliessen
  attrs.popover = "manual";
  attrs.role = "tooltip";
  attrs.class = tooltipContentVariants(args);
  attrs["data-side"] = requestedSide;
  attrs["data-align"] = align;

  attrs.style = joinStyles(
    "inset: auto",
    "margin: 0",
    "position: absolute",
    buildPositionAnchorStyle(args.id),
    "z-index: 50",
    getAnchorPosition(side, align, sideOffset),
    getAlignOffsetStyle(side, args.alignOffset ?? 0),
    `--transform-origin: ${getTransformOrigin(side)}`,
    attrs.style
  );

  const arrow = `<div data-slot="tooltip-arrow" class="${escapeHtml(tooltipArrowVariants(side, align))}"></div>`;

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}${arrow}</div>`;
}
