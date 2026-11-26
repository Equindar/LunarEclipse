import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { withSlot } from "../../utils/withSlot";
import type { StatusVariant } from "./Status.types";

/**
 * Der Status hat keine Datastar-Logik; diese Datei enthält nur die Attribut-Bausteine.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 */

export const DEFAULT_STATUS_VARIANT: StatusVariant = "default";

/**
 * Attribute des Status-Roots: data-slot (aus `attributes` ersetzbar, z. B. "log-card-live") und data-variant.
 * In der Quelle setzt Base UI diese beiden Attribute über `state`.
 */
export function buildStatusDataAttributes(
  variant: StatusVariant = DEFAULT_STATUS_VARIANT,
  attributes?: HtmlAttributes,
): HtmlAttributes {
  return { ...withSlot(attributes, "status"), "data-variant": variant };
}

/**
 * Attribute des Indikators: dekorativ (aria-hidden="true", per `attributes` überschreibbar)
 * und ein fester data-slot. Die Variantenklassen des Status färben den Indikator über
 * `**:data-[slot=status-indicator]`, der Slot ist deshalb nicht überschreibbar.
 */
export function buildStatusIndicatorAttributes(attributes?: HtmlAttributes): HtmlAttributes {
  return { "aria-hidden": "true", ...attributes, "data-slot": "status-indicator" };
}

/** Attribute des Labels: data-slot (aus `attributes` ersetzbar) */
export function buildStatusLabelDataAttributes(attributes?: HtmlAttributes): HtmlAttributes {
  return withSlot(attributes, "status-label");
}
