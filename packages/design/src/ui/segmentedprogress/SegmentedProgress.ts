import { cn } from "../../utils/cn";
import { buildProgressPartAttributes, buildProgressRootAttributes, resolveProgressRange } from "../../utils/progressValue";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import {
    buildSegmentIndicatorStyle,
    buildSegmentWidthExpression,
    normalizeSegmentCount,
} from "./SegmentedProgress.expressions";
import type {
    SegmentedProgressArgs,
    SegmentedProgressSegmentArgs,
    SegmentedProgressShape,
    SegmentedProgressTrackArgs,
} from "./SegmentedProgress.types";

/**
 * Klassen angelehnt an shadcn/ui Progress (Base, Style "vega"), ergänzt um Segmente.
 * Rounded: jedes Segment ist eine Pille. Slanted: jedes Segment ist um 12 Grad nach rechts geneigt
 * (negatives skewX), der Indicator im Segment wird mitgeneigt.
 */
const segmentedProgressTw = tw`flex flex-wrap gap-3`;
const segmentedProgressTrackTw = tw`flex h-2 w-full items-stretch gap-1`;
const segmentedProgressSegmentTw = tw`bg-muted relative h-full min-w-0 flex-1 overflow-hidden`;
const segmentedProgressIndicatorTw = tw`bg-primary h-full transition-all`;

const segmentShapeTw: Record<SegmentedProgressShape, string> = {
  rounded: tw`rounded-full`,
  slanted: tw`-skew-x-12`,
};

/**
 * SegmentedProgress: Root mit role="progressbar", Kinder (z. B. ProgressLabel und ProgressValue aus ui/progress)
 * und der Track mit den Segmenten. Ohne `value` ist der Fortschritt unbestimmt.
 * Mit `valueSignal` folgt die Füllung einem Datastar-Signal.
 * Nutzer-Attribute werden zuerst übernommen und von den Standard-Attributen überschrieben.
 */
export function SegmentedProgress(args: SegmentedProgressArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildProgressRootAttributes(args, "segmented-progress"),
    class: cn(segmentedProgressTw, args.class),
  };

  const track = SegmentedProgressTrack({
    value: args.value,
    min: args.min,
    max: args.max,
    valueSignal: args.valueSignal,
    segments: args.segments,
    shape: args.shape,
  });

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}${track}</div>`;
}

/** Container der Segmente (Flex mit Lücken, ohne eigenen Hintergrund) */
export function SegmentedProgressTrack(args: SegmentedProgressTrackArgs = {}): string {
  const count = normalizeSegmentCount(args.segments);

  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildProgressPartAttributes("segmented-progress-track", args),
    class: cn(segmentedProgressTrackTw, args.class),
  };

  const segments = Array.from({ length: count }, (_, index) =>
    SegmentedProgressSegment({
      index,
      count,
      shape: args.shape,
      value: args.value,
      min: args.min,
      max: args.max,
      valueSignal: args.valueSignal,
    })
  ).join("");

  return `<div${renderAttributes(attrs)}>${segments}</div>`;
}

/** Einzelnes Segment mit innerem Indicator; die Füllung ergibt sich aus Position, Anzahl und Wert */
export function SegmentedProgressSegment(args: SegmentedProgressSegmentArgs): string {
  const range = resolveProgressRange(args);
  const shape: SegmentedProgressShape = args.shape === "slanted" ? "slanted" : "rounded";

  const attrs: HtmlAttributes = {
    ...args.attributes,
    "data-slot": "segmented-progress-segment",
    "data-shape": shape,
    class: cn(segmentedProgressSegmentTw, segmentShapeTw[shape], args.class),
  };

  const indicatorAttrs: HtmlAttributes = {
    "data-slot": "segmented-progress-indicator",
    class: segmentedProgressIndicatorTw,
  };

  const style = buildSegmentIndicatorStyle(args.value, range, args.index, args.count);
  if (style) indicatorAttrs.style = style;
  if (args.valueSignal) {
    indicatorAttrs["data-style:width"] = buildSegmentWidthExpression(args.valueSignal, range, args.index, args.count);
  }

  return `<div${renderAttributes(attrs)}><div${renderAttributes(indicatorAttrs)}></div></div>`;
}
