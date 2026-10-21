import { cn } from "../../utils/cn";
import { escapeHtml } from "../../utils/escapeHtml";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes } from "../../utils/renderHtmlAttributes";
import { safeUrl } from "../../utils/safeUrl";
import { tw } from "../../utils/tw";
import type { AvatarArgs } from "./Avatar.types";

const DEFAULT_TEXT_COLOR = "#ffffff";

/** Tailwind-Klassen für den Avatar-Container */
export const avatarTw = tw`w-8 h-8 inline-flex items-center justify-center overflow-hidden rounded-full`;

/** Tailwind-Klassen für das Avatar-Bild */
export const avatarImageTw = tw`size-full object-cover`;

export function avatarVariants(args: Pick<AvatarArgs, "class"> = {}): string {
  return cn(avatarTw, args.class);
}

/** Inline-Style für den Default-Avatar; ohne backgroundColor gibt es keinen Style */
function buildColorStyle(args: Pick<AvatarArgs, "backgroundColor" | "textColor">): string {
  if (!args.backgroundColor) return "";
  const textColor = args.textColor || DEFAULT_TEXT_COLOR;
  return `background-color: ${args.backgroundColor}; color: ${textColor};`;
}

function renderImage(source: string, alt = ""): string {
  return `<img data-slot="avatar-image" src="${escapeHtml(safeUrl(source))}" alt="${escapeHtml(alt)}" class="${avatarImageTw}" loading="lazy" decoding="async">`;
}

/**
 * Avatar: Default-Avatar mit Text und Hintergrundfarbe oder, wenn `source` gesetzt ist, ein Bild (z. B. webp oder png).
 */
export function Avatar(args: AvatarArgs = {}): string {
  const hasSource = Boolean(args.source);

  // Mit Bild gelten weder Farben noch Text des Default-Avatars
  const style = hasSource ? "" : buildColorStyle(args);
  const styleAttr = style ? ` style="${escapeHtml(style)}"` : "";

  const content = hasSource ? renderImage(args.source as string, args.alt) : renderChildren(args.children);

  return `<div data-slot="avatar" class="${escapeHtml(avatarVariants(args))}"${styleAttr}${renderAttributes(args.attributes)}>${content}</div>`;
}
