import { cn } from "../../utils/cn";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import {
    buildStackDataAttributes,
    buildStackExpandHandler,
    buildStackItemDataAttributes,
    buildStackItemEffect,
    buildStackItemWrapperDataAttributes,
    buildStackItemWrapperStyle,
    buildStackLeaveHandler,
    buildStackPointerDownHandler,
    buildStackPointerUpHandler,
    buildStackRootStyle,
    buildStackStateAttribute,
    computeStackItemLayout,
    DEFAULT_STACK_GAP,
    DEFAULT_STACK_ITEM_COUNT,
    DEFAULT_STACK_OFFSET,
    DEFAULT_STACK_SCALE,
    DEFAULT_STACK_SIDE,
    generateStackId,
    normalizeStackItems,
    stackSignals,
} from "./Stack.expressions";
import type { StackArgs, StackItemArgs, StackSide } from "./Stack.types";

/**
 * Tailwind-Klassen des Stacks (Dice UI, Base-Variante).
 * Die Items sind absolut positioniert; der Stack selbst hat keine eigene Höhe.
 */
export const stackTw = tw`relative w-full`;

/** Klassen des Items (innere Karte) */
export const stackItemTw = tw`rounded-lg border bg-card p-4 shadow-sm transition-shadow duration-200 hover:shadow-md`;

/** Basis-Klassen des internen Item-Wrappers */
export const stackItemWrapperTw = tw`absolute w-full transition-all duration-300 ease-out`;

/** Klassen des Item-Wrappers je Seite */
export const stackItemWrapperSideTw: Record<StackSide, string> = {
  top: tw`top-0 left-0 origin-top -translate-y-(--translate) scale-(--item-scale) after:absolute after:top-full after:left-0 after:w-full after:content-['']`,
  bottom: tw`bottom-0 left-0 origin-bottom translate-y-(--translate) scale-(--item-scale) after:absolute after:bottom-full after:left-0 after:w-full after:content-['']`,
};

/** Im aufgefächerten Zustand: unsichtbare Brücke zwischen den Items, damit der Hover nicht abreißt */
export const stackItemWrapperExpandedTw = tw`after:h-[calc(var(--gap)+1px)]`;

/** Nicht sichtbare Items sind nicht interaktiv */
export const stackItemWrapperHiddenTw = tw`pointer-events-none`;

export function stackVariants(args: Pick<StackArgs, "class"> = {}): string {
  return cn(stackTw, args.class);
}

export function stackItemVariants(args: Pick<StackItemArgs, "class"> = {}): string {
  return cn(stackItemTw, args.class);
}

export function stackItemWrapperVariants(
  args: { side?: StackSide; isExpanded?: boolean; isVisible?: boolean } = {}
): string {
  return cn(
    stackItemWrapperTw,
    stackItemWrapperSideTw[args.side ?? DEFAULT_STACK_SIDE],
    args.isExpanded && stackItemWrapperExpandedTw,
    args.isVisible === false && stackItemWrapperHiddenTw
  );
}

/**
 * Stack: zeigt Items übereinander gestapelt, bei Hover fächern sie sich auf (wie bei Sonner-Toasts).
 * Der Stack umschließt jedes Item in einem internen Wrapper, der Position, Skalierung und Deckkraft steuert.
 *
 * Ohne `expandOnHover` ist der Stack statisch (kein Datastar nötig). Mit `expandOnHover` steuern zwei Signale
 * (`expanded`, `interacting`) und je ein Layout-Effekt pro Item das Auffächern, das funktioniert nur mit Datastar.
 * Nutzer-Attribute werden zuerst übernommen und von den Standard-Attributen überschrieben.
 */
export function Stack(args: StackArgs = {}): string {
  const side = args.side ?? DEFAULT_STACK_SIDE;
  const itemCount = args.itemCount ?? DEFAULT_STACK_ITEM_COUNT;
  const gap = args.gap ?? DEFAULT_STACK_GAP;
  const scale = args.scale ?? DEFAULT_STACK_SCALE;
  const offset = args.offset ?? DEFAULT_STACK_OFFSET;
  const expandOnHover = args.expandOnHover ?? false;

  const items = normalizeStackItems(args.children);
  const childrenCount = items.length;
  const expandedItemCount = args.expandedItemCount ?? childrenCount;

  const stackId = args.id || generateStackId();
  const signals = stackSignals(stackId);

  const userStyle = typeof args.attributes?.style === "string" ? args.attributes.style : undefined;

  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildStackDataAttributes(),
    class: stackVariants({ class: args.class }),
    style: buildStackRootStyle(gap, offset, scale, userStyle),
  };
  if (args.id) attrs.id = args.id;

  if (expandOnHover) {
    attrs["data-signals"] = signals.dataSignals;
    attrs["data-attr:data-state"] = buildStackStateAttribute(stackId);
    attrs["data-on:mouseenter"] = buildStackExpandHandler(stackId);
    attrs["data-on:mousemove"] = buildStackExpandHandler(stackId);
    attrs["data-on:mouseleave"] = buildStackLeaveHandler(stackId);
    attrs["data-on:pointerdown"] = buildStackPointerDownHandler(stackId);
    attrs["data-on:pointerup__window"] = buildStackPointerUpHandler(stackId);
  }

  const wrappers = items.map((item, index) => {
    const layout = computeStackItemLayout({ index, childrenCount, itemCount, expandedItemCount, scale, offset });

    const wrapperAttrs: HtmlAttributes = {
      ...buildStackItemWrapperDataAttributes(layout),
      class: stackItemWrapperVariants({ side, isExpanded: false, isVisible: layout.visibleCollapsed }),
      style: buildStackItemWrapperStyle(layout),
    };

    if (expandOnHover) {
      wrapperAttrs["data-effect"] = buildStackItemEffect({
        stackId,
        layout,
        gap,
        expandedClass: stackItemWrapperExpandedTw,
        hiddenClass: stackItemWrapperHiddenTw,
      });
    }

    return `<div${renderAttributes(wrapperAttrs)}>${item}</div>`;
  });

  return `<div${renderAttributes(attrs)}>${wrappers.join("")}</div>`;
}

/** Item im Stack: Karte mit Rahmen und Schatten. Position und Animation übernimmt der Stack. */
export function StackItem(args: StackItemArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildStackItemDataAttributes(),
    class: stackItemVariants({ class: args.class }),
  };

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}
