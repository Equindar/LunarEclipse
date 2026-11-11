import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import type { BadgeIconPosition, BadgeVariant } from "./Badge.types";

/**
 * Das Badge hat keine Datastar-Logik; diese Datei enthält nur die Attribut-Bausteine.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 */

export const DEFAULT_BADGE_VARIANT: BadgeVariant = "default";

/** Standard-Attribute des Badges: data-slot und data-variant */
export function buildBadgeDataAttributes(variant: BadgeVariant = DEFAULT_BADGE_VARIANT): HtmlAttributes {
  return { "data-slot": "badge", "data-variant": variant };
}

/**
 * data-icon-Attribut für Icons oder Spinner im Badge.
 * Das Badge passt damit das Padding an (has-data-[icon=inline-start]/[icon=inline-end]).
 */
export function buildBadgeIconAttributes(position: BadgeIconPosition): HtmlAttributes {
  return { "data-icon": position };
}
