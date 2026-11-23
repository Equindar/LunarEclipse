import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { withSlot } from "../../utils/withSlot";
import type { MessageAlign } from "./Message.types";

/**
 * Die Message hat keine Datastar-Logik; diese Datei enthält nur die Attribut-Bausteine.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 */

export const DEFAULT_MESSAGE_ALIGN: MessageAlign = "start";

/** Standard-Attribute eines Teils: Nutzer-Attribute plus data-slot (ein data-slot der Nutzer ersetzt den Standard) */
export function buildMessagePartAttributes(attributes: HtmlAttributes | undefined, slot: string): HtmlAttributes {
  return withSlot(attributes, slot);
}

/** Standard-Attribute der Zeile: data-slot und data-align (Ziel der group/message-Selektoren der Teile) */
export function buildMessageDataAttributes(
  attributes: HtmlAttributes | undefined,
  align: MessageAlign = DEFAULT_MESSAGE_ALIGN
): HtmlAttributes {
  return { ...withSlot(attributes, "message"), "data-align": align };
}
