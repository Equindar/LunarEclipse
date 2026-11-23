import { cn } from "../../utils/cn";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import { toggleVariants } from "../toggle";
import {
    buildAriaPressedExpression,
    buildDataStateExpression,
    buildDisabledExpression,
    buildItemClickHandler,
    buildKeydownHandler,
    buildToggleGroupDataAttributes,
    buildToggleGroupInitialSignals,
    buildToggleGroupItemDataAttributes,
    buildValueChangeEffect,
    DEFAULT_TOGGLE_GROUP_ORIENTATION,
    DEFAULT_TOGGLE_GROUP_SIZE,
    DEFAULT_TOGGLE_GROUP_SPACING,
    DEFAULT_TOGGLE_GROUP_VARIANT,
    toggleGroupSignals,
} from "./ToggleGroup.expressions";
import type { ToggleGroupArgs, ToggleGroupItemArgs } from "./ToggleGroup.types";

/**
 * Basis-Klassen der Gruppe (shadcn/ui, Base-Variante).
 * Die Quelle verwendet Platzhalter-Klassen (cn-toggle-group), die konkreten Klassen stammen aus dem Style "vega".
 */
const toggleGroupTw = tw`group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] rounded-md data-vertical:flex-col data-vertical:items-stretch data-[spacing=0]:data-[variant=outline]:shadow-xs`;

/** Basis-Klassen der Items (Platzhalter cn-toggle-group-item aus dem Style "vega" aufgelöst) */
const toggleGroupItemTw = tw`shrink-0 focus:z-10 focus-visible:z-10 data-[state=on]:bg-muted group-data-[spacing=0]/toggle-group:rounded-none group-data-[spacing=0]/toggle-group:px-2 group-data-[spacing=0]/toggle-group:shadow-none group-data-[spacing=0]/toggle-group:has-data-[icon=inline-end]:pr-1.5 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-start]:pl-1.5 group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-md group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-md group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-md group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-md group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t`;

/** Zufällige ID im Format toggle_group_<8 Hex-Zeichen> */
function randomId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return `toggle_group_${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")}`;
}

/** Ungültige Abstände (NaN, negativ) fallen auf den Standard zurück */
function resolveSpacing(spacing: number | undefined): number {
  return spacing !== undefined && Number.isFinite(spacing) && spacing >= 0 ? spacing : DEFAULT_TOGGLE_GROUP_SPACING;
}

export function toggleGroupVariants(args: Pick<ToggleGroupArgs, "class"> = {}): string {
  return cn(toggleGroupTw, args.class);
}

export function toggleGroupItemVariants(
  args: Pick<ToggleGroupItemArgs, "variant" | "size" | "class"> = {},
): string {
  return cn(
    toggleGroupItemTw,
    toggleVariants({
      variant: args.variant ?? DEFAULT_TOGGLE_GROUP_VARIANT,
      size: args.size ?? DEFAULT_TOGGLE_GROUP_SIZE,
    }),
    args.class,
  );
}

/**
 * Toggle Group: eine Gruppe von Toggle-Buttons mit gemeinsamem Wert.
 * Funktioniert nur mit geladenem Datastar (Auswahl, Tastatur-Navigation).
 * Nutzer-Attribute werden zuerst übernommen und von den Standard-Attributen überschrieben.
 */
export function ToggleGroup(args: ToggleGroupArgs = {}): string {
  const id = args.id || randomId();
  const spacing = resolveSpacing(args.spacing);
  const orientation = args.orientation ?? DEFAULT_TOGGLE_GROUP_ORIENTATION;
  const signals = toggleGroupSignals(id, buildToggleGroupInitialSignals(args.value, args.disabled));

  // CSS-Variable --gap steuert den Abstand; ein style aus den Nutzer-Attributen bleibt erhalten
  const userStyle = typeof args.attributes?.style === "string" ? args.attributes.style : "";
  const style = `--gap: ${spacing};${userStyle ? ` ${userStyle}` : ""}`;

  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildToggleGroupDataAttributes({
      variant: args.variant,
      size: args.size,
      spacing,
      orientation,
      multiple: args.multiple ?? false,
      disabled: args.disabled ?? false,
    }),
    id,
    style,
    class: toggleGroupVariants({ class: args.class }),
    "data-signals": signals.dataSignals,
    "data-on:keydown": buildKeydownHandler(args.loop ?? true),
  };

  if (args.onValueChange) {
    attrs["data-effect"] = buildValueChangeEffect(id, args.onValueChange);
  }

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/**
 * Einzelnes Item einer Toggle Group (Button).
 * Zustand (aria-pressed, data-state, disabled) kommt zur Laufzeit aus den Signalen der Gruppe.
 */
export function ToggleGroupItem(args: ToggleGroupItemArgs): string {
  const variant = args.variant ?? DEFAULT_TOGGLE_GROUP_VARIANT;
  const size = args.size ?? DEFAULT_TOGGLE_GROUP_SIZE;
  const spacing = resolveSpacing(args.spacing);

  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildToggleGroupItemDataAttributes({ variant, size, spacing, value: args.value }),
    class: toggleGroupItemVariants({ variant, size, class: args.class }),
    // Ausgangszustand vor dem Laden von Datastar: nicht gedrückt
    "aria-pressed": "false",
    "data-state": "off",
    "data-attr:aria-pressed": buildAriaPressedExpression(args.groupId, args.value),
    "data-attr:data-state": buildDataStateExpression(args.groupId, args.value),
    "data-attr:disabled": buildDisabledExpression(args.groupId, args.disabled ?? false),
    "data-on:click": buildItemClickHandler(args.groupId, args.value),
  };

  if (args.disabled) attrs.disabled = true;

  return `<button${renderAttributes(attrs)}>${renderChildren(args.children)}</button>`;
}
