import { cn } from "../../utils/cn";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import {
    buildKeydownHandler,
    buildPointerDownHandler,
    buildPointerEndHandler,
    buildPointerMoveHandler,
    buildRangeStyle,
    buildRangeStyleExpression,
    buildSliderStateAttributes,
    buildThumbStyle,
    buildThumbStyleExpression,
    normalizeSliderConfig,
    resolveSliderValues,
    sliderPercent,
    sliderSignals,
} from "./Slider.expressions";
import type { SliderArgs } from "./Slider.types";

/**
 * Klassen des Sliders (shadcn/ui, Base-Variante).
 * Die Quelle verwendet Platzhalter-Klassen (cn-slider*), die konkreten Klassen stammen aus dem Style "vega".
 * Ergänzt: "absolute" bei Range und Thumb (Base UI positioniert beide per Inline-Style).
 */
const sliderTw = tw`data-horizontal:w-full data-vertical:h-full`;

const sliderControlTw = tw`relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:w-auto data-vertical:flex-col data-vertical:min-h-40`;

const sliderTrackTw = tw`relative grow overflow-hidden select-none bg-muted rounded-full data-horizontal:h-1.5 data-horizontal:w-full data-vertical:h-full data-vertical:w-1.5`;

const sliderRangeTw = tw`absolute select-none bg-primary data-horizontal:h-full data-vertical:w-full`;

const sliderThumbTw = tw`absolute block shrink-0 select-none disabled:pointer-events-none disabled:opacity-50 border-primary ring-ring/50 size-4 rounded-full border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden`;

/** Zufalls-ID: slider_<8 Hex-Zeichen> */
function createSliderId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return `slider_${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

/**
 * Slider: wählt einen Wert oder einen Bereich aus einem Intervall.
 * Ein Wert in `defaultValue` ergibt einen Thumb, zwei Werte einen Bereich, mehr Werte mehrere Thumbs.
 * Zustand und Interaktion laufen über Datastar (Signale `$<id>.values` und `$<id>.active`).
 * Nutzer-Attribute werden zuerst übernommen und von den Standard-Attributen überschrieben.
 */
export function Slider(args: SliderArgs = {}): string {
  const id = args.id || createSliderId();
  const cfg = normalizeSliderConfig(args);
  const values = resolveSliderValues(args.defaultValue, cfg);
  const disabled = args.disabled === true;
  const signals = sliderSignals(id, values);
  const state = buildSliderStateAttributes(cfg.orientation, disabled);

  const rootAttrs: HtmlAttributes = {
    ...args.attributes,
    id,
    role: "group",
    "data-slot": "slider",
    ...state,
    "data-signals": signals.dataSignals,
    class: cn(sliderTw, args.class),
  };
  if (args.dir) rootAttrs.dir = args.dir;

  // Pointer-Handler am Control; ein deaktivierter Slider bekommt keine Handler
  const controlAttrs: HtmlAttributes = { ...state, class: sliderControlTw };
  if (!disabled) {
    controlAttrs["data-on:pointerdown"] = buildPointerDownHandler(id, cfg);
    controlAttrs["data-on:pointermove"] = buildPointerMoveHandler(id, cfg);
    controlAttrs["data-on:pointerup"] = buildPointerEndHandler(id);
    controlAttrs["data-on:pointercancel"] = buildPointerEndHandler(id);
  }

  const rangeAttrs: HtmlAttributes = {
    "data-slot": "slider-range",
    ...state,
    class: sliderRangeTw,
    style: buildRangeStyle(values, cfg),
    "data-style": buildRangeStyleExpression(id, cfg),
  };

  const track = `<div${renderAttributes({ "data-slot": "slider-track", ...state, class: sliderTrackTw })}><div${renderAttributes(rangeAttrs)}></div></div>`;

  const thumbs = values
    .map((value, index) => {
      const thumbAttrs: HtmlAttributes = {
        role: "slider",
        "data-slot": "slider-thumb",
        ...state,
        "data-index": index,
        tabindex: disabled ? -1 : 0,
        "aria-orientation": cfg.orientation,
        "aria-valuemin": cfg.min,
        "aria-valuemax": cfg.max,
        "aria-valuenow": value,
        "aria-disabled": disabled ? "true" : undefined,
        "aria-label": args.ariaLabel || undefined,
        "aria-labelledby": args.ariaLabelledby || undefined,
        class: sliderThumbTw,
        style: buildThumbStyle(sliderPercent(value, cfg), cfg.orientation),
        "data-attr:aria-valuenow": `${signals.signal("values")}[${index}]`,
        "data-style": buildThumbStyleExpression(id, index, cfg),
      };
      if (!disabled) thumbAttrs["data-on:keydown"] = buildKeydownHandler(id, index, cfg);

      // Verstecktes Input je Thumb, damit der Wert mit einem Formular abgeschickt wird
      const input = args.name
        ? `<input${renderAttributes({
            type: "hidden",
            name: args.name,
            value,
            disabled,
            "data-attr:value": `${signals.signal("values")}[${index}]`,
          })}>`
        : "";

      return `<div${renderAttributes(thumbAttrs)}>${input}</div>`;
    })
    .join("");

  return `<div${renderAttributes(rootAttrs)}><div${renderAttributes(controlAttrs)}>${track}${thumbs}</div></div>`;
}
