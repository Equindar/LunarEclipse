import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import type { EmptyMediaVariant } from "./Empty.types";

/**
 * Der Empty-State hat keine Datastar-Logik; diese Datei enthält nur die Attribut-Bausteine.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 */

export const DEFAULT_EMPTY_MEDIA_VARIANT: EmptyMediaVariant = "default";

/** data-slot-Werte der Teile (wie in shadcn; EmptyMedia heisst dort "empty-icon") */
export const EMPTY_SLOT = {
  root: "empty",
  header: "empty-header",
  media: "empty-icon",
  title: "empty-title",
  description: "empty-description",
  content: "empty-content",
} as const;

/** data-variant-Attribut des Medien-Bereichs (data-slot setzt withSlot) */
export function buildEmptyMediaVariantAttributes(variant: EmptyMediaVariant = DEFAULT_EMPTY_MEDIA_VARIANT): HtmlAttributes {
  return { "data-variant": variant };
}
