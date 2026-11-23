import type { ToggleSize, ToggleVariant } from "../../ui/toggle";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

export interface DarkModeToggleArgs {
  /** ID des Buttons (optional) */
  id?: string;
  /** Visueller Stil, übernommen vom Toggle (Standard: "default") */
  variant?: ToggleVariant;
  /** Grösse, übernommen vom Toggle (Standard: "default") */
  size?: ToggleSize;
  /** Zugänglicher Name des Buttons (Standard: "Dunkelmodus umschalten") */
  label?: string;
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
}
