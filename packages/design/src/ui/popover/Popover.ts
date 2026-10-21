
import { buildAnchorStyle, buildPositionAnchorStyle } from "../../utils/AnchorStyle";
import { cn } from "../../utils/cn";
import { escapeHtml } from "../../utils/escapeHtml";
import { getAnchorPosition } from "../../utils/getAnchorPosition";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import type { PopoverContentArgs, PopoverTriggerArgs } from "./Popover.types";

const DEFAULT_SIDE_OFFSET = 8;

/** Tailwind-Klassen für das Popover-Panel (shadcn/ui-Stil mit nativer Popover API) */
export const popoverContentTw = tw`w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none`;

export function popoverContentVariants(args: Pick<PopoverContentArgs, "class"> = {}): string {
  return cn(popoverContentTw, args.class);
}

/* Expressions (ersetzt PopoverHandler aus expressions.go) */

/** Datastar-Expression zum Umschalten des Popovers */
export function buildToggleHandler(popoverId: string): string {
  return `document.getElementById('${popoverId}').togglePopover()`;
}

/** Trigger, der beliebiges Markup umschließt und das Popover per Datastar umschaltet */
export function PopoverTrigger(args: PopoverTriggerArgs): string {
  const anchorStyle = buildAnchorStyle(args.popoverId);
  const style = anchorStyle ? `cursor: pointer; ${anchorStyle}` : "cursor: pointer;";

  const id = args.id ? ` id="${escapeHtml(args.id)}"` : "";
  const className = args.class ? ` class="${escapeHtml(args.class)}"` : "";

  return `<div${id} data-on:click="${escapeHtml(buildToggleHandler(args.popoverId))}" style="${escapeHtml(style)}"${className}${renderAttributes(args.attributes)}>${renderChildren(args.children)}</div>`;
}

/** Popover-Panel (native Popover API, optional mit CSS Anchor Positioning) */
export function PopoverContent(args: PopoverContentArgs): string {
  let contentClasses = popoverContentVariants(args);
  let style: string;

  if (args.useAnchor) {
    // Content-ID als Position-Anchor (entspricht der popoverId des Triggers)
    style = `position: absolute; ${buildPositionAnchorStyle(args.id)}; z-index: 50; `;

    if (args.side || args.align) {
      const sideOffset = args.sideOffset || DEFAULT_SIDE_OFFSET;
      style += `${getAnchorPosition(args.side, args.align, sideOffset)};`;
    }

    contentClasses += " anchor-positioned";
  } else {
    style = "position: absolute; z-index: 50;";
  }

  return `<div id="${escapeHtml(args.id)}" popover="auto" class="${escapeHtml(contentClasses)}" style="${escapeHtml(style)}"${renderAttributes(args.attributes)}>${renderChildren(args.children)}</div>`;
}
