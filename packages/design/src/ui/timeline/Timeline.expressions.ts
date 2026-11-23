import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import type {
    TimelineItemContext,
    TimelineOrientation,
    TimelineRootContext,
    TimelineStatus,
    TimelineVariant,
} from "./Timeline.types";

/**
 * Die Timeline hat keine Datastar-Logik (statisches Markup). Diese Datei enthält die Statuslogik
 * (Ersatz für Store und Kontexte der React-Vorlage) und die Attribut-Bausteine.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 */

export const DEFAULT_TIMELINE_ORIENTATION: TimelineOrientation = "vertical";
export const DEFAULT_TIMELINE_VARIANT: TimelineVariant = "default";

/** Status eines Items anhand von Index und `activeIndex` (ohne `activeIndex` sind alle "pending") */
export function getTimelineItemStatus(index: number, activeIndex?: number): TimelineStatus {
  if (activeIndex === undefined) return "pending";
  if (index < activeIndex) return "completed";
  if (index === activeIndex) return "active";
  return "pending";
}

/** Berechnet den Kontext eines Items aus dem Root-Kontext, seinem Index und der Anzahl der Items */
export function buildTimelineItemContext(root: TimelineRootContext, index: number, count: number): TimelineItemContext {
  return {
    orientation: root.orientation,
    variant: root.variant,
    dir: root.dir,
    index,
    status: getTimelineItemStatus(index, root.activeIndex),
    isAlternateRight: root.variant === "alternate" && index % 2 === 1,
    nextStatus: index < count - 1 ? getTimelineItemStatus(index + 1, root.activeIndex) : undefined,
  };
}

/** Der Connector gilt als abgeschlossen, wenn das folgende Item "completed" oder "active" ist */
export function isTimelineConnectorCompleted(context: Pick<TimelineItemContext, "nextStatus">): boolean {
  return context.nextStatus === "completed" || context.nextStatus === "active";
}

/** Nur `data-slot` (Header, Title, Description, Time) */
export function buildTimelineSlotAttributes(slot: string): HtmlAttributes {
  return { "data-slot": slot };
}

/** Standard-Attribute des Roots */
export function buildTimelineDataAttributes(
  orientation: TimelineOrientation = DEFAULT_TIMELINE_ORIENTATION,
  variant: TimelineVariant = DEFAULT_TIMELINE_VARIANT
): HtmlAttributes {
  return { "data-slot": "timeline", "data-orientation": orientation, "data-variant": variant };
}

/** Standard-Attribute eines Items; `data-alternate-right` nur als boolesches Attribut, wenn zutreffend */
export function buildTimelineItemDataAttributes(context: TimelineItemContext): HtmlAttributes {
  return {
    "data-slot": "timeline-item",
    "data-status": context.status,
    "data-orientation": context.orientation,
    "data-alternate-right": context.isAlternateRight,
  };
}

export function buildTimelineContentDataAttributes(context: TimelineItemContext): HtmlAttributes {
  return { "data-slot": "timeline-content", "data-status": context.status };
}

export function buildTimelineDotDataAttributes(context: TimelineItemContext): HtmlAttributes {
  return { "data-slot": "timeline-dot", "data-status": context.status, "data-orientation": context.orientation };
}

/** Standard-Attribute des Connectors; `data-completed` nur als boolesches Attribut, wenn zutreffend */
export function buildTimelineConnectorDataAttributes(context: TimelineItemContext): HtmlAttributes {
  return {
    "data-slot": "timeline-connector",
    "data-completed": isTimelineConnectorCompleted(context),
    "data-status": context.status,
    "data-orientation": context.orientation,
  };
}
