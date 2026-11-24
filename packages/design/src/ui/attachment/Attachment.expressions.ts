import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import type {
    AttachmentMediaVariant,
    AttachmentOrientation,
    AttachmentSize,
    AttachmentState,
} from "./Attachment.types";

/**
 * Das Attachment hat keine Datastar-Logik; diese Datei enthält nur die Attribut-Bausteine.
 * Die Stylings (Fehler, Idle, Shimmer, Größe, Ausrichtung) hängen an diesen data-Attributen
 * (group-data-[state=...]/attachment usw.). Der Upload-Zustand wird von außen gesetzt,
 * die Komponente lädt nichts hoch.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 */

export const DEFAULT_ATTACHMENT_STATE: AttachmentState = "done";
export const DEFAULT_ATTACHMENT_SIZE: AttachmentSize = "default";
export const DEFAULT_ATTACHMENT_ORIENTATION: AttachmentOrientation = "horizontal";
export const DEFAULT_ATTACHMENT_MEDIA_VARIANT: AttachmentMediaVariant = "icon";

/** data-state, data-size und data-orientation des Attachments */
export function buildAttachmentDataAttributes(
  state: AttachmentState = DEFAULT_ATTACHMENT_STATE,
  size: AttachmentSize = DEFAULT_ATTACHMENT_SIZE,
  orientation: AttachmentOrientation = DEFAULT_ATTACHMENT_ORIENTATION
): HtmlAttributes {
  return { "data-state": state, "data-size": size, "data-orientation": orientation };
}

/** data-variant des Media-Bereichs */
export function buildAttachmentMediaDataAttributes(
  variant: AttachmentMediaVariant = DEFAULT_ATTACHMENT_MEDIA_VARIANT
): HtmlAttributes {
  return { "data-variant": variant };
}
