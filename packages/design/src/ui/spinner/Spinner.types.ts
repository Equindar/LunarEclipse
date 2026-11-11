import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

export interface SpinnerArgs {
  /** Zusätzliche CSS-Klassen, z. B. Größe ("size-8") oder Farbe ("text-primary") */
  class?: string;
  /** Zugänglicher Name für Screenreader (aria-label, Standard: "Loading") */
  label?: string;
  /**
   * Zusätzliche HTML-Attribute, z. B. `data-icon` im Button oder Badge.
   * Die Standard-Attribute (data-slot, role, aria-label, class) überschreiben diese Werte,
   * die SVG-Darstellungsattribute (stroke-width, width, height ...) lassen sich überschreiben.
   */
  attributes?: HtmlAttributes;
}
