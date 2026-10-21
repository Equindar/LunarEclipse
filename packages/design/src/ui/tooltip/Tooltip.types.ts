import type { Children } from "../../types/Children";
import type { AnchorAlign, AnchorSide } from "../../utils/getAnchorPosition";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Signal-State eines Tooltips (Timeout-IDs werden als string abgelegt) */
export interface TooltipSignals {
  open: boolean;
  /** Timeout-ID zum Anzeigen */
  showTimeout: string;
  /** Timeout-ID zum Ausblenden */
  hideTimeout: string;
  /** Ob Touch gehalten wird */
  touchHeld: boolean;
  /** Timeout-ID für Touch-and-hold */
  touchTimer: string;
}

export interface TooltipTriggerArgs {
  /** Optional: ID für das Trigger-Element selbst */
  id?: string;
  class?: string;
  /** Pflicht: ID des Tooltip-Contents, das gesteuert wird (wird auch als Anchor-Name genutzt) */
  tooltipId: string;
  /** Verzögerung in Millisekunden, bevor der Tooltip erscheint (Standard: 700) */
  delayDuration?: number;
  attributes?: HtmlAttributes;
  /** Beliebiges Trigger-Markup */
  children?: Children;
}

export interface TooltipContentArgs {
  /** Pflicht: muss mit TooltipTriggerArgs.tooltipId übereinstimmen */
  id: string;
  class?: string;
  /** Ob CSS Anchor Positioning verwendet wird */
  useAnchor?: boolean;
  /** Seite relativ zum Trigger */
  side?: AnchorSide;
  /** Ausrichtung relativ zum Trigger */
  align?: AnchorAlign;
  /** Abstand zum Anchor in Pixeln (Standard: 4) */
  sideOffset?: number;
  attributes?: HtmlAttributes;
  /** Tooltip-Inhalt */
  children?: Children;
}
