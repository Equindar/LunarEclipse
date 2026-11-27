import { cn } from "../../utils/cn";
import {
    buildProgressDataAttr,
    buildProgressPartAttributes,
    buildProgressRootAttributes,
    resolveProgressRange,
} from "../../utils/progressValue";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import {
    buildBaselineUnits,
    buildEllipsisLabel,
    buildEllipsisLabelExpression,
    buildEllipsisVisibleExpression,
    buildIsNewExpression,
    buildUnitCount,
    buildUnitIndicatorStyle,
    buildUnitWidthExpression,
    isNewUnit,
    resolveEllipsis,
    type ResolvedEllipsis,
} from "./SegmentedProgress.ellipsis";
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
const segmentedProgressSegmentTw = tw`group/segment bg-muted relative h-full min-w-0 flex-1 overflow-hidden`;
const segmentedProgressIndicatorTw = tw`bg-primary h-full transition-all`;
/** Neue Punkte (data-new am Segment): im Light Mode dunkler, im Dark Mode heller als bestehende Punkte */
const segmentedProgressNewTw = tw`group-data-new/segment:brightness-50 dark:group-data-new/segment:brightness-150`;
const segmentedProgressEllipsisTw = tw`flex flex-none items-center gap-0.5 px-0.5`;
const segmentedProgressEllipsisDotTw = tw`bg-muted-foreground size-1 rounded-full`;

const segmentShapeTw: Record<SegmentedProgressShape, string> = {
  rounded: tw`rounded-full`,
  slanted: tw`-skew-x-12`,
};

/**
 * SegmentedProgress: Root mit role="progressbar", Kinder (z. B. ProgressLabel und ProgressValue aus ui/progress)
 * und der Track mit den Segmenten. Ohne `value` ist der Fortschritt unbestimmt.
 * Mit `valueSignal` folgt die Füllung einem Datastar-Signal.
 * Mit `ellipsis` steht jedes Segment für einen Punkt: Anfang und Ende der Skala werden gezeigt, dazwischen
 * ein Platzhalter (für offene Skalen mit großem `max`).
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
    ellipsis: args.ellipsis,
    baseline: args.baseline,
  });

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}${track}</div>`;
}

/** Container der Segmente (Flex mit Lücken, ohne eigenen Hintergrund) */
export function SegmentedProgressTrack(args: SegmentedProgressTrackArgs = {}): string {
  const ellipsis = resolveEllipsis(args.ellipsis);

  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildProgressPartAttributes("segmented-progress-track", args),
    class: cn(segmentedProgressTrackTw, args.class),
  };

  return `<div${renderAttributes(attrs)}>${ellipsis ? renderEllipsisSegments(args, ellipsis) : renderSegments(args)}</div>`;
}

/** Gleich breite Segmente, die zusammen den Wertebereich abdecken */
function renderSegments(args: SegmentedProgressTrackArgs): string {
  const count = normalizeSegmentCount(args.segments);

  return Array.from({ length: count }, (_, index) =>
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
}

/** Segmente vor dem Platzhalter, der Platzhalter, Segmente danach (jedes Segment ein Punkt) */
function renderEllipsisSegments(args: SegmentedProgressTrackArgs, layout: ResolvedEllipsis): string {
  const total = layout.head + layout.tail;
  const range = resolveProgressRange(args);
  const count = buildUnitCount(args.value, range);
  const baselineUnits = buildBaselineUnits(args.baseline, range);

  const segment = (index: number): string =>
    SegmentedProgressSegment({
      index,
      count: total,
      unit: true,
      shape: args.shape,
      value: args.value,
      min: args.min,
      max: args.max,
      valueSignal: args.valueSignal,
      isNew: baselineUnits === undefined ? undefined : isNewUnit(count, layout, index, baselineUnits),
      isNewExpression:
        baselineUnits === undefined || !args.valueSignal
          ? undefined
          : buildIsNewExpression(args.valueSignal, range, layout, index, baselineUnits),
    });

  const head = Array.from({ length: layout.head }, (_, i) => segment(i)).join("");
  const tail = Array.from({ length: layout.tail }, (_, i) => segment(layout.head + i)).join("");

  return `${head}${renderEllipsis(args, layout)}${tail}`;
}

/** Platzhalter aus drei Punkten; sichtbar, sobald mehr Punkte vorhanden sind als Segmente */
function renderEllipsis(args: SegmentedProgressTrackArgs, layout: ResolvedEllipsis): string {
  const range = resolveProgressRange(args);
  const count = buildUnitCount(args.value, range);

  const attrs: HtmlAttributes = {
    "data-slot": "segmented-progress-ellipsis",
    "aria-hidden": "true",
    title: buildEllipsisLabel(layout, count),
    class: segmentedProgressEllipsisTw,
  };

  if (count <= layout.head + layout.tail) attrs.style = "display: none;";

  if (args.valueSignal) {
    attrs["data-show"] = buildEllipsisVisibleExpression(args.valueSignal, range, layout);
    attrs["data-attr:title"] = buildEllipsisLabelExpression(args.valueSignal, range, layout);
  }

  const dot = `<span class="${segmentedProgressEllipsisDotTw}"></span>`;
  return `<div${renderAttributes(attrs)}>${dot}${dot}${dot}</div>`;
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

  if (args.isNew) attrs["data-new"] = true;
  if (args.isNewExpression) attrs["data-attr"] = buildProgressDataAttr({ "data-new": args.isNewExpression });

  const indicatorAttrs: HtmlAttributes = {
    "data-slot": "segmented-progress-indicator",
    class: cn(segmentedProgressIndicatorTw, segmentedProgressNewTw),
  };

  const style = args.unit
    ? buildUnitIndicatorStyle(args.value, range, args.index)
    : buildSegmentIndicatorStyle(args.value, range, args.index, args.count);
  if (style) indicatorAttrs.style = style;
  if (args.valueSignal) {
    indicatorAttrs["data-style:width"] = args.unit
      ? buildUnitWidthExpression(args.valueSignal, range, args.index)
      : buildSegmentWidthExpression(args.valueSignal, range, args.index, args.count);
  }

  return `<div${renderAttributes(attrs)}><div${renderAttributes(indicatorAttrs)}></div></div>`;
}
