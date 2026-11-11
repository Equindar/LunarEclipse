import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

export interface SkeletonArgs {
  /** Zusätzliche CSS-Klassen, v. a. für Größe und Form (z. B. "h-4 w-[250px]" oder "size-10 rounded-full") */
  class?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
  /** Optionaler Inhalt des Platzhalters (die Quelle erlaubt children, üblich ist ein leeres Element) */
  children?: Children;
}
