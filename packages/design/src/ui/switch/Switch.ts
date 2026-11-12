import { cn } from "../../utils/cn";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import {
    buildSwitchDataAttributes,
    buildSwitchInputEffect,
    buildSwitchStateAttributes,
    buildSwitchStateBinding,
    buildSwitchToggleHandler,
    DEFAULT_SWITCH_SIZE,
    generateSwitchId,
    switchSignals,
} from "./Switch.expressions";
import type { SwitchArgs } from "./Switch.types";

/**
 * Basis-Klassen des Switches (shadcn/ui, Base-Variante).
 * Die Quelle verwendet Platzhalter-Klassen (cn-switch), die konkreten Klassen stammen aus dem Style "vega".
 * Die Varianten aria und cn-switch-aria (React Aria) entfallen.
 */
const switchTw = tw`peer group/switch relative inline-flex items-center transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-checked:bg-primary data-unchecked:bg-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 dark:data-unchecked:bg-input/80 shrink-0 rounded-full border border-transparent shadow-xs focus-visible:ring-3 aria-invalid:ring-3 group-has-focus-visible/field-label:ring-0 group-has-focus-visible/field-label:border-transparent data-[size=default]:h-[18.4px] data-[size=default]:w-8 data-[size=sm]:h-3.5 data-[size=sm]:w-6`;

/** Klassen des Daumens (Thumb) */
const switchThumbTw = tw`pointer-events-none block ring-0 transition-transform bg-background dark:data-unchecked:bg-foreground dark:data-checked:bg-primary-foreground rounded-full group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0`;

export function switchVariants(args: Pick<SwitchArgs, "class"> = {}): string {
  return cn(switchTw, args.class);
}

/**
 * Switch: `<button role="switch">` mit Daumen. Der Zustand liegt im Signal `$<id>.checked`.
 * Mit `name` folgt zusätzlich eine verborgene Checkbox für Formulare.
 * Nutzer-Attribute werden zuerst übernommen und von den Standard-Attributen überschrieben.
 * Funktioniert nur mit geladenem Datastar (ohne Datastar bleibt der Initialzustand sichtbar, schaltet aber nicht um).
 */
export function Switch(args: SwitchArgs = {}): string {
  const id = args.id || generateSwitchId();
  const checked = args.checked ?? false;
  const size = args.size ?? DEFAULT_SWITCH_SIZE;
  const signals = switchSignals(id, checked);

  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildSwitchDataAttributes(size),
    ...buildSwitchStateAttributes(checked, true),
    id,
    type: "button",
    role: "switch",
    class: switchVariants({ class: args.class }),
    "data-signals": signals.dataSignals,
    "data-attr": buildSwitchStateBinding(id, true),
    "data-on:click": buildSwitchToggleHandler(id, args.onCheckedChange),
  };

  if (args.disabled) {
    attrs.disabled = true;
    attrs["data-disabled"] = true;
  }
  if (args.invalid) attrs["aria-invalid"] = "true";

  const thumbAttrs: HtmlAttributes = {
    "data-slot": "switch-thumb",
    ...buildSwitchStateAttributes(checked, false),
    class: switchThumbTw,
    "data-attr": buildSwitchStateBinding(id, false),
  };

  const button = `<button${renderAttributes(attrs)}><span${renderAttributes(thumbAttrs)}></span></button>`;

  if (!args.name) return button;

  // Verborgene Checkbox: display:none-Felder werden trotzdem übermittelt
  const inputAttrs: HtmlAttributes = {
    type: "checkbox",
    name: args.name,
    hidden: true,
    tabindex: -1,
    "aria-hidden": "true",
    checked,
    "data-effect": buildSwitchInputEffect(id),
  };
  if (args.value !== undefined) inputAttrs.value = args.value;
  if (args.disabled) inputAttrs.disabled = true;

  return `${button}<input${renderAttributes(inputAttrs)}>`;
}
