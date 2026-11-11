import { cn } from "../../utils/cn";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import {
    buildSpinnerAttributes,
    buildSpinnerSvgAttributes,
    SPINNER_ICON_PATHS,
} from "./Spinner.expressions";
import type { SpinnerArgs } from "./Spinner.types";

/** Basis-Klassen des Spinners (shadcn/ui, Base- und New-York-v4-Variante sind identisch) */
const spinnerTw = tw`size-4 animate-spin`;

/**
 * Spinner: ein rotierendes SVG-Icon als Ladeanzeige.
 * Reihenfolge der Attribute: SVG-Darstellung (überschreibbar), Nutzer-Attribute,
 * Standard-Attribute (data-slot, role, aria-label, class).
 */
export function Spinner(args: SpinnerArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...buildSpinnerSvgAttributes(),
    ...args.attributes,
    ...buildSpinnerAttributes(args.label),
    class: cn(spinnerTw, args.class),
  };

  return `<svg${renderAttributes(attrs)}>${SPINNER_ICON_PATHS}</svg>`;
}
