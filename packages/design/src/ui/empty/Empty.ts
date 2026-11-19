import { cn } from "../../utils/cn";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import { withSlot } from "../../utils/withSlot";
import {
    buildEmptyMediaVariantAttributes,
    DEFAULT_EMPTY_MEDIA_VARIANT,
    EMPTY_SLOT,
} from "./Empty.expressions";
import type {
    EmptyArgs,
    EmptyBaseArgs,
    EmptyContentArgs,
    EmptyDescriptionArgs,
    EmptyHeaderArgs,
    EmptyMediaArgs,
    EmptyMediaVariant,
    EmptyTitleArgs,
} from "./Empty.types";

/**
 * Klassen des Empty-States (shadcn/ui, Base-Variante).
 * Die Quelle verwendet Platzhalter-Klassen (cn-empty*), die konkreten Klassen stammen aus dem Style "vega".
 * Hinweis: Die Vorlage setzt `border-dashed`, aber keine Rahmenbreite. Der gestrichelte Rahmen
 * erscheint erst mit der Klasse `border` (siehe Story "Outline").
 */
const emptyTw = tw`flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-lg border-dashed p-12 text-center text-balance`;
const emptyHeaderTw = tw`flex max-w-sm flex-col items-center gap-2`;
const emptyMediaTw = tw`mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0`;
const emptyTitleTw = tw`text-lg font-medium tracking-tight`;
const emptyDescriptionTw = tw`text-sm/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary`;
const emptyContentTw = tw`flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance`;

/** Klassen je Variante des Medien-Bereichs */
const emptyMediaVariantTw: Record<EmptyMediaVariant, string> = {
  default: tw`bg-transparent`,
  icon: tw`flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground [&_svg:not([class*='size-'])]:size-6`,
};

/** Gemeinsamer Renderer: ein `div` mit Slot, Klassen und Kindern */
function renderDiv(slot: string, baseClass: string, args: EmptyBaseArgs, extra: HtmlAttributes = {}): string {
  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, slot),
    ...extra,
    class: cn(baseClass, args.class),
  };

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Wurzel des Empty-States */
export function Empty(args: EmptyArgs = {}): string {
  return renderDiv(EMPTY_SLOT.root, emptyTw, args);
}

/** Umschliesst Medien-Bereich, Titel und Beschreibung */
export function EmptyHeader(args: EmptyHeaderArgs = {}): string {
  return renderDiv(EMPTY_SLOT.header, emptyHeaderTw, args);
}

/** Medien-Bereich (Icon, Bild, Avatar ...), mit `variant: "icon"` als Kachel */
export function EmptyMedia(args: EmptyMediaArgs = {}): string {
  const variant = args.variant ?? DEFAULT_EMPTY_MEDIA_VARIANT;

  return renderDiv(
    EMPTY_SLOT.media,
    cn(emptyMediaTw, emptyMediaVariantTw[variant]),
    args,
    buildEmptyMediaVariantAttributes(variant)
  );
}

/** Titel */
export function EmptyTitle(args: EmptyTitleArgs = {}): string {
  return renderDiv(EMPTY_SLOT.title, emptyTitleTw, args);
}

/** Beschreibung; Links darin werden unterstrichen */
export function EmptyDescription(args: EmptyDescriptionArgs = {}): string {
  return renderDiv(EMPTY_SLOT.description, emptyDescriptionTw, args);
}

/** Inhalt unterhalb des Headers, z. B. Buttons */
export function EmptyContent(args: EmptyContentArgs = {}): string {
  return renderDiv(EMPTY_SLOT.content, emptyContentTw, args);
}
