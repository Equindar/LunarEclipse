import { cn } from "../../utils/cn";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { safeUrl } from "../../utils/safeUrl";
import { tw } from "../../utils/tw";
import {
    buildAvatarDataAttributes,
    buildAvatarImageErrorHandler,
    buildAvatarImageInitHandler,
    buildAvatarImageLoadHandler,
    buildAvatarSlotAttributes,
    DEFAULT_AVATAR_SIZE,
} from "./Avatar.expressions";
import type {
    AvatarArgs,
    AvatarBadgeArgs,
    AvatarFallbackArgs,
    AvatarGroupArgs,
    AvatarGroupCountArgs,
    AvatarImageArgs,
    AvatarPartArgs,
} from "./Avatar.types";

const DEFAULT_TEXT_COLOR = "#ffffff";

/**
 * Basis-Klassen des Avatars (shadcn/ui, Base-Variante, Style "vega").
 * Die Quelle verwendet Platzhalter-Klassen (cn-avatar*), die konkreten Klassen stammen aus dem Style.
 * Abweichend von shadcn bleiben `w-8 h-8` und `inline-flex items-center justify-center` aus dem bestehenden Avatar
 * erhalten (Default-Avatar mit Text, eigene Größen über `class`).
 */
const avatarTw = tw`group/avatar relative inline-flex w-8 h-8 shrink-0 items-center justify-center rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten`;

/**
 * Bild: liegt über dem Fallback (absolut), bei Ladefehler wird es per data-status am Root ausgeblendet.
 * Die Quelle rendert das Bild erst nach dem Laden und tauscht den Fallback per React-State; hier übernimmt das CSS.
 */
const avatarImageTw = tw`absolute inset-0 aspect-square size-full rounded-full object-cover group-data-[status=error]/avatar:hidden`;

/** Fallback: wird bei geladenem Bild unsichtbar (data-status="loaded" am Root) */
const avatarFallbackTw = tw`flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs group-data-[status=loaded]/avatar:invisible`;

const avatarBadgeTw = tw`absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background bg-blend-color select-none group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2 group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2`;

const avatarGroupTw = tw`group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background`;

const avatarGroupCountTw = tw`relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3`;

export function avatarVariants(args: Pick<AvatarArgs, "class"> = {}): string {
  return cn(avatarTw, args.class);
}

/** Inline-Style für den Default-Avatar; ohne backgroundColor gibt es keinen Style */
function buildColorStyle(args: Pick<AvatarArgs, "backgroundColor" | "textColor">): string {
  if (!args.backgroundColor) return "";
  const textColor = args.textColor || DEFAULT_TEXT_COLOR;
  return `background-color: ${args.backgroundColor}; color: ${textColor};`;
}

/** Rendert ein Element einer Teilkomponente (Nutzer-Attribute zuerst, Standard-Attribute überschreiben) */
function renderPart(tag: string, slot: string, baseClass: string, args: AvatarPartArgs): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildAvatarSlotAttributes(slot),
    class: cn(baseClass, args.class),
  };

  return `<${tag}${renderAttributes(attrs)}>${renderChildren(args.children)}</${tag}>`;
}

/**
 * AvatarImage: Bild des Avatars (`<img>`).
 * Meldet load und error per Datastar an den Avatar-Root (data-status); ohne Datastar bleibt das Bild einfach stehen.
 */
export function AvatarImage(args: AvatarImageArgs): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildAvatarSlotAttributes("avatar-image"),
    src: safeUrl(args.source ?? ""),
    alt: args.alt ?? "",
    class: cn(avatarImageTw, args.class),
    loading: "lazy",
    decoding: "async",
    "data-on:load": buildAvatarImageLoadHandler(),
    "data-on:error": buildAvatarImageErrorHandler(),
    "data-init": buildAvatarImageInitHandler(),
  };

  return `<img${renderAttributes(attrs)}>`;
}

/** AvatarFallback: Initialen oder Icon (`<span>`), sichtbar solange das Bild nicht geladen ist */
export function AvatarFallback(args: AvatarFallbackArgs = {}): string {
  return renderPart("span", "avatar-fallback", avatarFallbackTw, args);
}

/** AvatarBadge: Statusanzeige unten rechts (`<span>`); Größe folgt dem data-size des Avatars */
export function AvatarBadge(args: AvatarBadgeArgs = {}): string {
  return renderPart("span", "avatar-badge", avatarBadgeTw, args);
}

/** AvatarGroup: überlappende Avatare (`<div>`) */
export function AvatarGroup(args: AvatarGroupArgs = {}): string {
  return renderPart("div", "avatar-group", avatarGroupTw, args);
}

/** AvatarGroupCount: Zähler oder Icon am Ende einer Gruppe (`<div>`); Größe folgt den Avataren der Gruppe */
export function AvatarGroupCount(args: AvatarGroupCountArgs = {}): string {
  return renderPart("div", "avatar-group-count", avatarGroupCountTw, args);
}

/**
 * Avatar: Default-Avatar mit Text und Hintergrundfarbe, ein Bild über `source` (z. B. webp oder png)
 * oder frei zusammengesetzt aus AvatarImage, AvatarFallback und AvatarBadge als children.
 * Nutzer-Attribute werden zuerst übernommen und von den Standard-Attributen überschrieben.
 */
export function Avatar(args: AvatarArgs = {}): string {
  const hasSource = Boolean(args.source);

  // Mit Bild gelten weder Farben noch Text des Default-Avatars
  const style = hasSource ? "" : buildColorStyle(args);

  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildAvatarDataAttributes(args.size ?? DEFAULT_AVATAR_SIZE),
    class: avatarVariants({ class: args.class }),
  };
  if (style) attrs.style = style;

  const content = hasSource
    ? AvatarImage({ source: args.source as string, alt: args.alt })
    : renderChildren(args.children);

  return `<div${renderAttributes(attrs)}>${content}</div>`;
}
