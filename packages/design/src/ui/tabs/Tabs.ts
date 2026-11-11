import { cn } from "../../utils/cn";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import { withSlot } from "../../utils/withSlot";
import {
    buildActivateHandler,
    buildIsActive,
    buildListKeydownHandler,
    buildOrientationEffect,
    buildSelectedExpression,
    buildStateExpression,
    buildTabIndexExpression,
    tabsPartId,
    tabsSignals,
} from "./Tabs.expressions";
import type {
    TabsArgs,
    TabsContentArgs,
    TabsListArgs,
    TabsListVariant,
    TabsTriggerArgs,
} from "./Tabs.types";

/**
 * Tailwind-Klassen (Stil vega, cn-*-Platzhalter aufgelöst).
 * Die Quelle nutzt die Custom-Variants data-active:, data-horizontal: und data-vertical: aus shadcn/tailwind.css.
 * Sie sind hier durch die Standard-Selektoren data-[state=active]: und data-[orientation=...]: ersetzt,
 * damit der Port ohne diese Custom-Variants funktioniert (Datastar setzt data-state am Trigger).
 */
const tabsTw = tw`group/tabs flex gap-2 data-[orientation=horizontal]:flex-col`;

const tabsListTw = tw`group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-0.75 text-muted-foreground group-data-[orientation=horizontal]/tabs:h-9 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none`;

const tabsListVariantTw: Record<TabsListVariant, string> = {
  default: tw`bg-muted`,
  line: tw`gap-1 bg-transparent`,
};

const tabsTriggerTw = [
  tw`relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none dark:text-muted-foreground dark:hover:text-foreground has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`,
  tw`group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent`,
  tw`data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground`,
  tw`after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:-bottom-1.25 group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100`,
].join(" ");

const tabsContentTw = tw`flex-1 text-sm outline-none`;

export function tabsListVariants(args: Pick<TabsListArgs, "variant" | "class"> = {}): string {
  return cn(tabsListTw, tabsListVariantTw[args.variant ?? "default"], args.class);
}

/** Wurzel: hält das Signal "value" und die Ausrichtung */
export function Tabs(args: TabsArgs): string {
  const signals = tabsSignals(args.id, args.defaultValue ?? "");

  const attrs = withSlot(args.attributes, "tabs");
  attrs.class = cn(tabsTw, args.class);
  attrs["data-orientation"] = args.orientation ?? "horizontal";
  attrs["data-signals"] = signals.dataSignals;
  attrs["data-tabs-id"] = args.id;

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Liste der Trigger (role="tablist") mit Pfeiltasten-Navigation */
export function TabsList(args: TabsListArgs = {}): string {
  const variant = args.variant ?? "default";

  const attrs = withSlot(args.attributes, "tabs-list");
  attrs.class = tabsListVariants(args);
  attrs.role = "tablist";
  attrs["data-variant"] = variant;
  attrs["data-effect"] = buildOrientationEffect();
  attrs["data-on:keydown"] = buildListKeydownHandler();

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Trigger (role="tab"): aktiviert den Tab per Klick, Enter oder Leertaste */
export function TabsTrigger(args: TabsTriggerArgs): string {
  const attrs = withSlot(args.attributes, "tabs-trigger");
  attrs.class = cn(tabsTriggerTw, args.class);
  attrs.type = "button";
  attrs.role = "tab";
  attrs.id = tabsPartId(args.tabsId, "trigger", args.value);
  attrs["aria-controls"] = tabsPartId(args.tabsId, "content", args.value);
  attrs["data-value"] = args.value;
  attrs["data-attr:data-state"] = buildStateExpression(args.tabsId, args.value);
  attrs["data-attr:aria-selected"] = buildSelectedExpression(args.tabsId, args.value);
  attrs["data-attr:tabindex"] = buildTabIndexExpression(args.tabsId, args.value);
  attrs["data-on:click"] = buildActivateHandler(args.tabsId, args.value);
  if (args.disabled) attrs.disabled = true;

  return `<button${renderAttributes(attrs)}>${renderChildren(args.children)}</button>`;
}

/** Panel (role="tabpanel"): nur sichtbar, wenn sein Tab aktiv ist */
export function TabsContent(args: TabsContentArgs): string {
  const userStyle = typeof args.attributes?.style === "string" ? args.attributes.style : "";

  const attrs = withSlot(args.attributes, "tabs-content");
  attrs.class = cn(tabsContentTw, args.class);
  attrs.role = "tabpanel";
  attrs.id = tabsPartId(args.tabsId, "content", args.value);
  attrs["aria-labelledby"] = tabsPartId(args.tabsId, "trigger", args.value);
  attrs.tabindex = "0";
  attrs["data-value"] = args.value;
  attrs["data-show"] = buildIsActive(args.tabsId, args.value);
  attrs.style = ["display: none;", userStyle].filter(Boolean).join(" ");

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}
