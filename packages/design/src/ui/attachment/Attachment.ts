import { cn } from "../../utils/cn";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { safeUrl } from "../../utils/safeUrl";
import { tw } from "../../utils/tw";
import { withSlot } from "../../utils/withSlot";
import { Button } from "../button";
import {
    buildAttachmentDataAttributes,
    buildAttachmentMediaDataAttributes,
    DEFAULT_ATTACHMENT_MEDIA_VARIANT,
    DEFAULT_ATTACHMENT_ORIENTATION,
    DEFAULT_ATTACHMENT_SIZE,
    DEFAULT_ATTACHMENT_STATE,
} from "./Attachment.expressions";
import type {
    AttachmentActionArgs,
    AttachmentActionsArgs,
    AttachmentArgs,
    AttachmentContentArgs,
    AttachmentDescriptionArgs,
    AttachmentGroupArgs,
    AttachmentMediaArgs,
    AttachmentMediaVariant,
    AttachmentOrientation,
    AttachmentPartArgs,
    AttachmentSize,
    AttachmentTitleArgs,
    AttachmentTriggerArgs,
} from "./Attachment.types";

/*
 * Klassen aus shadcn/ui (Base-Variante). Die Quelle verwendet Platzhalter-Klassen (cn-attachment*),
 * die konkreten Klassen stammen aus dem Style "vega" (identisch zu "nova" und zur New-York-v4-Quelle).
 * Die Utilities shimmer, scroll-fade-x und scrollbar-none müssen im CSS des Pakets existieren.
 */

const attachmentTw = tw`group/attachment relative flex w-fit max-w-full min-w-0 shrink-0 flex-wrap rounded-xl border bg-card text-card-foreground transition-colors focus-within:ring-1 focus-within:ring-ring/50 has-[>a,>button]:hover:bg-muted/50 data-[state=error]:border-destructive/30 data-[state=idle]:border-dashed`;

const attachmentSizeTw: Record<AttachmentSize, string> = {
  default: tw`gap-2 text-sm has-data-[slot=attachment-content]:px-2.5 has-data-[slot=attachment-content]:py-2 has-data-[slot=attachment-media]:p-2`,
  sm: tw`gap-2.5 text-xs has-data-[slot=attachment-content]:px-2 has-data-[slot=attachment-content]:py-1.5 has-data-[slot=attachment-media]:p-1.5`,
  xs: tw`gap-1.5 rounded-lg text-xs has-data-[slot=attachment-content]:px-1.5 has-data-[slot=attachment-content]:py-1 has-data-[slot=attachment-media]:p-1`,
};

const attachmentOrientationTw: Record<AttachmentOrientation, string> = {
  horizontal: tw`min-w-40 items-center`,
  vertical: tw`w-24 flex-col has-data-[slot=attachment-content]:w-30`,
};

const attachmentMediaTw = tw`relative flex aspect-square w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-foreground group-data-[orientation=vertical]/attachment:w-full group-data-[size=sm]/attachment:w-8 group-data-[size=xs]/attachment:w-7 group-data-[size=xs]/attachment:rounded-md group-data-[state=error]/attachment:bg-destructive/10 group-data-[state=error]/attachment:text-destructive group-data-[orientation=vertical]/attachment:*:data-[slot=spinner]:size-6! [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 group-data-[orientation=vertical]/attachment:[&_svg:not([class*='size-'])]:size-6 group-data-[size=xs]/attachment:[&_svg:not([class*='size-'])]:size-3.5`;

const attachmentMediaVariantTw: Record<AttachmentMediaVariant, string> = {
  icon: "",
  image: tw`opacity-60 group-data-[state=done]/attachment:opacity-100 group-data-[state=idle]/attachment:opacity-100 *:[img]:aspect-square *:[img]:w-full *:[img]:object-cover`,
};

const attachmentContentTw = tw`max-w-full min-w-0 flex-1 leading-tight group-data-[orientation=vertical]/attachment:px-1`;

const attachmentTitleTw = tw`block max-w-full min-w-0 truncate font-medium group-data-[state=processing]/attachment:shimmer group-data-[state=uploading]/attachment:shimmer`;

const attachmentDescriptionTw = tw`mt-0.5 block max-w-full min-w-0 truncate text-xs text-muted-foreground group-data-[state=error]/attachment:text-destructive/80`;

const attachmentActionsTw = tw`relative z-20 flex shrink-0 items-center group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:top-3 group-data-[orientation=vertical]/attachment:right-3 group-data-[orientation=vertical]/attachment:gap-1`;

const attachmentTriggerTw = tw`absolute inset-0 z-10 outline-none`;

const attachmentGroupTw = tw`flex min-w-0 scroll-fade-x snap-x snap-mandatory scroll-px-1 scrollbar-none gap-3 overflow-x-auto overscroll-x-contain py-1 *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start`;

/** Klassen des Attachments (Basis, Größe, Ausrichtung, eigene Klassen) */
export function attachmentVariants(
  args: Pick<AttachmentArgs, "size" | "orientation" | "class"> = {}
): string {
  return cn(
    attachmentTw,
    attachmentSizeTw[args.size ?? DEFAULT_ATTACHMENT_SIZE],
    attachmentOrientationTw[args.orientation ?? DEFAULT_ATTACHMENT_ORIENTATION],
    args.class
  );
}

/** Klassen des Media-Bereichs (Basis, Variante, eigene Klassen) */
export function attachmentMediaVariants(
  args: Pick<AttachmentMediaArgs, "variant" | "class"> = {}
): string {
  return cn(
    attachmentMediaTw,
    attachmentMediaVariantTw[args.variant ?? DEFAULT_ATTACHMENT_MEDIA_VARIANT],
    args.class
  );
}

/**
 * Rendert ein einfaches Teilelement. Nutzer-Attribute werden zuerst übernommen und von den
 * Standard-Attributen überschrieben; nur `data-slot` aus den Attributen ersetzt den Standardwert.
 */
function renderPart(
  tag: "div" | "span",
  slot: string,
  baseClass: string,
  args: AttachmentPartArgs,
  extraAttributes: HtmlAttributes = {}
): string {
  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, slot),
    ...extraAttributes,
    class: cn(baseClass, args.class),
  };

  return `<${tag}${renderAttributes(attrs)}>${renderChildren(args.children)}</${tag}>`;
}

/**
 * Attachment: Karte für eine Datei oder ein Bild mit Media, Name, Metadaten und Aktionen.
 * Die Komponente lädt nichts hoch, der Zustand (`state`) wird von außen gesetzt.
 */
export function Attachment(args: AttachmentArgs = {}): string {
  const state = args.state ?? DEFAULT_ATTACHMENT_STATE;
  const size = args.size ?? DEFAULT_ATTACHMENT_SIZE;
  const orientation = args.orientation ?? DEFAULT_ATTACHMENT_ORIENTATION;

  return renderPart(
    "div",
    "attachment",
    attachmentVariants({ size, orientation }),
    args,
    buildAttachmentDataAttributes(state, size, orientation)
  );
}

/** Media-Bereich: Icon oder Bild (`variant: "image"` mit einem `<img>` als Kind) */
export function AttachmentMedia(args: AttachmentMediaArgs = {}): string {
  const variant = args.variant ?? DEFAULT_ATTACHMENT_MEDIA_VARIANT;

  return renderPart(
    "div",
    "attachment-media",
    attachmentMediaVariants({ variant }),
    args,
    buildAttachmentMediaDataAttributes(variant)
  );
}

/** Umschließt Titel und Beschreibung */
export function AttachmentContent(args: AttachmentContentArgs = {}): string {
  return renderPart("div", "attachment-content", attachmentContentTw, args);
}

/** Name der Datei; schimmert bei `uploading` und `processing` */
export function AttachmentTitle(args: AttachmentTitleArgs = {}): string {
  return renderPart("span", "attachment-title", attachmentTitleTw, args);
}

/** Metadaten wie Dateityp, Größe oder Status; bei `error` steht hier der Fehlergrund */
export function AttachmentDescription(args: AttachmentDescriptionArgs = {}): string {
  return renderPart("span", "attachment-description", attachmentDescriptionTw, args);
}

/** Container für eine oder mehrere Aktionen am Ende des Attachments */
export function AttachmentActions(args: AttachmentActionsArgs = {}): string {
  return renderPart("div", "attachment-actions", attachmentActionsTw, args);
}

/**
 * Aktion: rendert einen Button (variant "ghost", size "icon-xs" als Standard).
 * Das `data-slot` wird über `attributes` an den Button übergeben.
 */
export function AttachmentAction(args: AttachmentActionArgs = {}): string {
  return Button({
    ...args,
    variant: args.variant ?? "ghost",
    size: args.size ?? "icon",
    attributes: withSlot(args.attributes, "attachment-action"),
  });
}

/**
 * Trigger: Overlay über der ganzen Karte, das einen Link oder Dialog auslöst.
 * Liegt hinter den Aktionen, sodass diese einzeln klickbar bleiben.
 * Ohne `href` ein `<button type="button">`, mit `href` ein Link (`<a>`).
 * Der Trigger hat keinen eigenen Text: ein `aria-label` über `attributes` ist erforderlich.
 */
export function AttachmentTrigger(args: AttachmentTriggerArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, "attachment-trigger"),
    class: cn(attachmentTriggerTw, args.class),
  };

  const isLink = args.href !== undefined;
  if (isLink) {
    attrs.href = safeUrl(args.href ?? "");
  } else {
    attrs.type = args.attributes?.type ?? "button";
  }

  const tag = isLink ? "a" : "button";

  return `<${tag}${renderAttributes(attrs)}>${renderChildren(args.children)}</${tag}>`;
}

/** Waagerecht scrollbare Reihe von Attachments mit Snap und Kantenverlauf */
export function AttachmentGroup(args: AttachmentGroupArgs = {}): string {
  return renderPart("div", "attachment-group", attachmentGroupTw, args);
}
