import { cn } from "../../utils/cn";
import { renderChildren } from "../../utils/renderChildren";
import { type HtmlAttributes, renderAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import {
    buildInitialSignals,
    buildIsActiveExpression,
    buildIsCompletedExpression,
    buildIsNotLastExpression,
    buildItemDisabledExpression,
    buildNavigateHandler,
    buildNextClickHandler,
    buildNextDisabledExpression,
    buildPositionExpression,
    buildPrevClickHandler,
    buildPrevDisabledExpression,
    buildStateExpression,
    buildTabIndexExpression,
    buildTriggerClickHandler,
    buildTriggerDisabledExpression,
    buildTriggerFocusHandler,
    buildTriggerKeydownHandler,
    buildTriggerMouseDownHandler,
    DEFAULT_ACTIVATION_MODE,
    DEFAULT_ORIENTATION,
    generateStepperId,
    getStepperPartId,
    GO_EVENT,
    stepperSignals,
} from "./Stepper.expressions";
import type {
    StepperArgs,
    StepperContentArgs,
    StepperDescriptionArgs,
    StepperIndicatorArgs,
    StepperItemArgs,
    StepperListArgs,
    StepperNextArgs,
    StepperOrientation,
    StepperPrevArgs,
    StepperSeparatorArgs,
    StepperTitleArgs,
    StepperTriggerArgs,
} from "./Stepper.types";

/*
 * Stepper aus Dice UI (Base-Variante, Style "nova"), das auf shadcn/ui basiert.
 * Die Quelle verwendet Platzhalter-Klassen (cn-stepper*), die konkreten Klassen stammen aus style-nova.css.
 * Funktioniert nur mit geladenem Datastar.
 */

const stepperTw = tw`flex gap-6`;
const stepperListTw = tw`flex outline-none`;
const stepperItemTw = tw`relative flex items-center not-last:flex-1`;
const stepperTriggerTw = tw`inline-flex items-center justify-center gap-2 rounded-lg text-left transition-all outline-none not-has-data-[slot=description]:rounded-full not-has-data-[slot=title]:rounded-full focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`;
const stepperIndicatorTw = tw`flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-muted bg-background text-sm font-medium text-muted-foreground transition-colors data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=completed]:border-primary data-[state=completed]:bg-primary data-[state=completed]:text-primary-foreground`;
const stepperSeparatorTw = tw`bg-border transition-colors data-[state=active]:bg-primary data-[state=completed]:bg-primary`;
// "cn-font-heading" der Quelle ist `font-heading` (Theme-Token --font-heading)
const stepperTitleTw = tw`font-heading text-sm font-medium`;
const stepperDescriptionTw = tw`text-xs text-muted-foreground`;
const stepperContentTw = tw`flex-1 outline-none`;

/** Häkchen für abgeschlossene Schritte (Lucide "Check", Klasse cn-stepper-indicator-2 = size-4) */
const DEFAULT_CHECK_ICON = `<svg class="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`;

/** Klasse nur ausgeben, wenn sie nicht leer ist */
function setClass(attrs: HtmlAttributes, ...inputs: Parameters<typeof cn>): void {
  const className = cn(...inputs);
  if (className) attrs.class = className;
}

/**
 * Stepper-Root: hält den Zustand (Signale) und nimmt Wechselwünsche der Teile entgegen.
 * Alle Teile bekommen dieselbe `id` wie der Root.
 */
export function Stepper(args: StepperArgs): string {
  const id = args.id || generateStepperId();
  const orientation = args.orientation ?? DEFAULT_ORIENTATION;
  const signals = stepperSignals(id, buildInitialSignals(args));

  const attrs: HtmlAttributes = {
    ...args.attributes,
    id,
    "data-slot": "stepper",
    "data-orientation": orientation,
    "data-activation-mode": args.activationMode ?? DEFAULT_ACTIVATION_MODE,
    "data-signals": signals.dataSignals,
    [`data-on:${GO_EVENT}`]: buildNavigateHandler(id, args.onValidate, args.onValueChange),
  };
  if (args.dir) attrs.dir = args.dir;
  if (args.disabled) attrs["data-disabled"] = "";
  if (args.loop) attrs["data-loop"] = true;
  if (args.nonInteractive) attrs["data-non-interactive"] = true;
  setClass(attrs, stepperTw, orientation === "horizontal" ? "w-full flex-col" : "flex-row", args.class);

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Liste der Schritte (role="tablist") */
export function StepperList(args: StepperListArgs = {}): string {
  const orientation: StepperOrientation = args.orientation ?? DEFAULT_ORIENTATION;

  const attrs: HtmlAttributes = {
    ...args.attributes,
    role: "tablist",
    "aria-orientation": orientation,
    "data-slot": "stepper-list",
    "data-orientation": orientation,
  };
  setClass(attrs, stepperListTw, orientation === "horizontal" ? "flex-row items-center" : "flex-col items-start", args.class);

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Ein Schritt (Trigger und Separator liegen darin) */
export function StepperItem(args: StepperItemArgs): string {
  const orientation = args.orientation ?? DEFAULT_ORIENTATION;

  const attrs: HtmlAttributes = {
    ...args.attributes,
    "data-slot": "stepper-item",
    "data-orientation": orientation,
    "data-attr:data-state": buildStateExpression(args.id, args.value),
    "data-attr:data-disabled": `${buildItemDisabledExpression(args.id, args.value)} ? '' : null`,
  };
  setClass(attrs, stepperItemTw, orientation === "horizontal" ? "flex-row" : "flex-col", args.class);

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Klickbarer Auslöser eines Schritts (`<button role="tab">`) */
export function StepperTrigger(args: StepperTriggerArgs): string {
  const { id, value } = args;
  const s = stepperSignals(id);
  const titleId = getStepperPartId(id, "title", value);
  const descriptionId = getStepperPartId(id, "description", value);

  const attrs: HtmlAttributes = {
    ...args.attributes,
    id: getStepperPartId(id, "trigger", value),
    role: "tab",
    type: "button",
    "aria-controls": getStepperPartId(id, "content", value),
    "aria-describedby": `${titleId} ${descriptionId}`,
    "data-slot": "stepper-trigger",
    "data-step": value,
    "data-attr:aria-current": `${buildIsActiveExpression(id, value)} ? 'step' : null`,
    "data-attr:aria-selected": `${buildIsActiveExpression(id, value)} ? 'true' : 'false'`,
    "data-attr:aria-posinset": `String(${buildPositionExpression(id, value)})`,
    "data-attr:aria-setsize": `String(${s.signal("steps")}.length)`,
    "data-attr:tabindex": buildTabIndexExpression(id, value),
    "data-attr:data-state": buildStateExpression(id, value),
    "data-on:click": buildTriggerClickHandler(id, value),
    "data-on:focus": buildTriggerFocusHandler(id, value),
    "data-on:keydown": buildTriggerKeydownHandler(id),
    "data-on:mousedown": buildTriggerMouseDownHandler(),
  };

  if (args.disabled) {
    attrs.disabled = true;
    attrs["data-disabled"] = "";
  } else {
    // Als Signal-Ausdruck: Root-disabled oder Schritt in disabledSteps
    attrs["data-attr:disabled"] = buildTriggerDisabledExpression(id, value);
    attrs["data-attr:data-disabled"] = `(${buildTriggerDisabledExpression(id, value)}) ? '' : null`;
  }
  setClass(attrs, stepperTriggerTw, args.class);

  return `<button${renderAttributes(attrs)}>${renderChildren(args.children)}</button>`;
}

/**
 * Kreis mit Nummer oder Häkchen.
 * Ohne `children`: Nummer, bei abgeschlossenen Schritten das Häkchen (`completedIcon`).
 * Mit `children`: der Inhalt wird immer angezeigt.
 */
export function StepperIndicator(args: StepperIndicatorArgs): string {
  const { id, value } = args;

  const attrs: HtmlAttributes = {
    ...args.attributes,
    "data-slot": "stepper-indicator",
    "data-attr:data-state": buildStateExpression(id, value),
  };
  setClass(attrs, stepperIndicatorTw, args.class);

  let content: string;
  if (args.children !== undefined) {
    content = renderChildren(args.children);
  } else {
    const completed = buildIsCompletedExpression(id, value);
    const number = `<span${renderAttributes({ "data-show": `!(${completed})`, "data-text": buildPositionExpression(id, value) })}></span>`;
    const icon = `<span${renderAttributes({ class: "contents", "data-show": completed, style: "display: none;" })}>${args.completedIcon ?? DEFAULT_CHECK_ICON}</span>`;
    content = number + icon;
  }

  return `<div${renderAttributes(attrs)}>${content}</div>`;
}

/** Linie zwischen zwei Schritten; beim letzten Schritt ausgeblendet (außer mit `forceMount`) */
export function StepperSeparator(args: StepperSeparatorArgs): string {
  const { id, value } = args;
  const orientation = args.orientation ?? DEFAULT_ORIENTATION;

  const attrs: HtmlAttributes = {
    ...args.attributes,
    role: "separator",
    "aria-hidden": "true",
    "aria-orientation": orientation,
    "data-slot": "stepper-separator",
    "data-orientation": orientation,
    "data-attr:data-state": buildStateExpression(id, value, "separator"),
  };
  if (!args.forceMount) attrs["data-show"] = buildIsNotLastExpression(id, value);
  setClass(attrs, stepperSeparatorTw, orientation === "horizontal" ? "h-px flex-1" : "h-10 w-px", args.class);

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Titel eines Schritts (wird vom Trigger per aria-describedby referenziert) */
export function StepperTitle(args: StepperTitleArgs): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    id: getStepperPartId(args.id, "title", args.value),
    "data-slot": "title",
  };
  setClass(attrs, stepperTitleTw, args.class);

  return `<span${renderAttributes(attrs)}>${renderChildren(args.children)}</span>`;
}

/** Beschreibung eines Schritts (wird vom Trigger per aria-describedby referenziert) */
export function StepperDescription(args: StepperDescriptionArgs): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    id: getStepperPartId(args.id, "description", args.value),
    "data-slot": "description",
  };
  setClass(attrs, stepperDescriptionTw, args.class);

  return `<span${renderAttributes(attrs)}>${renderChildren(args.children)}</span>`;
}

/**
 * Inhalt eines Schritts (role="tabpanel"), nur beim aktiven Schritt sichtbar.
 * Das style-Attribut gehört der Komponente (display: none vor dem Laden von Datastar).
 */
export function StepperContent(args: StepperContentArgs): string {
  const { id, value } = args;

  const attrs: HtmlAttributes = {
    ...args.attributes,
    id: getStepperPartId(id, "content", value),
    role: "tabpanel",
    "aria-labelledby": getStepperPartId(id, "trigger", value),
    "data-slot": "stepper-content",
  };
  if (!args.forceMount) {
    attrs["data-show"] = buildIsActiveExpression(id, value);
    attrs.style = "display: none;";
  }
  setClass(attrs, stepperContentTw, args.class);

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/**
 * Attribute des Zurück-Buttons (ohne class). Zum Zusammensetzen mit Button:
 * `Button({ variant: "outline", children: "Previous", attributes: stepperPrevAttributes({ id }) })`
 * (ersetzt die render-Prop des Originals).
 */
export function stepperPrevAttributes(args: Pick<StepperPrevArgs, "id" | "disabled" | "attributes">): HtmlAttributes {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    type: "button",
    "data-slot": "stepper-prev",
    "data-on:click": buildPrevClickHandler(args.id),
  };
  if (args.disabled) attrs.disabled = true;
  else attrs["data-attr:disabled"] = buildPrevDisabledExpression(args.id);
  return attrs;
}

/** Attribute des Weiter-Buttons (ohne class), siehe `stepperPrevAttributes` */
export function stepperNextAttributes(args: Pick<StepperNextArgs, "id" | "disabled" | "attributes">): HtmlAttributes {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    type: "button",
    "data-slot": "stepper-next",
    "data-on:click": buildNextClickHandler(args.id),
  };
  if (args.disabled) attrs.disabled = true;
  else attrs["data-attr:disabled"] = buildNextDisabledExpression(args.id);
  return attrs;
}

/** Zurück-Button ohne Styling (für einen gestylten Button `stepperPrevAttributes` mit Button nutzen) */
export function StepperPrev(args: StepperPrevArgs): string {
  const attrs = stepperPrevAttributes(args);
  setClass(attrs, args.class);
  return `<button${renderAttributes(attrs)}>${renderChildren(args.children)}</button>`;
}

/** Weiter-Button ohne Styling (für einen gestylten Button `stepperNextAttributes` mit Button nutzen) */
export function StepperNext(args: StepperNextArgs): string {
  const attrs = stepperNextAttributes(args);
  setClass(attrs, args.class);
  return `<button${renderAttributes(attrs)}>${renderChildren(args.children)}</button>`;
}
