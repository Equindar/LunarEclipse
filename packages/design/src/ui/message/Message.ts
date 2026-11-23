import { cn } from "../../utils/cn";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import {
    buildMessageDataAttributes,
    buildMessagePartAttributes,
    DEFAULT_MESSAGE_ALIGN,
} from "./Message.expressions";
import type {
    MessageArgs,
    MessageAvatarArgs,
    MessageContentArgs,
    MessageFooterArgs,
    MessageGroupArgs,
    MessageHeaderArgs,
    MessagePartArgs,
} from "./Message.types";

/**
 * Klassen der Teile (shadcn/ui, Base-Variante).
 * Die Quelle verwendet Platzhalter-Klassen (cn-message*), die konkreten Klassen stammen aus dem Style "vega"
 * (identisch mit "nova" und mit der New-York-v4-Quelle).
 */
export const messageGroupTw = tw`flex min-w-0 flex-col gap-2`;

export const messageTw = tw`group/message relative flex w-full min-w-0 gap-2 text-sm data-[align=end]:flex-row-reverse`;

export const messageAvatarTw = tw`flex w-fit min-w-8 shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-muted group-has-data-[slot=message-footer]/message:-translate-y-8`;

export const messageContentTw = tw`flex w-full min-w-0 flex-col gap-2.5 wrap-break-word group-data-[align=end]/message:*:data-slot:self-end`;

export const messageHeaderTw = tw`flex max-w-full min-w-0 items-center px-3 text-xs font-medium text-muted-foreground group-has-data-[variant=ghost]/message:px-0`;

export const messageFooterTw = tw`flex max-w-full min-w-0 items-center px-3 text-xs font-medium text-muted-foreground group-has-data-[variant=ghost]/message:px-0 group-data-[align=end]/message:justify-end`;

/** Rendert ein div-Teil: Nutzer-Attribute zuerst, Standard-Attribute und Klassen danach */
function renderPart(slot: string, baseTw: string, args: MessagePartArgs): string {
  const attrs = {
    ...buildMessagePartAttributes(args.attributes, slot),
    class: cn(baseTw, args.class),
  };

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Gruppiert aufeinanderfolgende Nachrichten desselben Absenders */
export function MessageGroup(args: MessageGroupArgs = {}): string {
  return renderPart("message-group", messageGroupTw, args);
}

/**
 * Zeile einer Nachricht. Mit `align: "end"` wird die Zeile umgedreht (gesendete Nachricht).
 * Aufbau: Message > MessageAvatar + MessageContent > (MessageHeader, Nachrichtenfläche, MessageFooter).
 */
export function Message(args: MessageArgs = {}): string {
  const attrs = {
    ...buildMessageDataAttributes(args.attributes, args.align ?? DEFAULT_MESSAGE_ALIGN),
    class: cn(messageTw, args.class),
  };

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Avatar-Slot am unteren Rand. Mit MessageFooter rückt er nach oben, damit er an der Nachrichtenfläche bleibt */
export function MessageAvatar(args: MessageAvatarArgs = {}): string {
  return renderPart("message-avatar", messageAvatarTw, args);
}

/** Umschliesst Header, Nachrichtenfläche und Footer */
export function MessageContent(args: MessageContentArgs = {}): string {
  return renderPart("message-content", messageContentTw, args);
}

/** Absendername oder Status über der Nachricht */
export function MessageHeader(args: MessageHeaderArgs = {}): string {
  return renderPart("message-header", messageHeaderTw, args);
}

/** Metadaten oder Aktionen unter der Nachricht, bei `align: "end"` rechtsbündig */
export function MessageFooter(args: MessageFooterArgs = {}): string {
  return renderPart("message-footer", messageFooterTw, args);
}
