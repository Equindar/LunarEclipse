import type { Children } from "../../types/Children";
import type { AnchorAlign, AnchorSide } from "../../utils/getAnchorPosition";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

export interface PopoverTriggerArgs {
  /** Optional: ID für das Trigger-Element selbst */
  id?: string;
  class?: string;
  /** Pflicht: ID des Popover-Contents, das gesteuert wird (wird auch als Anchor-Name genutzt) */
  popoverId: string;
  attributes?: HtmlAttributes;
  /** Beliebiges Trigger-Markup */
  children?: Children;
}

export interface PopoverContentArgs {
  /** Pflicht: muss mit PopoverTriggerArgs.popoverId übereinstimmen */
  id: string;
  class?: string;
  /** Ob CSS Anchor Positioning verwendet wird */
  useAnchor?: boolean;
  /** Seite relativ zum Trigger */
  side?: AnchorSide;
  /** Ausrichtung relativ zum Trigger */
  align?: AnchorAlign;
  /** Abstand zum Anchor in Pixeln (Standard: 8) */
  sideOffset?: number;
  attributes?: HtmlAttributes;
  /** Popover-Inhalt */
  children?: Children;
}
