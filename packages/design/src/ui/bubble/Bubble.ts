import { cn } from "../../utils/cn";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { safeUrl } from "../../utils/safeUrl";
import { tw } from "../../utils/tw";
import {
    buildBubbleContentDataAttributes,
    buildBubbleDataAttributes,
    buildBubbleGroupDataAttributes,
    buildBubbleReactionsDataAttributes,
    DEFAULT_BUBBLE_ALIGN,
    DEFAULT_BUBBLE_VARIANT,
    DEFAULT_REACTIONS_ALIGN,
    DEFAULT_REACTIONS_SIDE,
} from "./Bubble.expressions";
import type {
    BubbleAlign,
    BubbleArgs,
    BubbleContentArgs,
    BubbleGroupArgs,
    BubbleReactionsArgs,
    BubbleReactionsSide,
    BubbleVariant,
} from "./Bubble.types";

/**
 * Klassen der Bubble-Teile (shadcn/ui, Base-Variante).
 * Die Quelle verwendet Platzhalter-Klassen (cn-bubble*), die konkreten Klassen stammen aus dem Style "vega".
 */

/** Gruppe aufeinanderfolgender Bubbles */
export const bubbleGroupTw = tw`flex min-w-0 flex-col gap-2`;

/** Basis-Klassen der Bubble */
export const bubbleTw = tw`group/bubble relative flex w-fit max-w-[80%] min-w-0 flex-col gap-1 group-data-[align=end]/message:self-end data-[align=end]:self-end data-[variant=ghost]:max-w-full`;

/** Klassen je Variante; sie stylen den Inhalt über den Slot-Selektor */
export const bubbleVariantTw: Record<BubbleVariant, string> = {
  default: tw`*:data-[slot=bubble-content]:bg-primary *:data-[slot=bubble-content]:text-primary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-primary/80`,
  secondary: tw`*:data-[slot=bubble-content]:bg-secondary *:data-[slot=bubble-content]:text-secondary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]`,
  muted: tw`*:data-[slot=bubble-content]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_5%)]`,
  tinted: tw`*:data-[slot=bubble-content]:bg-[oklch(from_var(--primary)_0.93_calc(c*0.4)_h)] *:data-[slot=bubble-content]:text-foreground dark:*:data-[slot=bubble-content]:bg-[oklch(from_var(--primary)_0.3_calc(c*0.4)_h)] [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--primary)_0.88_calc(c*0.5)_h)] dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--primary)_0.35_calc(c*0.5)_h)]`,
  outline: tw`*:data-[slot=bubble-content]:border-border *:data-[slot=bubble-content]:bg-background [&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-input/30`,
  ghost: tw`border-none *:data-[slot=bubble-content]:rounded-none *:data-[slot=bubble-content]:bg-transparent *:data-[slot=bubble-content]:p-0 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted/50`,
  destructive: tw`*:data-[slot=bubble-content]:bg-destructive/10 *:data-[slot=bubble-content]:text-destructive dark:*:data-[slot=bubble-content]:bg-destructive/20 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/20 dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/30`,
};

/** Klassen des Inhalts (Text, Button oder Link) */
export const bubbleContentTw = tw`w-fit max-w-full min-w-0 overflow-hidden rounded-xl border border-transparent px-3 py-2 text-sm leading-relaxed wrap-break-word group-data-[align=end]/bubble:self-end [button]:text-left [button,a]:transition-colors [button,a]:outline-none [button,a]:focus-visible:border-ring [button,a]:focus-visible:ring-3 [button,a]:focus-visible:ring-ring/50`;

/** Basis-Klassen der Reactions */
export const bubbleReactionsTw = tw`absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-sm ring-3 ring-card has-[button]:p-0`;

export const bubbleReactionsSideTw: Record<BubbleReactionsSide, string> = {
  top: tw`top-0 -translate-y-3/4`,
  bottom: tw`bottom-0 translate-y-3/4`,
};

export const bubbleReactionsAlignTw: Record<BubbleAlign, string> = {
  start: tw`left-3`,
  end: tw`right-3`,
};

export function bubbleGroupVariants(args: { class?: string } = {}): string {
  return cn(bubbleGroupTw, args.class);
}

export function bubbleVariants(args: Pick<BubbleArgs, "variant" | "class"> = {}): string {
  return cn(bubbleTw, bubbleVariantTw[args.variant ?? DEFAULT_BUBBLE_VARIANT], args.class);
}

export function bubbleContentVariants(args: { class?: string } = {}): string {
  return cn(bubbleContentTw, args.class);
}

export function bubbleReactionsVariants(args: Pick<BubbleReactionsArgs, "side" | "align" | "class"> = {}): string {
  return cn(
    bubbleReactionsTw,
    bubbleReactionsSideTw[args.side ?? DEFAULT_REACTIONS_SIDE],
    bubbleReactionsAlignTw[args.align ?? DEFAULT_REACTIONS_ALIGN],
    args.class
  );
}

/**
 * BubbleGroup: gruppiert aufeinanderfolgende Bubbles desselben Absenders.
 * Nutzer-Attribute werden zuerst übernommen und von den Standard-Attributen überschrieben.
 */
export function BubbleGroup(args: BubbleGroupArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildBubbleGroupDataAttributes(),
    class: bubbleGroupVariants({ class: args.class }),
  };

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Bubble: die Hülle um BubbleContent und BubbleReactions */
export function Bubble(args: BubbleArgs = {}): string {
  const variant = args.variant ?? DEFAULT_BUBBLE_VARIANT;
  const align = args.align ?? DEFAULT_BUBBLE_ALIGN;

  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildBubbleDataAttributes(variant, align),
    class: bubbleVariants({ variant, class: args.class }),
  };

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/**
 * BubbleContent: `<div>`, mit `as: "button"` ein `<button type="button">`, mit `href` ein Link (`<a>`).
 * Ersetzt das `render`-Prop der Quelle.
 */
export function BubbleContent(args: BubbleContentArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildBubbleContentDataAttributes(),
    class: bubbleContentVariants({ class: args.class }),
  };

  const isLink = args.href !== undefined;
  const tag = isLink ? "a" : (args.as ?? "div");

  if (isLink) attrs.href = safeUrl(args.href ?? "");
  if (tag === "button" && attrs.type === undefined) attrs.type = "button";

  return `<${tag}${renderAttributes(attrs)}>${renderChildren(args.children)}</${tag}>`;
}

/** BubbleReactions: überlappende Reactions, an einer Kante der Bubble verankert */
export function BubbleReactions(args: BubbleReactionsArgs = {}): string {
  const side = args.side ?? DEFAULT_REACTIONS_SIDE;
  const align = args.align ?? DEFAULT_REACTIONS_ALIGN;

  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildBubbleReactionsDataAttributes(side, align),
    class: bubbleReactionsVariants({ side, align, class: args.class }),
  };

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}
