import type { HtmlAttributes } from "./renderHtmlAttributes";
import { renderAttributes } from "./renderHtmlAttributes";
import { withSlot } from "./withSlot";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

export interface RenderIconOptions {
  /** Klassen am svg-Element, z. B. "size-4 text-primary stroke-1" */
  class?: string;
  /** Zugänglicher Name. Ohne Angabe ist das Icon dekorativ (aria-hidden) */
  label?: string;
  /** Weitere Attribute. Sie ersetzen die Standardwerte (z. B. "stroke-width"), nur xmlns bleibt fest */
  attributes?: HtmlAttributes;
}

/**
 * Baut ein Inline-SVG aus dem Inneren eines 24x24-Icons.
 * Die Standardwerte stehen als Presentation Attributes (niedrigste Spezifität):
 * Tailwind-Klassen wie size-4, stroke-1, fill-current oder text-primary überschreiben sie ohne Weiteres.
 * `body` wird ungeprüft eingefügt und darf nur aus vertrauenswürdigen Quellen stammen (siehe scripts/generate-icons.ts).
 */
export function renderIcon(body: string, options: RenderIconOptions = {}): string {
  const attrs = withSlot(
    {
      xmlns: SVG_NAMESPACE,
      width: 24,
      height: 24,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": 2,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      ...options.attributes,
    },
    "icon"
  );

  attrs.xmlns = SVG_NAMESPACE;
  if (options.class) attrs.class = options.class;

  if (options.label) {
    attrs.role = "img";
    attrs["aria-label"] = options.label;
  } else {
    attrs["aria-hidden"] = "true";
  }

  return `<svg${renderAttributes(attrs)}>${body}</svg>`;
}
