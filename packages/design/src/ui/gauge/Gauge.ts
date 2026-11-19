import { cn } from "../../utils/cn";
import { escapeHtml } from "../../utils/escapeHtml";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import { withSlot } from "../../utils/withSlot";
import {
    buildGaugeDataAttributes,
    buildGaugeRangeDataAttributes,
    buildGaugeStateAttributes,
    createGaugeContext,
    describeArc,
    getRangeDashOffset,
    roundGaugeNumber,
} from "./Gauge.expressions";
import type {
    GaugeArgs,
    GaugeCombinedArgs,
    GaugeIndicatorArgs,
    GaugeLabelArgs,
    GaugeRangeArgs,
    GaugeTrackArgs,
    GaugeValueTextArgs,
} from "./Gauge.types";

/**
 * Tailwind-Klassen der Teile (Dice UI, Base-Variante). Die Quelle enthält bereits konkrete Klassen,
 * es sind keine Platzhalter (cn-*) aufzulösen.
 */
const gaugeTw = tw`relative inline-flex w-fit flex-col items-center justify-center`;
const gaugeIndicatorTw = tw`transform`;
const gaugeTrackTw = tw`text-muted-foreground/20`;
const gaugeRangeTw = tw`text-primary transition-[stroke-dashoffset] duration-700 ease-out`;
const gaugeValueTextTw = tw`absolute right-0 left-0 flex -translate-y-1/2 items-center justify-center text-2xl font-medium`;
const gaugeLabelTw = tw`mt-2 text-sm font-medium text-muted-foreground`;

/**
 * Gauge: Anzeige eines Werts auf einem Kreis oder Teilkreis (role="meter").
 *
 * Statt des React-Contexts übergibt der Root den berechneten Context an die Children-Funktion:
 * `Gauge({ value: 75, children: (context) => [GaugeIndicator({ context, ... }), GaugeValueText({ context })] })`
 *
 * aria-labelledby und aria-describedby werden nur gesetzt, wenn GaugeLabel bzw. GaugeValueText
 * in der Children-Funktion gerendert wurden (sonst würden sie auf nicht vorhandene IDs verweisen).
 */
export function Gauge(args: GaugeArgs = {}): string {
  const context = createGaugeContext(args, args.id);

  // Die Children müssen vor den Attributen entstehen, weil die Teile in context.usage vermerken, was gerendert wurde.
  const content = typeof args.children === "function" ? args.children(context) : args.children;

  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, "gauge"),
    role: "meter",
    "aria-valuemax": context.max,
    "aria-valuemin": context.min,
    ...buildGaugeDataAttributes(context),
    class: cn(gaugeTw, args.class),
  };

  if (args.id) attrs.id = args.id;
  if (context.value !== null) attrs["aria-valuenow"] = context.value;
  if (context.valueText !== undefined) attrs["aria-valuetext"] = context.valueText;
  if (context.valueText !== undefined && context.usage.valueText) attrs["aria-describedby"] = context.ids.valueText;
  if (context.usage.label) attrs["aria-labelledby"] = context.ids.label;

  return `<div${renderAttributes(attrs)}>${renderChildren(content)}</div>`;
}

/** SVG-Container für Track und Range (dekorativ, aria-hidden) */
export function GaugeIndicator(args: GaugeIndicatorArgs): string {
  const { context } = args;

  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, "gauge-indicator"),
    "aria-hidden": "true",
    focusable: "false",
    viewBox: `0 0 ${context.size} ${context.size}`,
    ...buildGaugeDataAttributes(context),
    width: context.size,
    height: context.size,
    class: cn(gaugeIndicatorTw, args.class),
  };

  return `<svg${renderAttributes(attrs)}>${renderChildren(args.children)}</svg>`;
}

/** Hintergrundbogen für den gesamten Wertebereich */
export function GaugeTrack(args: GaugeTrackArgs): string {
  const { context } = args;

  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, "gauge-track"),
    ...buildGaugeStateAttributes(context),
    d: describeArc(context.center, context.center, context.radius, context.startAngle, context.endAngle),
    fill: "none",
    stroke: "currentColor",
    "stroke-width": context.thickness,
    "stroke-linecap": "round",
    "vector-effect": "non-scaling-stroke",
    class: cn(gaugeTrackTw, args.class),
  };

  return `<path${renderAttributes(attrs)}></path>`;
}

/** Bogen für den aktuellen Wert (gefüllt über stroke-dashoffset) */
export function GaugeRange(args: GaugeRangeArgs): string {
  const { context } = args;

  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, "gauge-range"),
    ...buildGaugeRangeDataAttributes(context),
    d: describeArc(context.center, context.center, context.radius, context.startAngle, context.endAngle),
    fill: "none",
    stroke: "currentColor",
    "stroke-width": context.thickness,
    "stroke-linecap": "round",
    "stroke-dasharray": roundGaugeNumber(context.arcLength),
    "stroke-dashoffset": roundGaugeNumber(getRangeDashOffset(context)),
    "vector-effect": "non-scaling-stroke",
    class: cn(gaugeRangeTw, args.class),
  };

  return `<path${renderAttributes(attrs)}></path>`;
}

/** Text in der Mitte des sichtbaren Bogens; ohne `children` der formatierte Wert */
export function GaugeValueText(args: GaugeValueTextArgs): string {
  const { context } = args;
  context.usage.valueText = true;

  // Ein style des Nutzers steht hinter der berechneten Position und kann sie überschreiben.
  const userStyle = typeof args.attributes?.style === "string" ? args.attributes.style : "";
  const style = `top: ${roundGaugeNumber(context.arcCenterY)}px;${userStyle ? ` ${userStyle}` : ""}`;

  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, "gauge-value-text"),
    ...buildGaugeStateAttributes(context),
    id: context.ids.valueText,
    style,
    class: cn(gaugeValueTextTw, args.class),
  };

  const content = args.children !== undefined ? renderChildren(args.children) : escapeHtml(context.valueText ?? "");

  return `<div${renderAttributes(attrs)}>${content}</div>`;
}

/** Beschriftung unterhalb des Gauges (wird über aria-labelledby mit dem Root verknüpft) */
export function GaugeLabel(args: GaugeLabelArgs): string {
  const { context } = args;
  context.usage.label = true;

  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, "gauge-label"),
    ...buildGaugeStateAttributes(context),
    id: context.ids.label,
    class: cn(gaugeLabelTw, args.class),
  };

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Alle Teile in einem: Indicator mit Track und Range, Werttext und optional ein Label */
export function GaugeCombined(args: GaugeCombinedArgs = {}): string {
  const { label, ...rootArgs } = args;

  return Gauge({
    ...rootArgs,
    children: (context) => [
      GaugeIndicator({ context, children: [GaugeTrack({ context }), GaugeRange({ context })] }),
      GaugeValueText({ context }),
      ...(label ? [GaugeLabel({ context, children: escapeHtml(label) })] : []),
    ],
  });
}
