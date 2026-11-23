import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Ausrichtung der Nachricht: "start" für empfangene, "end" für gesendete Nachrichten */
export type MessageAlign = "start" | "end";

/** Gemeinsame Args aller Teile der Message-Komponente */
export interface MessagePartArgs {
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben, ausser `data-slot`) */
  attributes?: HtmlAttributes;
  /** Inhalt des Teils */
  children?: Children;
}

/** Zeile einer Nachricht (Avatar plus Inhalt) */
export interface MessageArgs extends MessagePartArgs {
  /** Ausrichtung der Nachricht in der Unterhaltung (Standard: "start") */
  align?: MessageAlign;
}

/** Gruppiert aufeinanderfolgende Nachrichten desselben Absenders */
export type MessageGroupArgs = MessagePartArgs;

/** Avatar-Slot, sitzt am unteren Rand der Nachricht */
export type MessageAvatarArgs = MessagePartArgs;

/** Umschliesst Header, Nachrichtenfläche und Footer */
export type MessageContentArgs = MessagePartArgs;

/** Absendername oder ähnliche Angaben über der Nachricht */
export type MessageHeaderArgs = MessagePartArgs;

/** Metadaten oder Aktionen unter der Nachricht, folgt der Ausrichtung */
export type MessageFooterArgs = MessagePartArgs;
