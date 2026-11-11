import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Visueller Stil des Items */
export type ItemVariant = "default" | "outline" | "muted";

/** Grösse des Items (steuert Abstände und, über data-size, die Teilkomponenten) */
export type ItemSize = "default" | "sm" | "xs";

/** Stil des Medienbereichs (Icon, Bild) */
export type ItemMediaVariant = "default" | "icon" | "image";

/** Gemeinsame Args der Teilkomponenten */
export interface ItemPartArgs {
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
  /** Inhalt */
  children?: Children;
}

export interface ItemArgs extends ItemPartArgs {
  /** Visueller Stil (Standard: "default") */
  variant?: ItemVariant;
  /** Grösse (Standard: "default") */
  size?: ItemSize;
  /** Wenn gesetzt, wird das Item als Link (`<a>`) statt als `<div>` gerendert (ersetzt die `render`-Prop der Quelle) */
  href?: string;
}

export interface ItemGroupArgs extends ItemPartArgs {}

/** Der Separator hat keinen Inhalt */
export interface ItemSeparatorArgs extends Omit<ItemPartArgs, "children"> {}

export interface ItemMediaArgs extends ItemPartArgs {
  /** Stil des Medienbereichs (Standard: "default") */
  variant?: ItemMediaVariant;
}

export interface ItemContentArgs extends ItemPartArgs {}

export interface ItemTitleArgs extends ItemPartArgs {}

export interface ItemDescriptionArgs extends ItemPartArgs {}

export interface ItemActionsArgs extends ItemPartArgs {}

export interface ItemHeaderArgs extends ItemPartArgs {}

export interface ItemFooterArgs extends ItemPartArgs {}
