import { cn } from "../../utils/cn";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { createSignals } from "../../utils/SignalManager";
import { tw } from "../../utils/tw";
import type { InputArgs } from "./Input.types";

/** Tailwind-Klassen für das Input-Feld (shadcn/ui New York v4, mit Text-Farbe für Light/Dark) */
export const baseClasses = tw`file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-background px-3 py-1 text-base text-foreground shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive z-auto`;

export function inputVariants(args: Pick<InputArgs, "class"> = {}): string {
  return cn(baseClasses, args.class);
}

/** Wert für data-bind: Form-ID als Signal-Name (Bindestriche → Unterstriche) + Feldname */
export function buildInputBind(formId: string, name: string): string {
  return `${createSignals(formId, {}).id}.${name}`;
}

/** Input-Feld. Nutzer-Attribute werden zuerst übernommen und von den Standard-Attributen überschrieben. */
export function Input(args: InputArgs = {}): string {
  const attrs: HtmlAttributes = { ...args.attributes };

  attrs["data-slot"] = "input";
  attrs.class = inputVariants(args);

  if (args.type) attrs.type = args.type;
  if (args.placeholder) attrs.placeholder = args.placeholder;
  if (args.value) attrs.value = args.value;
  if (args.name) attrs.name = args.name;
  if (args.id) attrs.id = args.id;
  if (args.disabled) attrs.disabled = true;
  if (args.required) attrs.required = true;

  // data-bind nur mit formId und name; das Signal legt Datastar bzw. das Form an
  if (args.formId && args.name) {
    attrs["data-bind"] = buildInputBind(args.formId, args.name);
  }

  return `<input${renderAttributes(attrs)} />`;
}
