import type { Children } from "../../types/Children";
import type { AnchorAlign, AnchorSide } from "../../utils/getAnchorPosition";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Signal-State einer Hover Card (Timeout-IDs werden als string abgelegt) */
export interface HoverCardSignals {
  /** Ob das Popover gerade offen ist (wird über das toggle-Event des Popovers synchronisiert) */
  open: boolean;
  /** Timeout-ID zum verzögerten Öffnen */
  showTimeout: string;
  /** Timeout-ID zum verzögerten Schließen */
  hideTimeout: string;
  /** Schließverzögerung in Millisekunden (vom Trigger gesetzt, vom Content zum Schließen gelesen) */
  closeDelay: number;
}

export interface HoverCardArgs {
  /** Pflicht: gemeinsame ID von HoverCard, HoverCardTrigger und HoverCardContent (Signal-Name, Anchor-Name und DOM-ID des Contents leiten sich daraus ab) */
  id: string;
  class?: string;
  attributes?: HtmlAttributes;
  /** HoverCardTrigger und HoverCardContent */
  children?: Children;
}

export interface HoverCardTriggerArgs {
  /** Pflicht: muss mit HoverCardArgs.id übereinstimmen */
  id: string;
  /** Linkziel (Standard in shadcn: der Trigger ist ein `<a>`). Wird mit `asChild` ignoriert */
  href?: string;
  /**
   * Statt eines `<a>` einen `<span>`-Wrapper rendern, z. B. um einen Button oder anderes Markup zu umschließen
   * (Ersatz für `render`/`asChild`: Attribute werden nicht auf das Kind übertragen)
   */
  asChild?: boolean;
  /** Verzögerung in Millisekunden, bevor die Karte beim Hover erscheint (Standard: 600; Fokus öffnet sofort) */
  delay?: number;
  /** Verzögerung in Millisekunden, bevor die Karte schließt (Standard: 300) */
  closeDelay?: number;
  class?: string;
  attributes?: HtmlAttributes;
  /** Trigger-Inhalt */
  children?: Children;
}

export interface HoverCardContentArgs {
  /** Pflicht: muss mit HoverCardArgs.id übereinstimmen */
  id: string;
  /** Seite relativ zum Trigger (Standard: bottom) */
  side?: AnchorSide;
  /** Ausrichtung relativ zum Trigger (Standard: center) */
  align?: AnchorAlign;
  /** Abstand zum Trigger in Pixeln (Standard: 4) */
  sideOffset?: number;
  /**
   * Versatz entlang der Ausrichtungsachse in Pixeln (Standard: 4). Wirkt nur bei align start oder end,
   * positive Werte verschieben die Karte nach innen (bei center ohne Wirkung).
   */
  alignOffset?: number;
  class?: string;
  attributes?: HtmlAttributes;
  /** Karteninhalt */
  children?: Children;
}
