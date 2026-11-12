import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Position eines Addons relativ zum Eingabefeld (inline = neben dem Feld, block = darüber oder darunter) */
export type InputGroupAddonAlign = "inline-start" | "inline-end" | "block-start" | "block-end";

/** Größe eines Buttons in der Gruppe */
export type InputGroupButtonSize = "xs" | "sm" | "icon-xs" | "icon-sm";

/** Visueller Stil des Buttons (wird an den Button des Design-Systems weitergereicht) */
export type InputGroupButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";

/** Button-Typ (HTML-Attribut type) */
export type InputGroupButtonType = "button" | "submit" | "reset";

export interface InputGroupArgs {
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Zusätzliche HTML-Attribute, z. B. `{ "data-disabled": "true" }` (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
  /** Eingabefeld (InputGroupInput oder InputGroupTextarea) gefolgt von den Addons */
  children?: Children;
}

export interface InputGroupAddonArgs {
  /** Position relativ zum Eingabefeld (Standard: "inline-start") */
  align?: InputGroupAddonAlign;
  /** Zusätzliche CSS-Klassen, z. B. "border-b" für eine Trennlinie bei block-start */
  class?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
  /** Inhalt: Icon, Text (InputGroupText), Buttons oder Kbd */
  children?: Children;
}

export interface InputGroupButtonArgs {
  /** Visueller Stil (Standard: "ghost") */
  variant?: InputGroupButtonVariant;
  /** Größe (Standard: "xs") */
  size?: InputGroupButtonSize;
  /** Button-Typ (Standard: "button") */
  type?: InputGroupButtonType;
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Zusätzliche HTML-Attribute, z. B. `{ "aria-label": "Copy" }` */
  attributes?: HtmlAttributes;
  /** Button-Inhalt (Text oder Icon) */
  children?: Children;
}

export interface InputGroupTextArgs {
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Zusätzliche HTML-Attribute */
  attributes?: HtmlAttributes;
  /** Textinhalt, optional mit Icon */
  children?: Children;
}

export interface InputGroupInputArgs {
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Alle nativen Attribute des Eingabefelds (type, placeholder, value, name, disabled, aria-invalid ...) */
  attributes?: HtmlAttributes;
}

export interface InputGroupTextareaArgs {
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Alle nativen Attribute des Textfelds (placeholder, rows, name, disabled, aria-invalid ...) */
  attributes?: HtmlAttributes;
}
