import type { Children } from "../../types/Children";
import { cn } from "../../utils/cn";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import {
    buildTimelineConnectorDataAttributes,
    buildTimelineContentDataAttributes,
    buildTimelineDataAttributes,
    buildTimelineDotDataAttributes,
    buildTimelineItemContext,
    buildTimelineItemDataAttributes,
    buildTimelineSlotAttributes,
    DEFAULT_TIMELINE_ORIENTATION,
    DEFAULT_TIMELINE_VARIANT,
    isTimelineConnectorCompleted,
} from "./Timeline.expressions";
import type {
    TimelineArgs,
    TimelineConnectorArgs,
    TimelineContentArgs,
    TimelineDescriptionArgs,
    TimelineDotArgs,
    TimelineHeaderArgs,
    TimelineItemArgs,
    TimelineItemContext,
    TimelineOrientation,
    TimelineStatus,
    TimelineTimeArgs,
    TimelineTitleArgs,
    TimelineVariant,
} from "./Timeline.types";

/**
 * Klassen der Timeline (Dice UI, Base-Variante; die Quelle enthält konkrete Klassen, keine cn-*-Platzhalter).
 *
 * Abweichung von der Vorlage: In der Variante "alternate" und im horizontalen Layout stehen logische
 * Eigenschaften (pe-, ps-, ms-, -start-, -end-, start-, text-end) statt physischer (pr-, pl-, ml-, -left-,
 * -right-, left-, text-right). Im LTR-Layout ist das Ergebnis identisch, im RTL-Layout spiegelt es sich korrekt.
 */
const timelineTw = tw`relative flex [--timeline-connector-thickness:0.125rem] [--timeline-dot-size:0.875rem]`;
const timelineItemTw = tw`relative flex`;
const timelineContentTw = tw`flex-1`;
const timelineDotTw = tw`relative z-10 flex size-(--timeline-dot-size) shrink-0 items-center justify-center rounded-full border-2 bg-background`;
const timelineConnectorTw = tw`absolute z-0`;
const timelineHeaderTw = tw`flex flex-col gap-1`;
const timelineTitleTw = tw`text-base font-medium`;
const timelineDescriptionTw = tw`text-sm text-muted-foreground`;
const timelineTimeTw = tw`text-xs text-muted-foreground`;

const timelineOrientationTw: Record<TimelineOrientation, string> = {
  vertical: tw`flex-col`,
  horizontal: tw`flex-row items-start`,
};

const timelineDotStatusTw: Record<TimelineStatus, string> = {
  completed: tw`border-primary`,
  active: tw`border-primary`,
  pending: tw`border-border`,
};

function timelineVariants(args: { orientation: TimelineOrientation; variant: TimelineVariant; class?: string }): string {
  const vertical = args.orientation === "vertical";
  const alternate = args.variant === "alternate";

  return cn(
    timelineTw,
    timelineOrientationTw[args.orientation],
    vertical && !alternate && tw`gap-6`,
    !vertical && !alternate && tw`gap-8`,
    vertical && alternate && tw`relative w-full gap-3`,
    !vertical && alternate && tw`items-center gap-4`,
    args.class
  );
}

function timelineItemVariants(
  args: Pick<TimelineItemContext, "orientation" | "variant" | "isAlternateRight"> & { class?: string }
): string {
  const vertical = args.orientation === "vertical";
  const alternate = args.variant === "alternate";

  return cn(
    timelineItemTw,
    vertical && !alternate && tw`gap-3 pb-8 last:pb-0`,
    !vertical && !alternate && tw`flex-col gap-3`,
    vertical && alternate && !args.isAlternateRight && tw`w-1/2 gap-3 pe-6 pb-12 last:pb-0`,
    vertical && alternate && args.isAlternateRight && tw`ms-auto w-1/2 flex-row-reverse gap-3 pb-12 ps-6 last:pb-0`,
    !vertical && alternate && tw`grid min-w-0 grid-rows-[1fr_auto_1fr] gap-3`,
    args.class
  );
}

function timelineContentVariants(
  args: Pick<TimelineItemContext, "orientation" | "variant" | "isAlternateRight"> & { class?: string }
): string {
  const vertical = args.orientation === "vertical";
  const alternate = args.variant === "alternate";

  return cn(
    timelineContentTw,
    alternate && vertical && !args.isAlternateRight && tw`text-end`,
    alternate && !vertical && !args.isAlternateRight && tw`row-start-3 pt-2`,
    alternate && !vertical && args.isAlternateRight && tw`row-start-1 pb-2`,
    args.class
  );
}

function timelineDotVariants(
  args: Pick<TimelineItemContext, "status" | "orientation" | "variant" | "isAlternateRight"> & { class?: string }
): string {
  const vertical = args.orientation === "vertical";
  const alternate = args.variant === "alternate";

  // Die Compound-Variants "bg-background" der Vorlage (alternate + completed/active) entfallen: Die Basis setzt es bereits
  return cn(
    timelineDotTw,
    timelineDotStatusTw[args.status],
    alternate && vertical && !args.isAlternateRight && tw`absolute -inset-e-[calc(var(--timeline-dot-size)/2-var(--timeline-connector-thickness)/2)]`,
    alternate && vertical && args.isAlternateRight && tw`absolute -inset-s-[calc(var(--timeline-dot-size)/2-var(--timeline-connector-thickness)/2)]`,
    alternate && !vertical && tw`row-start-2`,
    args.class
  );
}

function timelineConnectorVariants(
  args: Pick<TimelineItemContext, "orientation" | "variant" | "isAlternateRight"> & {
    isCompleted: boolean;
    class?: string;
  }
): string {
  const vertical = args.orientation === "vertical";
  const alternate = args.variant === "alternate";

  return cn(
    timelineConnectorTw,
    args.isCompleted ? tw`bg-primary` : tw`bg-border`,
    vertical && !alternate && tw`inset-s-[calc(var(--timeline-dot-size)/2-var(--timeline-connector-thickness)/2)] top-3 h-[calc(100%+0.5rem)] w-(--timeline-connector-thickness)`,
    !vertical && !alternate && tw`inset-s-3 top-[calc(var(--timeline-dot-size)/2-var(--timeline-connector-thickness)/2)] h-(--timeline-connector-thickness) w-[calc(100%+0.5rem)]`,
    vertical && alternate && !args.isAlternateRight && tw`top-2 -inset-e-[calc(var(--timeline-connector-thickness)/2)] h-full w-(--timeline-connector-thickness)`,
    vertical && alternate && args.isAlternateRight && tw`top-2 -inset-s-[calc(var(--timeline-connector-thickness)/2)] h-full w-(--timeline-connector-thickness)`,
    !vertical && alternate && tw`inset-s-3 top-[calc(var(--timeline-dot-size)/2-var(--timeline-connector-thickness)/2)] row-start-2 h-(--timeline-connector-thickness) w-[calc(100%+0.5rem)]`,
    args.class
  );
}

function renderElement(tag: string, attributes: HtmlAttributes, children?: Children): string {
  return `<${tag}${renderAttributes(attributes)}>${renderChildren(children)}</${tag}>`;
}

/**
 * Timeline: Container für die Items.
 *
 * Das Root berechnet den Kontext jedes Items (Status, Alternate-Seite, Status des Folge-Items) und gibt ihn an
 * `TimelineItem` weiter. Hat ein Item eine Funktion als `children`, erhält sie diesen Kontext, der an
 * `TimelineDot`, `TimelineConnector` und `TimelineContent` weitergereicht wird.
 */
export function Timeline(args: TimelineArgs = {}): string {
  const orientation = args.orientation ?? DEFAULT_TIMELINE_ORIENTATION;
  const variant = args.variant ?? DEFAULT_TIMELINE_VARIANT;
  const items = args.items ?? [];

  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildTimelineDataAttributes(orientation, variant),
    role: "list",
    "aria-orientation": orientation,
    class: timelineVariants({ orientation, variant, class: args.class }),
  };
  if (args.dir) attrs.dir = args.dir;

  const root = { orientation, variant, dir: args.dir, activeIndex: args.activeIndex };

  const content = items
    .map((item, index) => TimelineItem({ ...item, context: buildTimelineItemContext(root, index, items.length) }))
    .join("");

  return `<div${renderAttributes(attrs)}>${content}</div>`;
}

/** Ein Eintrag der Timeline. Der Kontext stammt vom Root (`Timeline`). */
export function TimelineItem(args: TimelineItemArgs): string {
  const { context } = args;

  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildTimelineItemDataAttributes(context),
    role: "listitem",
    class: timelineItemVariants({ ...context, class: args.class }),
  };
  if (args.id) attrs.id = args.id;
  if (context.dir) attrs.dir = context.dir;
  if (context.status === "active") attrs["aria-current"] = "step";

  const children = typeof args.children === "function" ? args.children(context) : args.children;

  return renderElement("div", attrs, children);
}

/** Inhalt eines Items (Header und Description) */
export function TimelineContent(args: TimelineContentArgs): string {
  const { context } = args;

  return renderElement(
    "div",
    {
      ...args.attributes,
      ...buildTimelineContentDataAttributes(context),
      class: timelineContentVariants({ ...context, class: args.class }),
    },
    args.children
  );
}

/** Marker eines Items. Eigene Icons oder Inhalte kommen über `children`, die Größe über `--timeline-dot-size`. */
export function TimelineDot(args: TimelineDotArgs): string {
  const { context } = args;

  return renderElement(
    "div",
    {
      ...args.attributes,
      ...buildTimelineDotDataAttributes(context),
      class: timelineDotVariants({ ...context, class: args.class }),
    },
    args.children
  );
}

/** Linie zum folgenden Item. Beim letzten Item entfällt sie, außer mit `forceMount`. */
export function TimelineConnector(args: TimelineConnectorArgs): string {
  const { context } = args;

  const isLast = context.nextStatus === undefined;
  if (!args.forceMount && isLast) return "";

  const isCompleted = isTimelineConnectorCompleted(context);

  return renderElement(
    "div",
    {
      ...args.attributes,
      ...buildTimelineConnectorDataAttributes(context),
      "aria-hidden": "true",
      class: timelineConnectorVariants({ ...context, isCompleted, class: args.class }),
    },
    args.children
  );
}

/** Container für Titel und Zeit eines Items */
export function TimelineHeader(args: TimelineHeaderArgs = {}): string {
  return renderElement(
    "div",
    {
      ...args.attributes,
      ...buildTimelineSlotAttributes("timeline-header"),
      class: cn(timelineHeaderTw, args.class),
    },
    args.children
  );
}

/** Titel eines Items */
export function TimelineTitle(args: TimelineTitleArgs = {}): string {
  return renderElement(
    "div",
    {
      ...args.attributes,
      ...buildTimelineSlotAttributes("timeline-title"),
      class: cn(timelineTitleTw, args.class),
    },
    args.children
  );
}

/** Beschreibung eines Items */
export function TimelineDescription(args: TimelineDescriptionArgs = {}): string {
  return renderElement(
    "div",
    {
      ...args.attributes,
      ...buildTimelineSlotAttributes("timeline-description"),
      class: cn(timelineDescriptionTw, args.class),
    },
    args.children
  );
}

/** Semantisches `<time>`-Element; `dateTime` wird als Attribut `datetime` ausgegeben */
export function TimelineTime(args: TimelineTimeArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildTimelineSlotAttributes("timeline-time"),
    class: cn(timelineTimeTw, args.class),
  };
  if (args.dateTime) attrs.datetime = args.dateTime;

  return renderElement("time", attrs, args.children);
}
