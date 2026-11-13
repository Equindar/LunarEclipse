import { buildConditional } from "../../utils/buildConditional";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { createSignals } from "../../utils/SignalManager";
import type { SliderArgs, SliderConfig, SliderOrientation, SliderSignals } from "./Slider.types";

/**
 * Datastar-Expressions und Positionierung des Sliders.
 * Der Slider ist eine eigene Implementierung (die Quelle nutzt Base UI): Zustand liegt in Signalen,
 * Ziehen läuft über Pointer-Events am Control, die Tastatur über die Thumbs.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 */

export const DEFAULT_SLIDER_MIN = 0;
export const DEFAULT_SLIDER_MAX = 100;
export const DEFAULT_SLIDER_STEP = 1;
export const DEFAULT_SLIDER_ORIENTATION: SliderOrientation = "horizontal";

/** Größe des Thumbs in rem (size-4 = 1rem); Basis für die Randausrichtung der Thumbs (thumbAlignment="edge") */
export const SLIDER_THUMB_SIZE_REM = 1;

/** PageUp/PageDown bewegen um dieses Vielfache von step */
export const SLIDER_LARGE_STEP_FACTOR = 10;

/* ------------------------------------------------------------------ */
/* Konfiguration und Werte (serverseitig)                              */
/* ------------------------------------------------------------------ */

const round = (value: number, digits = 4): number => Number(value.toFixed(digits));

const isFiniteNumber = (value: number | undefined): value is number =>
  typeof value === "number" && Number.isFinite(value);

/** Anzahl der Nachkommastellen einer Zahl (für das Runden nach dem Einrasten) */
export function countDecimals(value: number): number {
  const text = value.toString();
  const exponent = /e-(\d+)$/.exec(text);
  if (exponent) return Math.min(20, Number(exponent[1]));
  const dot = text.indexOf(".");
  return dot === -1 ? 0 : text.length - dot - 1;
}

/** Wendet die Defaults an und prüft min, max und step */
export function normalizeSliderConfig(args: Pick<SliderArgs, "min" | "max" | "step" | "orientation">): SliderConfig {
  const min = isFiniteNumber(args.min) ? args.min : DEFAULT_SLIDER_MIN;
  const rawMax = isFiniteNumber(args.max) ? args.max : DEFAULT_SLIDER_MAX;
  const step = isFiniteNumber(args.step) && args.step > 0 ? args.step : DEFAULT_SLIDER_STEP;

  return {
    min,
    max: Math.max(min, rawMax),
    step,
    orientation: args.orientation ?? DEFAULT_SLIDER_ORIENTATION,
  };
}

/** Begrenzt auf min/max und rastet auf die Schrittweite ein */
export function snapSliderValue(value: number, cfg: SliderConfig): number {
  const snapped = cfg.min + Math.round((value - cfg.min) / cfg.step) * cfg.step;
  const clamped = Math.min(cfg.max, Math.max(cfg.min, snapped));
  return Number(clamped.toFixed(Math.max(countDecimals(cfg.step), countDecimals(cfg.min))));
}

/** Startwerte des Sliders: defaultValue oder (wie in der Quelle) [min, max] */
export function resolveSliderValues(defaultValue: number[] | undefined, cfg: SliderConfig): number[] {
  const source = defaultValue && defaultValue.length > 0 ? defaultValue : [cfg.min, cfg.max];
  return source.map((value) => snapSliderValue(isFiniteNumber(value) ? value : cfg.min, cfg));
}

/** Position eines Wertes in Prozent (0 bis 100) */
export function sliderPercent(value: number, cfg: SliderConfig): number {
  const span = cfg.max - cfg.min;
  if (span <= 0) return 0;
  return round(Math.min(100, Math.max(0, ((value - cfg.min) / span) * 100)));
}

/* ------------------------------------------------------------------ */
/* Signale und Attribute                                               */
/* ------------------------------------------------------------------ */

/** Signal-Manager eines Sliders (Signal-Name = ID mit "-" zu "_") */
export const sliderSignals = (sliderId: string, values: number[] = []) =>
  createSignals<SliderSignals>(sliderId, { values, active: -1 });

/** Zustands-Attribute, die Base UI an Root, Control, Track, Range und Thumb setzt (Tailwind: data-horizontal:, data-vertical:, data-disabled:) */
export function buildSliderStateAttributes(orientation: SliderOrientation, disabled: boolean): HtmlAttributes {
  return {
    "data-horizontal": orientation === "horizontal",
    "data-vertical": orientation === "vertical",
    "data-disabled": disabled,
  };
}

/* ------------------------------------------------------------------ */
/* Positionierung: serverseitig (Startzustand, kein Flackern)          */
/* ------------------------------------------------------------------ */

const thumbOffsetCss = (percent: number): string =>
  `calc(${percent}% - ${round((percent / 100) * SLIDER_THUMB_SIZE_REM)}rem)`;

const thumbCenterCss = (percent: number): string =>
  `calc(${percent}% + ${round((0.5 - percent / 100) * SLIDER_THUMB_SIZE_REM)}rem)`;

/** Inline-Style eines Thumbs (Randausrichtung: bei 0 % liegt der Thumb am Anfang, bei 100 % am Ende des Tracks) */
export function buildThumbStyle(percent: number, orientation: SliderOrientation): string {
  return orientation === "vertical"
    ? `bottom: ${thumbOffsetCss(percent)}; left: 50%; transform: translateX(-50%);`
    : `inset-inline-start: ${thumbOffsetCss(percent)}; top: 50%; transform: translateY(-50%);`;
}

/** Inline-Style des Bereichs: bei einem Thumb vom Anfang bis zum Thumb, sonst vom ersten bis zum letzten Thumb */
export function buildRangeStyle(values: number[], cfg: SliderConfig): string {
  const percents = values.map((value) => sliderPercent(value, cfg));
  const high = percents.length > 0 ? Math.max(...percents) : 0;
  const start = percents.length > 1 ? thumbCenterCss(Math.min(...percents)) : "0px";
  const end = `calc(100% - ${thumbCenterCss(high)})`;

  return cfg.orientation === "vertical"
    ? `bottom: ${start}; top: ${end};`
    : `inset-inline-start: ${start}; inset-inline-end: ${end};`;
}

/* ------------------------------------------------------------------ */
/* Positionierung: Datastar (data-style, folgt den Signalen)           */
/* ------------------------------------------------------------------ */

const spanOf = (cfg: SliderConfig): number => (cfg.max - cfg.min > 0 ? cfg.max - cfg.min : 1);

/** Prozent eines Wertausdrucks als JS-Code */
const percentJs = (valueExpr: string, cfg: SliderConfig): string =>
  `+Math.min(100, Math.max(0, (${valueExpr} - ${cfg.min}) / ${spanOf(cfg)} * 100)).toFixed(4)`;

/** data-style eines Thumbs (Objekt-Syntax von Datastar) */
export function buildThumbStyleExpression(sliderId: string, index: number, cfg: SliderConfig): string {
  const value = `${sliderSignals(sliderId).signal("values")}[${index}]`;
  const percent = percentJs(value, cfg);

  return cfg.orientation === "vertical"
    ? `(p => ({'bottom': 'calc(' + p + '% - ' + +(p / 100 * ${SLIDER_THUMB_SIZE_REM}).toFixed(4) + 'rem)', 'left': '50%', 'transform': 'translateX(-50%)'}))(${percent})`
    : `(p => ({'inset-inline-start': 'calc(' + p + '% - ' + +(p / 100 * ${SLIDER_THUMB_SIZE_REM}).toFixed(4) + 'rem)', 'top': '50%', 'transform': 'translateY(-50%)'}))(${percent})`;
}

/** data-style des Bereichs (Objekt-Syntax von Datastar) */
export function buildRangeStyleExpression(sliderId: string, cfg: SliderConfig): string {
  const values = sliderSignals(sliderId).signal("values");
  const [startKey, endKey] = cfg.orientation === "vertical" ? ["bottom", "top"] : ["inset-inline-start", "inset-inline-end"];

  return `(v => { const p = (x) => ${percentJs("x", cfg)}, c = (q) => 'calc(' + q + '% + ' + +((0.5 - q / 100) * ${SLIDER_THUMB_SIZE_REM}).toFixed(4) + 'rem)', end = c(p(Math.max(...v))), start = v.length > 1 ? c(p(Math.min(...v))) : '0px'; return {'${startKey}': start, '${endKey}': 'calc(100% - ' + end + ')'}; })(${values})`;
}

/* ------------------------------------------------------------------ */
/* Datastar-Handler                                                    */
/* ------------------------------------------------------------------ */

const decimalsOf = (cfg: SliderConfig): number => Math.max(countDecimals(cfg.step), countDecimals(cfg.min));

/** Mehrere Statements als sofort ausgeführte Funktion (ein einzelner Ausdruck für das Attribut) */
const iife = (...statements: string[]): string => `(() => { ${statements.join("; ")}; })()`;

/** JS: snap(x) begrenzt und rastet auf die Schrittweite ein */
const snapJs = (cfg: SliderConfig): string =>
  `const snap = (x) => Number(Math.min(${cfg.max}, Math.max(${cfg.min}, ${cfg.min} + Math.round((x - ${cfg.min}) / ${cfg.step}) * ${cfg.step})).toFixed(${decimalsOf(cfg)}))`;

/** JS: place(vals, i, x) setzt den Wert des Thumbs i, ohne dass er an den Nachbarn vorbeiläuft */
const placeJs = (cfg: SliderConfig): string =>
  `const place = (vals, i, x) => { const lo = i > 0 ? vals[i - 1] : ${cfg.min}; const hi = i < vals.length - 1 ? vals[i + 1] : ${cfg.max}; return vals.map((y, k) => k === i ? Math.min(hi, Math.max(lo, x)) : y); }`;

/** JS: berechnet aus der Pointer-Position den eingerasteten Wert `v` (berücksichtigt Thumb-Größe und RTL) */
const pointerValueJs = (cfg: SliderConfig): string => {
  const thumb = `const r = el.getBoundingClientRect(); const t = parseFloat(getComputedStyle(document.documentElement).fontSize) * ${SLIDER_THUMB_SIZE_REM}`;
  const fraction =
    cfg.orientation === "vertical"
      ? `let f = 1 - (evt.clientY - r.top - t / 2) / ((r.height - t) || 1)`
      : `let f = (evt.clientX - r.left - t / 2) / ((r.width - t) || 1); if (getComputedStyle(el).direction === 'rtl') f = 1 - f`;

  return [thumb, fraction, `f = Math.min(1, Math.max(0, f))`, `const v = snap(${cfg.min} + f * ${spanOf(cfg)})`].join("; ");
};

/** pointerdown am Control: nächstgelegenen Thumb wählen, Wert setzen, Ziehen starten */
export function buildPointerDownHandler(sliderId: string, cfg: SliderConfig): string {
  const s = sliderSignals(sliderId);

  return iife(
    snapJs(cfg),
    placeJs(cfg),
    `evt.preventDefault()`,
    pointerValueJs(cfg),
    `const vals = ${s.signal("values")}`,
    `let i = 0`,
    `vals.forEach((y, k) => { const dk = Math.abs(y - v); const di = Math.abs(vals[i] - v); if (dk < di || (dk === di && v > y)) i = k; })`,
    s.set("values", "place(vals, i, v)"),
    s.set("active", "i"),
    `el.setPointerCapture(evt.pointerId)`,
    `const thumb = el.querySelectorAll('[data-slot=slider-thumb]')[i]`,
    `if (thumb) thumb.focus()`
  );
}

/** pointermove am Control: nur während des Ziehens den aktiven Thumb bewegen */
export function buildPointerMoveHandler(sliderId: string, cfg: SliderConfig): string {
  const s = sliderSignals(sliderId);
  const action = iife(
    snapJs(cfg),
    placeJs(cfg),
    pointerValueJs(cfg),
    s.set("values", `place(${s.signal("values")}, ${s.signal("active")}, v)`)
  );

  return buildConditional(`${s.signal("active")} >= 0`, action, "null");
}

/** pointerup und pointercancel: Ziehen beenden */
export function buildPointerEndHandler(sliderId: string): string {
  return sliderSignals(sliderId).set("active", "-1");
}

/** keydown am Thumb: Pfeiltasten (step), PageUp/PageDown (10 x step), Home und End */
export function buildKeydownHandler(sliderId: string, index: number, cfg: SliderConfig): string {
  const s = sliderSignals(sliderId);
  const horizontal = cfg.orientation === "horizontal";
  const step = cfg.step;
  const big = round(step * SLIDER_LARGE_STEP_FACTOR, 10);

  return iife(
    snapJs(cfg),
    placeJs(cfg),
    `const vals = ${s.signal("values")}`,
    `const rtl = ${horizontal} && getComputedStyle(el).direction === 'rtl'`,
    `const key = evt.key`,
    `const delta = ({ ArrowRight: rtl ? -${step} : ${step}, ArrowLeft: rtl ? ${step} : -${step}, ArrowUp: ${step}, ArrowDown: -${step}, PageUp: ${big}, PageDown: -${big} })[key]`,
    `const target = key === 'Home' ? ${cfg.min} : key === 'End' ? ${cfg.max} : delta === undefined ? null : vals[${index}] + delta`,
    `if (target === null) return`,
    `evt.preventDefault()`,
    s.set("values", `place(vals, ${index}, snap(target))`)
  );
}
