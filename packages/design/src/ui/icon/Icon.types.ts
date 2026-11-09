import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import type { IconName } from "./Icons.generated";
export type { IconName };

export interface IconArgs {
  /** Name des Icons (Dateiname in src/svg ohne .svg, z. B. "app-window") */
  name: IconName;
  /** Klassen am svg-Element, z. B. "size-4 text-primary stroke-1" */
  class?: string;
  /** Zugänglicher Name. Ohne Angabe ist das Icon dekorativ (aria-hidden) */
  label?: string;
  /** Weitere Attribute, z. B. { "data-icon": "inline-start" } für Button-Selektoren oder { "stroke-width": 1.5 } */
  attributes?: HtmlAttributes;
}
