import { cn } from "../../utils/cn";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import {
    buildToggleAttributes,
    DEFAULT_TOGGLE_SIZE,
    DEFAULT_TOGGLE_VARIANT,
    generateToggleId,
} from "./Toggle.expressions";
import type { ToggleArgs, ToggleSize, ToggleVariant } from "./Toggle.types";

/**
 * Basis-Klassen des Toggles (shadcn/ui, Base-Variante).
 * Die Quelle verwendet Platzhalter-Klassen (cn-toggle*), die konkreten Klassen stammen aus dem Style "vega".
 * Der gedrückte Zustand wird über aria-pressed gestylt.
 */
const toggleTw = tw`group/toggle inline-flex items-center justify-center whitespace-nowrap outline-none hover:bg-muted focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 hover:text-foreground aria-pressed:bg-muted focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive gap-1 rounded-md text-sm font-medium transition-[color,box-shadow] [&_svg:not([class*='size-'])]:size-4`;

/** Klassen je Variante */
const toggleVariantTw: Record<ToggleVariant, string> = {
  default: tw`bg-transparent`,
  outline: tw`border-input hover:bg-muted border bg-transparent shadow-xs`,
};

/** Klassen je Grösse */
const toggleSizeTw: Record<ToggleSize, string> = {
  default: tw`h-9 min-w-9 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2`,
  sm: tw`h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5`,
  lg: tw`h-10 min-w-10 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2`,
};

export function toggleVariants(args: Pick<ToggleArgs, "variant" | "size" | "class"> = {}): string {
  return cn(
    toggleTw,
    toggleVariantTw[args.variant ?? DEFAULT_TOGGLE_VARIANT],
    toggleSizeTw[args.size ?? DEFAULT_TOGGLE_SIZE],
    args.class
  );
}

/**
 * Toggle: zweistufiger Button (an/aus), `<button>` mit aria-pressed.
 * Der Zustand liegt in einem Datastar-Signal (`$<id>.pressed`); ohne geladenes Datastar bleibt der Anfangszustand stehen.
 * Nutzer-Attribute werden zuerst übernommen und von den Standard-Attributen überschrieben.
 */
export function Toggle(args: ToggleArgs = {}): string {
  const id = args.id || generateToggleId();

  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildToggleAttributes({
      id,
      pressed: args.defaultPressed ?? false,
      disabled: args.disabled,
      onPressedChange: args.onPressedChange,
      slot: args.attributes?.["data-slot"],
    }),
    class: toggleVariants({ variant: args.variant, size: args.size, class: args.class }),
  };

  return `<button${renderAttributes(attrs)}>${renderChildren(args.children)}</button>`;
}
