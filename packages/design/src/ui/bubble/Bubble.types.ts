import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Visueller Stil der Bubble */
export type BubbleVariant = "default" | "secondary" | "muted" | "tinted" | "outline" | "ghost" | "destructive";

/** Ausrichtung der Bubble (und der Reactions) innerhalb der Unterhaltung */
export type BubbleAlign = "start" | "end";

/** Kante der Bubble, an der die Reactions verankert sind */
export type BubbleReactionsSide = "top" | "bottom";

/** Element, als das BubbleContent gerendert wird (mit `href` immer `<a>`) */
export type BubbleContentTag = "div" | "button";

export interface BubbleGroupArgs {
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
  /** Aufeinanderfolgende Bubbles desselben Absenders */
  children?: Children;
}

export interface BubbleArgs {
  /** Visueller Stil (Standard: "default") */
  variant?: BubbleVariant;
  /** Ausrichtung (Standard: "start"); gehört an die Bubble, nicht an die Gruppe */
  align?: BubbleAlign;
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
  /** BubbleContent und optional BubbleReactions */
  children?: Children;
}

export interface BubbleContentArgs {
  /** Ersetzt das `render`-Prop der Quelle: `"button"` rendert einen Button (Standard: "div") */
  as?: BubbleContentTag;
  /** Ersetzt das `render`-Prop der Quelle: wenn gesetzt, wird ein Link (`<a>`) gerendert und hat Vorrang vor `as` */
  href?: string;
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
  /** Inhalt der Bubble (Text oder HTML) */
  children?: Children;
}

export interface BubbleReactionsArgs {
  /** Kante, an der die Reactions sitzen (Standard: "bottom") */
  side?: BubbleReactionsSide;
  /** Ausrichtung entlang der Kante (Standard: "end") */
  align?: BubbleAlign;
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
  /** Reactions, z. B. Icons oder kurze Texte */
  children?: Children;
}
