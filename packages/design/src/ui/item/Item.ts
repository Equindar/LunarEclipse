import { cn } from "../../utils/cn";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { safeUrl } from "../../utils/safeUrl";
import { tw } from "../../utils/tw";
import {
    buildItemDataAttributes,
    buildItemGroupAttributes,
    buildItemMediaDataAttributes,
    buildItemSeparatorAttributes,
    buildItemSlotAttributes,
    DEFAULT_ITEM_MEDIA_VARIANT,
    DEFAULT_ITEM_SIZE,
    DEFAULT_ITEM_VARIANT,
    type ItemSlot,
} from "./Item.expressions";
import type {
    ItemActionsArgs,
    ItemArgs,
    ItemContentArgs,
    ItemDescriptionArgs,
    ItemFooterArgs,
    ItemGroupArgs,
    ItemHeaderArgs,
    ItemMediaArgs,
    ItemMediaVariant,
    ItemPartArgs,
    ItemSeparatorArgs,
    ItemSize,
    ItemTitleArgs,
    ItemVariant,
} from "./Item.types";

/*
 * Klassen aus shadcn/ui (Base-Variante). Die Quelle verwendet Platzhalter-Klassen (cn-item*),
 * die konkreten Klassen stammen aus dem Style "vega". Die aufgelösten Klassen stehen an der Stelle des Platzhalters.
 */

const itemTw = tw`[a]:hover:bg-muted rounded-md border text-sm group/item flex w-full flex-wrap items-center transition-colors duration-100 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [a]:transition-colors`;

const itemVariantTw: Record<ItemVariant, string> = {
  default: tw`border-transparent`,
  outline: tw`border-border`,
  muted: tw`bg-muted/50 border-transparent`,
};

const itemSizeTw: Record<ItemSize, string> = {
  default: tw`gap-3.5 px-4 py-3.5`,
  sm: tw`gap-2.5 px-3 py-2.5`,
  xs: tw`gap-2 px-2.5 py-2 in-data-[slot=dropdown-menu-content]:p-0`,
};

const itemMediaTw = tw`gap-2 group-has-data-[slot=item-description]/item:translate-y-0.5 group-has-data-[slot=item-description]/item:self-start flex shrink-0 items-center justify-center [&_svg]:pointer-events-none`;

const itemMediaVariantTw: Record<ItemMediaVariant, string> = {
  default: tw`bg-transparent`,
  icon: tw`[&_svg:not([class*='size-'])]:size-4`,
  image: tw`size-10 overflow-hidden rounded-sm group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover`,
};

const itemGroupTw = tw`gap-4 has-data-[size=sm]:gap-2.5 has-data-[size=xs]:gap-2 group/item-group flex w-full flex-col`;

const itemSeparatorTw = tw`my-2 shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch`;

const itemContentTw = tw`gap-1 group-data-[size=xs]/item:gap-0 flex flex-1 flex-col [&+[data-slot=item-content]]:flex-none`;

const itemTitleTw = tw`gap-2 text-sm leading-snug font-medium underline-offset-4 line-clamp-1 flex w-fit items-center`;

const itemDescriptionTw = tw`text-muted-foreground text-left text-sm leading-normal group-data-[size=xs]/item:text-xs line-clamp-2 font-normal [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary`;

const itemActionsTw = tw`gap-2 flex items-center`;

const itemHeaderTw = tw`gap-2 flex basis-full items-center justify-between`;

const itemFooterTw = tw`gap-2 flex basis-full items-center justify-between`;

/** Klassen des Items (Basis, Variante, Grösse und eigene Klassen) */
export function itemVariants(args: Pick<ItemArgs, "variant" | "size" | "class"> = {}): string {
  return cn(
    itemTw,
    itemVariantTw[args.variant ?? DEFAULT_ITEM_VARIANT],
    itemSizeTw[args.size ?? DEFAULT_ITEM_SIZE],
    args.class,
  );
}

/** Klassen des Medienbereichs (Basis, Variante und eigene Klassen) */
export function itemMediaVariants(args: Pick<ItemMediaArgs, "variant" | "class"> = {}): string {
  return cn(itemMediaTw, itemMediaVariantTw[args.variant ?? DEFAULT_ITEM_MEDIA_VARIANT], args.class);
}

/**
 * Gemeinsamer Renderer der einfachen Teilkomponenten.
 * Nutzer-Attribute werden zuerst übernommen und von den Standard-Attributen überschrieben.
 */
function renderPart(tag: "div" | "p", slot: ItemSlot, baseClass: string, args: ItemPartArgs): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildItemSlotAttributes(slot),
    class: cn(baseClass, args.class),
  };

  return `<${tag}${renderAttributes(attrs)}>${renderChildren(args.children)}</${tag}>`;
}

/**
 * Item: `<div>` oder, mit `href`, ein Link (`<a>`).
 * Hover- und Fokus-Styles gelten bei Links für das Anker-Element selbst.
 */
export function Item(args: ItemArgs = {}): string {
  const variant = args.variant ?? DEFAULT_ITEM_VARIANT;
  const size = args.size ?? DEFAULT_ITEM_SIZE;

  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildItemDataAttributes(variant, size),
    class: itemVariants({ variant, size, class: args.class }),
  };

  const isLink = args.href !== undefined;
  if (isLink) attrs.href = safeUrl(args.href ?? "");

  const tag = isLink ? "a" : "div";

  return `<${tag}${renderAttributes(attrs)}>${renderChildren(args.children)}</${tag}>`;
}

/** Container für zusammengehörige Items (role="list") */
export function ItemGroup(args: ItemGroupArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildItemGroupAttributes(),
    class: cn(itemGroupTw, args.class),
  };

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Horizontale Trennlinie zwischen Items einer Gruppe */
export function ItemSeparator(args: ItemSeparatorArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildItemSeparatorAttributes(),
    class: cn(itemSeparatorTw, args.class),
  };

  return `<div${renderAttributes(attrs)}></div>`;
}

/** Medienbereich: Icon, Bild oder Avatar */
export function ItemMedia(args: ItemMediaArgs = {}): string {
  const variant = args.variant ?? DEFAULT_ITEM_MEDIA_VARIANT;

  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildItemMediaDataAttributes(variant),
    class: itemMediaVariants({ variant, class: args.class }),
  };

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Umschliesst Titel und Beschreibung */
export function ItemContent(args: ItemContentArgs = {}): string {
  return renderPart("div", "item-content", itemContentTw, args);
}

export function ItemTitle(args: ItemTitleArgs = {}): string {
  return renderPart("div", "item-title", itemTitleTw, args);
}

/** Beschreibung (`<p>`) */
export function ItemDescription(args: ItemDescriptionArgs = {}): string {
  return renderPart("p", "item-description", itemDescriptionTw, args);
}

/** Bereich für Buttons oder andere interaktive Elemente */
export function ItemActions(args: ItemActionsArgs = {}): string {
  return renderPart("div", "item-actions", itemActionsTw, args);
}

/** Kopfbereich über dem Inhalt (volle Breite) */
export function ItemHeader(args: ItemHeaderArgs = {}): string {
  return renderPart("div", "item-header", itemHeaderTw, args);
}

/** Fussbereich unter dem Inhalt (volle Breite) */
export function ItemFooter(args: ItemFooterArgs = {}): string {
  return renderPart("div", "item-footer", itemFooterTw, args);
}
