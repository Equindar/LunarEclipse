import { cn } from "../../utils/cn";
import { escapeHtml } from "../../utils/escapeHtml";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import {
    buildProgressIndicatorStyle,
    buildProgressPartAttributes,
    buildProgressPercentExpression,
    buildProgressRootAttributes,
    buildProgressTextExpression,
    formatProgressValue,
    resolveProgressRange,
} from "./Progress.expressions";
import type {
    ProgressArgs,
    ProgressIndicatorArgs,
    ProgressLabelArgs,
    ProgressTrackArgs,
    ProgressValueArgs,
} from "./Progress.types";

/**
 * Klassen von shadcn/ui (Base-Variante, Style "vega").
 * Die Quelle verwendet Platzhalter-Klassen (cn-progress-*), die konkreten Klassen stammen aus style-vega.css.
 * Der Root hat keine eigene Optik: `cn-progress-root` ist im Style nicht definiert (nur `cn-progress`).
 */
const progressTw = tw`flex flex-wrap gap-3`;
const progressTrackTw = tw`bg-muted h-1.5 rounded-full relative flex w-full items-center overflow-x-hidden`;
const progressIndicatorTw = tw`bg-primary h-full transition-all`;
const progressLabelTw = tw`text-sm font-medium`;
const progressValueTw = tw`text-muted-foreground ml-auto text-sm tabular-nums`;

/**
 * Progress: Root mit role="progressbar", Kinder (z. B. Label und Value) und der Track mit Indicator.
 * Ohne `value` ist der Fortschritt unbestimmt. Mit `valueSignal` folgt die Anzeige einem Datastar-Signal.
 * Nutzer-Attribute werden zuerst übernommen und von den Standard-Attributen überschrieben.
 */
export function Progress(args: ProgressArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildProgressRootAttributes(args),
    class: cn(progressTw, args.class),
  };

  const measure = { value: args.value, min: args.min, max: args.max, valueSignal: args.valueSignal };
  const track = ProgressTrack({ ...measure, children: ProgressIndicator(measure) });

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}${track}</div>`;
}

/** Schiene, in der der Indicator liegt */
export function ProgressTrack(args: ProgressTrackArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildProgressPartAttributes("progress-track", args),
    class: cn(progressTrackTw, args.class),
  };

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Gefüllter Teil des Tracks; die Breite kommt aus `value` (statisch) und `valueSignal` (reaktiv) */
export function ProgressIndicator(args: ProgressIndicatorArgs = {}): string {
  const range = resolveProgressRange(args);

  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildProgressPartAttributes("progress-indicator", args),
    class: cn(progressIndicatorTw, args.class),
  };

  const style = buildProgressIndicatorStyle(args.value, range);
  if (style) attrs.style = style;
  if (args.valueSignal) attrs["data-style:width"] = buildProgressPercentExpression(args.valueSignal, range);

  return `<div${renderAttributes(attrs)}></div>`;
}

/** Beschriftung; `id` ist die ID des Roots, das Label bekommt `<id>-label` (Root mit `hasLabel`) */
export function ProgressLabel(args: ProgressLabelArgs): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildProgressPartAttributes("progress-label", args),
    id: `${args.id}-label`,
    class: cn(progressLabelTw, args.class),
  };

  return `<span${renderAttributes(attrs)}>${renderChildren(args.children)}</span>`;
}

/**
 * Wertanzeige (standardmäßig Prozent). Für Screenreader ausgeblendet (aria-hidden),
 * weil der Root den Wert über aria-valuetext bereitstellt.
 */
export function ProgressValue(args: ProgressValueArgs = {}): string {
  const range = resolveProgressRange(args);

  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildProgressPartAttributes("progress-value", args),
    "aria-hidden": "true",
    class: cn(progressValueTw, args.class),
  };

  const hasChildren = args.children !== undefined;
  if (args.valueSignal && !hasChildren) attrs["data-text"] = buildProgressTextExpression(args.valueSignal, range, args);

  const content = hasChildren ? renderChildren(args.children) : escapeHtml(formatProgressValue(args.value, range, args));

  return `<span${renderAttributes(attrs)}>${content}</span>`;
}
