import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import type { BubbleAlign, BubbleReactionsSide, BubbleVariant } from "./Bubble.types";

/**
 * Die Bubble hat keine Datastar-Logik; diese Datei enthält nur die Attribut-Bausteine.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 */

export const DEFAULT_BUBBLE_VARIANT: BubbleVariant = "default";
export const DEFAULT_BUBBLE_ALIGN: BubbleAlign = "start";
export const DEFAULT_REACTIONS_SIDE: BubbleReactionsSide = "bottom";
export const DEFAULT_REACTIONS_ALIGN: BubbleAlign = "end";

/** Standard-Attribute der Gruppe */
export function buildBubbleGroupDataAttributes(): HtmlAttributes {
  return { "data-slot": "bubble-group" };
}

/** Standard-Attribute der Bubble: data-slot, data-variant und data-align (die Klassen zielen darauf) */
export function buildBubbleDataAttributes(variant: BubbleVariant, align: BubbleAlign): HtmlAttributes {
  return { "data-slot": "bubble", "data-variant": variant, "data-align": align };
}

/** Standard-Attribute des Inhalts; der Slot wird von den Varianten der Bubble per Selektor angesprochen */
export function buildBubbleContentDataAttributes(): HtmlAttributes {
  return { "data-slot": "bubble-content" };
}

/** Standard-Attribute der Reactions: data-slot, data-align und data-side */
export function buildBubbleReactionsDataAttributes(side: BubbleReactionsSide, align: BubbleAlign): HtmlAttributes {
  return { "data-slot": "bubble-reactions", "data-align": align, "data-side": side };
}
