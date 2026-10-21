import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

export interface CardPartArgs {
  /** Zusätzliche CSS-Klassen (werden per tailwind-merge eingemischt) */
  class?: string;
  /** Zusätzliche HTML-Attribute, z. B. Datastar-Attribute */
  attributes?: HtmlAttributes;
  /** Inhalt (fertiges HTML), ein String oder eine Liste von Strings */
  children?: Children;
}

export type CardArgs = CardPartArgs;
export type CardHeaderArgs = CardPartArgs;
export type CardTitleArgs = CardPartArgs;
export type CardDescriptionArgs = CardPartArgs;
export type CardActionArgs = CardPartArgs;
export type CardContentArgs = CardPartArgs;
export type CardFooterArgs = CardPartArgs;
