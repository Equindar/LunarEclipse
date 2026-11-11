import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/**
 * Das Skeleton hat keine Datastar-Logik; diese Datei enthält nur die Attribut-Bausteine.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 */

/** Standard-Attribute des Skeletons: data-slot */
export function buildSkeletonDataAttributes(): HtmlAttributes {
  return { "data-slot": "skeleton" };
}
