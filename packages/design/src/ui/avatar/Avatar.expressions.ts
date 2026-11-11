import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import type { AvatarImageStatus, AvatarSize } from "./Avatar.types";

/**
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 *
 * Der Avatar hält keinen Datastar-Signal-State. Der Ladezustand des Bildes steht als
 * `data-status` am Root; Tailwind reagiert darauf über `group-data-[status=...]/avatar:`.
 * Dadurch brauchen die Teilkomponenten weder `id` noch gemeinsame Signale.
 */

export const DEFAULT_AVATAR_SIZE: AvatarSize = "default";

const AVATAR_ROOT_SELECTOR = "[data-slot=avatar]";

/** Standard-Attribute des Avatars: data-slot und data-size */
export function buildAvatarDataAttributes(size: AvatarSize = DEFAULT_AVATAR_SIZE): HtmlAttributes {
  return { "data-slot": "avatar", "data-size": size };
}

/** Standard-Attribute der Teilkomponenten: nur data-slot */
export function buildAvatarSlotAttributes(slot: string): HtmlAttributes {
  return { "data-slot": slot };
}

/** Setzt data-status am nächsten Avatar-Root (tut nichts, wenn das Bild ausserhalb eines Avatars steht) */
function buildSetStatus(status: string): string {
  return `el.closest('${AVATAR_ROOT_SELECTOR}')?.setAttribute('data-status', ${status})`;
}

/** Handler für das load-Event des Bildes */
export function buildAvatarImageLoadHandler(): string {
  const status: AvatarImageStatus = "loaded";
  return buildSetStatus(`'${status}'`);
}

/** Handler für das error-Event des Bildes */
export function buildAvatarImageErrorHandler(): string {
  const status: AvatarImageStatus = "error";
  return buildSetStatus(`'${status}'`);
}

/**
 * Init-Handler: Datastar kann nach dem Laden des Bildes starten, dann sind load und error schon vorbei.
 * Ist das Bild bereits fertig (complete), wird der Status aus naturalWidth abgeleitet.
 */
export function buildAvatarImageInitHandler(): string {
  return `el.complete ? ${buildSetStatus("el.naturalWidth > 0 ? 'loaded' : 'error'")} : void 0`;
}
