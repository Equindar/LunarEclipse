import { buildConditional } from "../../utils/buildConditional";
import { cn } from "../../utils/cn";
import { newDataClass } from "../../utils/DataClass";
import { escapeHtml } from "../../utils/escapeHtml";
import { renderChildren } from "../../utils/renderChildren";
import { type HtmlAttributes, renderAttributes } from "../../utils/renderHtmlAttributes";
import { createSignals } from "../../utils/SignalManager";
import { tw } from "../../utils/tw";
import type { CheckboxArgs, CheckboxIndicatorArgs, CheckboxSignals } from "./Checkbox.types";

const baseClasses =
  tw`peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-sm border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50`;

const indicatorBaseClasses =
  tw`flex items-center justify-center text-current transition-none`;


export function checkboxVariants(
  className = ""
): string {
  return cn(baseClasses, className);
}


export const checkboxIndicatorVariants = (className = "") => cn(indicatorBaseClasses, className);


export function Checkbox(args: CheckboxArgs): string {
  // Signale (Namespace = id)
  const signals = createSignals<CheckboxSignals>(args.id, {
    checked: args.checked ?? false,
    disabled: args.disabled ?? false,
  });

  // Hinweis: Das Original hängt args.ClassName nach checkboxVariants() ein
  // zweites Mal an (allClasses += " " + ClassName), die Klasse stünde also
  // doppelt im Attribut. Hier bewusst nicht übernommen.
  const classes = checkboxVariants(args.class);

  // Nur umschalten, wenn nicht disabled
  const toggleExpr = buildConditional(
    `!${signals.signal("disabled")}`,
    signals.toggle("checked"),
    "null"
  );

  // Disabled-Optik reaktiv
  const dataClass = newDataClass()
    .add("cursor-not-allowed opacity-50", signals.signal("disabled"))
    .build();

  // Reihenfolge wie im Original; args.attributes ganz am Ende
  const buttonAttrs: HtmlAttributes = {
    type: "button",
    id: args.id,
    class: classes,
    "data-class": dataClass,
    role: "checkbox",
    "data-on:click": toggleExpr,
    "data-attr:aria-checked": signals.conditional("checked", "'true'", "'false'"),
    "data-attr:data-state": signals.conditional("checked", "'checked'", "'unchecked'"),
    "data-attr:disabled": signals.signal("disabled"),
    "data-attr:aria-disabled": signals.signal("disabled"),
    ...args.attributes,
  };

  const inputAttrs: HtmlAttributes = {
    type: "checkbox",
    name: args.name ?? "", // Original gibt name immer aus, auch leer
    class: "sr-only",
    "data-attr:checked": signals.signal("checked"),
    "data-attr:value": signals.conditional("checked", "'true'", "'false'"),
    "data-attr:disabled": signals.signal("disabled"),
    tabindex: "-1",
  };

  const checkStyle = signals.ternaryStyle("checked", "opacity: 1", "opacity: 0");

  // HTML Rendering
  return (
    `<div data-signals="${escapeHtml(signals.dataSignals)}">` +
    `<button${renderAttributes(buttonAttrs)}>` +
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" data-attr:style="${escapeHtml(checkStyle)}"><path d="M20 6 9 17l-5-5"></path></svg>` +
    `</button>` +
    `<input${renderAttributes(inputAttrs)}>` +
    `</div>`
  );
}


export function CheckboxIndicator(args: CheckboxIndicatorArgs = {}): string {
  const classes = checkboxIndicatorVariants(args.class);
  return `<span data-slot="checkbox-indicator" class="${escapeHtml(classes)}"${renderAttributes(
    args.attributes
  )}>${renderChildren(args.children)}</span>`;
}
