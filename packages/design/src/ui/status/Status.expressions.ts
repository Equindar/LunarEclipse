import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import type { StatusVariant } from "./Status.types";

/**
 * Der Status hat keine Datastar-Logik; diese Datei enthält nur die Attribut-Bausteine.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 */

export const DEFAULT_STATUS_VARIANT: StatusVariant = "default";

/**
 * Standard-Attribute des Status: data-slot und data-variant.
 * In der Quelle setzt Base UI diese beiden Attribute über `state`.
 */
export function buildStatusDataAttributes(variant: StatusVariant = DEFAULT_STATUS_VARIANT): HtmlAttributes {
  return { "data-slot": "status", "data-variant": variant };
}

/**
 * data-slot des Indikators. Die Variantenklassen des Status färben den Indikator über
 * `**:data-[slot=status-indicator]`, der Wert ist deshalb fest und nicht überschreibbar.
 */
export function buildStatusIndicatorDataAttributes(): HtmlAttributes {
  return { "data-slot": "status-indicator" };
}

/** data-slot des Labels */
export function buildStatusLabelDataAttributes(): HtmlAttributes {
  return { "data-slot": "status-label" };
}
