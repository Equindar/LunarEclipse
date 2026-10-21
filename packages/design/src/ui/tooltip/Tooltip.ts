import { buildAnchorStyle, buildPositionAnchorStyle } from "../../utils/AnchorStyle";
import { cn } from "../../utils/cn";
import { escapeHtml } from "../../utils/escapeHtml";
import { getAnchorPosition } from "../../utils/getAnchorPosition";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import {
    buildClickOutsideHandler,
    buildHideHandler,
    buildShowHandler,
    buildTouchEndHandler,
    buildTouchStartHandler,
    tooltipSignals,
} from "./Tooltip.expressions";
import type { TooltipContentArgs, TooltipTriggerArgs } from "./Tooltip.types";

const DEFAULT_DELAY_DURATION = 700;
const DEFAULT_SIDE_OFFSET = 4;

/**
 * Tailwind-Klassen für das Tooltip-Panel (wie Popover, aber kompakter).
 * pointer-events-none verhindert, dass der Tooltip das Hover des Triggers stört.
 */
export const tooltipContentTw = tw`rounded-md border bg-popover text-popover-foreground shadow-md outline-none px-3 py-1.5 text-sm pointer-events-none`;

export function tooltipContentVariants(args: Pick<TooltipContentArgs, "class"> = {}): string {
  return cn(tooltipContentTw, args.class);
}

/** Trigger, der beliebiges Markup umschließt (Hover, Fokus und Touch-and-hold) */
export function TooltipTrigger(args: TooltipTriggerArgs): string {
  const delayDuration = args.delayDuration || DEFAULT_DELAY_DURATION;

  const showHandler = buildShowHandler(args.tooltipId, delayDuration);
  const hideHandler = buildHideHandler(args.tooltipId);
  const touchStartHandler = buildTouchStartHandler(args.tooltipId);
  const touchEndHandler = buildTouchEndHandler(args.tooltipId);

  const signals = tooltipSignals(args.tooltipId);

  // TooltipID dient als Anchor-Name (geteilt mit dem Content)
  const anchorStyle = buildAnchorStyle(args.tooltipId);
  const style = anchorStyle ? `cursor: pointer; ${anchorStyle}` : "cursor: pointer;";

  const id = args.id ? ` id="${escapeHtml(args.id)}"` : "";
  const className = args.class ? ` class="${escapeHtml(args.class)}"` : "";

  return `<div${id} data-signals="${escapeHtml(signals.dataSignals)}" data-tooltip-id="${escapeHtml(args.tooltipId)}" data-on:mouseenter="${escapeHtml(showHandler)}" data-on:mouseleave="${escapeHtml(hideHandler)}" data-on:focus="${escapeHtml(showHandler)}" data-on:blur="${escapeHtml(hideHandler)}" data-on:touchstart="${escapeHtml(touchStartHandler)}" data-on:touchend="${escapeHtml(touchEndHandler)}" tabindex="0" style="${escapeHtml(style)}"${className}${renderAttributes(args.attributes)}>${renderChildren(args.children)}</div>`;
}

/** Tooltip-Panel (native Popover API, wie PopoverContent) */
export function TooltipContent(args: TooltipContentArgs): string {
  let contentClasses = tooltipContentVariants(args);

  // Klick-außerhalb-Handler zum Schließen auf Mobilgeräten; Trigger werden über data-tooltip-id erkannt
  const triggerSelector = `[data-tooltip-id="${args.id}"]`;
  const clickOutsideHandler = buildClickOutsideHandler(args.id, triggerSelector);

  let positioningStyle: string;

  if (args.useAnchor) {
    // Content-ID als Position-Anchor (entspricht der tooltipId des Triggers)
    positioningStyle = `position: absolute; ${buildPositionAnchorStyle(args.id)}; z-index: 50; `;

    if (args.side || args.align) {
      const sideOffset = args.sideOffset || DEFAULT_SIDE_OFFSET;
      positioningStyle += `${getAnchorPosition(args.side, args.align, sideOffset)};`;
    }

    contentClasses += " anchor-positioned";
  } else {
    positioningStyle = "position: absolute; z-index: 50;";
  }

  return `<div id="${escapeHtml(args.id)}" popover="auto" class="${escapeHtml(contentClasses)}" style="${escapeHtml(positioningStyle)}" data-on:click__outside="${escapeHtml(clickOutsideHandler)}"${renderAttributes(args.attributes)}>${renderChildren(args.children)}</div>`;
}
