import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

export interface LabelArgs {
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** HTML-for-Attribut (verknüpft das Label mit der ID eines Inputs) */
  for?: string;
  /** Zusätzliche HTML-Attribute */
  attributes?: HtmlAttributes;
  /** Label-Inhalt */
  children?: Children;
}
