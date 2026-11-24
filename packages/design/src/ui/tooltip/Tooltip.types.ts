import type { Children } from "../../types/Children";
import type { AnchorAlign, AnchorSide } from "../../utils/getAnchorPosition";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/**
 * Seite relativ zum Trigger. `inline-start` und `inline-end` folgen der Schreibrichtung
 * (siehe `dir` in TooltipContentArgs).
 */
export type TooltipSide = AnchorSide | "inline-start" | "inline-end";

/** Ausrichtung relativ zum Trigger */
export type TooltipAlign = AnchorAlign;

/** Schreibrichtung zur Auflösung von `inline-start` und `inline-end` */
export type TooltipDirection = "ltr" | "rtl";

/** Signal-State eines Tooltips */
export interface TooltipSignals {
  /** ID des Timeouts, der den Tooltip nach der Verzögerung anzeigt (0 = keiner aktiv) */
  showTimeout: number;
}

export interface TooltipProviderArgs {
  /** Standard-Verzögerung in Millisekunden für alle Tooltips darunter (Standard: 0) */
  delay?: number;
  class?: string;
  attributes?: HtmlAttributes;
  /** Beliebiges Markup, das Tooltips enthält */
  children?: Children;
}

export interface TooltipArgs {
  /** Optional: ID des Wrapper-Elements (die Verknüpfung von Trigger und Content läuft über `tooltipId` bzw. `id`) */
  id?: string;
  class?: string;
  attributes?: HtmlAttributes;
  /** TooltipTrigger und TooltipContent */
  children?: Children;
}

export interface TooltipTriggerArgs {
  /** Optional: ID für das Trigger-Element selbst */
  id?: string;
  class?: string;
  /** Pflicht: ID des Tooltip-Contents, das gesteuert wird (wird auch als Anchor-Name genutzt) */
  tooltipId: string;
  /**
   * Verzögerung in Millisekunden, bevor der Tooltip erscheint.
   * Ohne Angabe gilt `delay` des nächsten TooltipProvider, ohne Provider 600 (Standard von Base UI).
   */
  delay?: number;
  /**
   * Macht den Trigger selbst fokussierbar (tabindex="0"). Nötig, wenn das Kind nicht fokussierbar ist
   * (Text, deaktivierter Button). Bei einem Button oder Link als Kind weglassen.
   */
  focusable?: boolean;
  attributes?: HtmlAttributes;
  /** Beliebiges Trigger-Markup */
  children?: Children;
}

export interface TooltipContentArgs {
  /** Pflicht: muss mit TooltipTriggerArgs.tooltipId übereinstimmen */
  id: string;
  class?: string;
  /** Seite relativ zum Trigger (Standard: "top") */
  side?: TooltipSide;
  /** Ausrichtung relativ zum Trigger (Standard: "center") */
  align?: TooltipAlign;
  /** Abstand zum Trigger in Pixeln (Standard: 4) */
  sideOffset?: number;
  /** Versatz entlang der Ausrichtung in Pixeln (Standard: 0) */
  alignOffset?: number;
  /** Schreibrichtung für `inline-start` und `inline-end` (Standard: "ltr") */
  dir?: TooltipDirection;
  attributes?: HtmlAttributes;
  /** Tooltip-Inhalt */
  children?: Children;
}
