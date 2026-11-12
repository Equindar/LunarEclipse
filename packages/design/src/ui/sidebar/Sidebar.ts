import { buildAnchorStyle, buildPositionAnchorStyle } from "../../utils/AnchorStyle";
import { cn } from "../../utils/cn";
import { escapeHtml } from "../../utils/escapeHtml";
import { getAnchorPosition } from "../../utils/getAnchorPosition";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { safeUrl } from "../../utils/safeUrl";
import { tw } from "../../utils/tw";
import { Button } from "../button";
import { Input } from "../input";
import { Skeleton } from "../skeleton";
import { tooltipContentVariants } from "../tooltip";
import {
    buildCloseMobileHandler,
    buildEscapeHandler,
    buildKeyboardShortcutHandler,
    buildSidebarDataAttributes,
    buildStateAttrExpression,
    buildStateAttributes,
    buildToggleHandler,
    buildTooltipHideHandler,
    buildTooltipShowHandler,
    createRandomId,
    randomSkeletonWidth,
    SIDEBAR_WIDTH,
    SIDEBAR_WIDTH_ICON,
    SIDEBAR_WIDTH_MOBILE,
    sidebarSignals,
} from "./Sidebar.expressions";
import type {
    SidebarArgs,
    SidebarBaseArgs,
    SidebarContentArgs,
    SidebarFooterArgs,
    SidebarGroupActionArgs,
    SidebarGroupArgs,
    SidebarGroupContentArgs,
    SidebarGroupLabelArgs,
    SidebarHeaderArgs,
    SidebarInputArgs,
    SidebarInsetArgs,
    SidebarMenuActionArgs,
    SidebarMenuArgs,
    SidebarMenuBadgeArgs,
    SidebarMenuButtonArgs,
    SidebarMenuButtonSize,
    SidebarMenuButtonVariant,
    SidebarMenuItemArgs,
    SidebarMenuSkeletonArgs,
    SidebarMenuSubArgs,
    SidebarMenuSubButtonArgs,
    SidebarMenuSubItemArgs,
    SidebarProviderArgs,
    SidebarRailArgs,
    SidebarSeparatorArgs,
    SidebarTriggerArgs,
} from "./Sidebar.types";

/**
 * Tailwind-Klassen der Sidebar (shadcn/ui, Base-Variante), intern und nicht exportiert.
 * Die Quelle verwendet Platzhalter-Klassen (cn-sidebar*), die konkreten Klassen stammen aus dem Style "vega".
 */
const sidebarTw = {
  wrapper: tw`group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar`,
  /** collapsible="none" */
  static: tw`flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground`,
  root: tw`group peer hidden text-sidebar-foreground md:block`,
  gap: tw`relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear group-data-[collapsible=offcanvas]:w-0 group-data-[side=right]:rotate-180`,
  gapIcon: tw`group-data-[collapsible=icon]:w-(--sidebar-width-icon)`,
  gapIconFloating: tw`group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]`,
  container: tw`fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:-left-(--sidebar-width) data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:-right-(--sidebar-width) md:flex`,
  containerFloating: tw`p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]`,
  containerDefault: tw`group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l`,
  inner: tw`flex size-full flex-col bg-sidebar group-data-[variant=floating]:ring-sidebar-border group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1`,
  /** Mobile Variante: ersetzt Sheet (Overlay und Panel), Klassen aus Sheet und Sidebar zusammengeführt */
  mobile: tw`md:hidden`,
  mobileOverlay: tw`fixed inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs`,
  mobilePanel: tw`fixed inset-y-0 z-50 flex h-full w-(--sidebar-width) flex-col bg-sidebar bg-clip-padding p-0 text-sm text-sidebar-foreground shadow-lg`,
  mobilePanelLeft: tw`left-0 border-r`,
  mobilePanelRight: tw`right-0 border-l`,
  mobileHeader: tw`sr-only flex flex-col gap-1.5 p-4`,
  mobileTitle: tw`font-medium text-foreground`,
  mobileDescription: tw`text-sm text-muted-foreground`,
  mobileBody: tw`flex h-full w-full flex-col`,
  rail: tw`absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:inset-s-1/2 after:w-0.5 sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2 hover:after:bg-sidebar-border in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize [[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar [[data-side=left][data-collapsible=offcanvas]_&]:-right-2 [[data-side=right][data-collapsible=offcanvas]_&]:-left-2`,
  inset: tw`relative flex w-full flex-1 flex-col bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2`,
  input: tw`bg-background h-8 w-full shadow-none`,
  header: tw`flex flex-col gap-2 p-2`,
  footer: tw`flex flex-col gap-2 p-2`,
  /** Die Vorlage nutzt Separator (shrink-0 bg-border, horizontal); hier inline, da Separator nicht portiert ist */
  separator: tw`h-px w-auto shrink-0 bg-sidebar-border mx-2`,
  content: tw`flex min-h-0 flex-1 flex-col overflow-auto group-data-[collapsible=icon]:overflow-hidden no-scrollbar gap-2`,
  group: tw`relative flex w-full min-w-0 flex-col p-2`,
  groupLabel: tw`flex shrink-0 items-center outline-hidden [&>svg]:shrink-0 text-sidebar-foreground/70 ring-sidebar-ring h-8 rounded-md px-2 text-xs font-medium transition-[margin,opacity] duration-200 ease-linear group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 focus-visible:ring-2 [&>svg]:size-4`,
  groupAction: tw`flex aspect-square items-center justify-center outline-hidden transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 md:after:hidden [&>svg]:shrink-0 text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 w-5 rounded-md p-0 focus-visible:ring-2 [&>svg]:size-4`,
  groupContent: tw`w-full text-sm`,
  menu: tw`flex w-full min-w-0 flex-col gap-1`,
  menuItem: tw`group/menu-item relative`,
  menuButton: tw`peer/menu-button group/menu-button flex w-full items-center overflow-hidden outline-hidden disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground gap-2 rounded-md p-2 text-left text-sm transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! focus-visible:ring-2 data-active:font-medium`,
  menuAction: tw`flex items-center justify-center outline-hidden transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 md:after:hidden [&>svg]:shrink-0 text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 aspect-square w-5 rounded-md p-0 peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 focus-visible:ring-2 [&>svg]:size-4`,
  menuActionOnHover: tw`group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-active/menu-button:text-sidebar-accent-foreground aria-expanded:opacity-100 md:opacity-0`,
  menuBadge: tw`flex items-center justify-center tabular-nums select-none group-data-[collapsible=icon]:hidden text-sidebar-foreground peer-hover/menu-button:text-sidebar-accent-foreground peer-data-active/menu-button:text-sidebar-accent-foreground pointer-events-none absolute right-1 h-5 min-w-5 rounded-md px-1 text-xs font-medium peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1`,
  menuSkeleton: tw`flex items-center h-8 gap-2 rounded-md px-2`,
  menuSkeletonIcon: tw`size-4 rounded-md`,
  menuSkeletonText: tw`h-4 max-w-(--skeleton-width) flex-1`,
  menuSub: tw`flex min-w-0 flex-col border-sidebar-border mx-3.5 translate-x-px gap-1 border-l px-2.5 py-0.5 group-data-[collapsible=icon]:hidden`,
  menuSubItem: tw`group/menu-sub-item relative`,
  menuSubButton: tw`flex min-w-0 -translate-x-px items-center overflow-hidden outline-hidden group-data-[collapsible=icon]:hidden disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:shrink-0 text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground h-7 gap-2 rounded-md px-2 focus-visible:ring-2 data-[size=md]:text-sm data-[size=sm]:text-xs [&>svg]:size-4`,
};

/** Varianten des MenuButtons */
const sidebarMenuButtonVariantTw: Record<SidebarMenuButtonVariant, string> = {
  default: tw`hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`,
  outline: tw`bg-background hover:bg-sidebar-accent hover:text-sidebar-accent-foreground shadow-[0_0_0_1px_var(--sidebar-border)] hover:shadow-[0_0_0_1px_var(--sidebar-accent)]`,
};

/** Größen des MenuButtons */
const sidebarMenuButtonSizeTw: Record<SidebarMenuButtonSize, string> = {
  default: tw`h-8 text-sm`,
  sm: tw`h-7 text-xs`,
  lg: tw`h-12 text-sm group-data-[collapsible=icon]:p-0!`,
};

export function sidebarMenuButtonVariants(
  args: Pick<SidebarMenuButtonArgs, "variant" | "size" | "class"> = {}
): string {
  return cn(
    sidebarTw.menuButton,
    sidebarMenuButtonVariantTw[args.variant ?? "default"],
    sidebarMenuButtonSizeTw[args.size ?? "default"],
    args.class
  );
}

/** Icon PanelLeft (lucide) als Standard-Icon des Triggers */
const panelLeftIcon = `<svg class="size-4 rtl:-scale-x-100" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M9 3v18"></path></svg>`;

/**
 * Rendert ein Element mit Nutzer-Attributen, die von den Standard-Attributen der Komponente überschrieben werden.
 * Optionale Standards werden vom Aufrufer nur bedingt gesetzt, damit `undefined` keine Nutzerwerte überschreibt.
 */
function renderElement(
  tag: string,
  base: string,
  args: SidebarBaseArgs,
  slot: string,
  sidebar?: string,
  extra: HtmlAttributes = {}
): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildSidebarDataAttributes(slot, sidebar),
    ...extra,
    class: cn(base, args.class),
  };

  return `<${tag}${renderAttributes(attrs)}>${renderChildren(args.children)}</${tag}>`;
}

/** Hängt einen Datastar-Handler an einen vorhandenen des Nutzers an (Statements mit "; " verbunden) */
function appendHandler(existing: string | number | boolean | undefined, handler: string): string {
  return existing ? `${String(existing)}; ${handler}` : handler;
}

/**
 * Wrapper mit Signalen (open, openMobile) und Tastenkürzel Strg/Cmd + B.
 * Setzt `--sidebar-width` und `--sidebar-width-icon`; ein `style` aus `attributes` wird angehängt.
 */
export function SidebarProvider(args: SidebarProviderArgs = {}): string {
  const id = args.id ?? createRandomId("sidebar");
  const signals = sidebarSignals(id, args.defaultOpen ?? true);

  const userStyle = typeof args.attributes?.style === "string" ? args.attributes.style : "";
  const style = `--sidebar-width: ${SIDEBAR_WIDTH}; --sidebar-width-icon: ${SIDEBAR_WIDTH_ICON};${userStyle ? ` ${userStyle}` : ""}`;

  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildSidebarDataAttributes("sidebar-wrapper"),
    "data-sidebar-id": id,
    "data-signals": signals.dataSignals,
    "data-on:keydown__window": buildKeyboardShortcutHandler(id),
    style,
    class: cn(sidebarTw.wrapper, args.class),
  };

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/**
 * Sidebar. Desktop: feste Spalte mit Lücke (gap) und Container, gesteuert über data-state/data-collapsible.
 * Mobil (unter md): Overlay mit Panel, gesteuert über das Signal openMobile (ersetzt Sheet).
 * Achtung: Die children werden für Desktop und Mobil zweimal gerendert (IDs darin sind dann doppelt).
 */
export function Sidebar(args: SidebarArgs): string {
  const side = args.side ?? "left";
  const variant = args.variant ?? "sidebar";
  const collapsible = args.collapsible ?? "offcanvas";
  const defaultOpen = args.defaultOpen ?? true;
  const children = renderChildren(args.children);

  if (collapsible === "none") {
    const attrs: HtmlAttributes = {
      ...args.attributes,
      ...buildSidebarDataAttributes("sidebar"),
      class: cn(sidebarTw.static, args.class),
    };
    return `<div${renderAttributes(attrs)}>${children}</div>`;
  }

  const floatingOrInset = variant === "floating" || variant === "inset";

  // Desktop
  const rootAttrs: HtmlAttributes = {
    class: sidebarTw.root,
    ...buildStateAttributes(defaultOpen, collapsible),
    "data-variant": variant,
    "data-side": side,
    "data-slot": "sidebar",
    "data-attr": buildStateAttrExpression(args.id, collapsible),
  };

  const gapClass = cn(sidebarTw.gap, floatingOrInset ? sidebarTw.gapIconFloating : sidebarTw.gapIcon);

  const containerAttrs: HtmlAttributes = {
    ...args.attributes,
    "data-slot": "sidebar-container",
    "data-side": side,
    class: cn(
      sidebarTw.container,
      floatingOrInset ? sidebarTw.containerFloating : sidebarTw.containerDefault,
      args.class
    ),
  };

  const desktop =
    `<div${renderAttributes(rootAttrs)}>` +
    `<div data-slot="sidebar-gap" class="${escapeHtml(gapClass)}"></div>` +
    `<div${renderAttributes(containerAttrs)}>` +
    `<div data-sidebar="sidebar" data-slot="sidebar-inner" class="${escapeHtml(sidebarTw.inner)}">${children}</div>` +
    `</div></div>`;

  // Mobil
  const titleId = `${args.id}-mobile-title`;
  const descriptionId = `${args.id}-mobile-description`;
  const panelClass = cn(sidebarTw.mobilePanel, side === "left" ? sidebarTw.mobilePanelLeft : sidebarTw.mobilePanelRight);
  const openMobile = sidebarSignals(args.id).signal("openMobile");

  const panelAttrs: HtmlAttributes = {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": titleId,
    "aria-describedby": descriptionId,
    "data-sidebar": "sidebar",
    "data-slot": "sidebar",
    "data-mobile": "true",
    "data-side": side,
    "data-on:keydown__window": buildEscapeHandler(args.id),
    style: `--sidebar-width: ${SIDEBAR_WIDTH_MOBILE};`,
    class: panelClass,
  };

  const mobile =
    `<div data-slot="sidebar-mobile" class="${escapeHtml(sidebarTw.mobile)}" data-show="${escapeHtml(openMobile)}" style="display: none;">` +
    `<div data-slot="sidebar-overlay" class="${escapeHtml(sidebarTw.mobileOverlay)}" data-on:click="${escapeHtml(buildCloseMobileHandler(args.id))}"></div>` +
    `<div${renderAttributes(panelAttrs)}>` +
    `<div class="${escapeHtml(sidebarTw.mobileHeader)}">` +
    `<h2 id="${escapeHtml(titleId)}" class="${escapeHtml(sidebarTw.mobileTitle)}">Sidebar</h2>` +
    `<p id="${escapeHtml(descriptionId)}" class="${escapeHtml(sidebarTw.mobileDescription)}">Displays the mobile sidebar.</p>` +
    `</div>` +
    `<div class="${escapeHtml(sidebarTw.mobileBody)}">${children}</div>` +
    `</div></div>`;

  return desktop + mobile;
}

/** Schaltfläche zum Ein-/Ausklappen (Button, ghost, icon-sm). Ohne children wird das Standard-Icon gerendert */
export function SidebarTrigger(args: SidebarTriggerArgs): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildSidebarDataAttributes("sidebar-trigger", "trigger"),
    "data-on:click": appendHandler(args.attributes?.["data-on:click"], buildToggleHandler(args.id)),
  };

  return Button({
    variant: "ghost",
    class: args.class,
    attributes: attrs,
    children: [args.children ? renderChildren(args.children) : panelLeftIcon, `<span class="sr-only">Toggle Sidebar</span>`],
  });
}

/** Schmale Leiste am Rand der Sidebar zum Ein-/Ausklappen */
export function SidebarRail(args: SidebarRailArgs): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildSidebarDataAttributes("sidebar-rail", "rail"),
    type: "button",
    "aria-label": "Toggle Sidebar",
    tabindex: "-1",
    title: "Toggle Sidebar",
    "data-on:click": appendHandler(args.attributes?.["data-on:click"], buildToggleHandler(args.id)),
    class: cn(sidebarTw.rail, args.class),
  };

  return `<button${renderAttributes(attrs)}>${renderChildren(args.children)}</button>`;
}

/** Hauptbereich neben der Sidebar (`main`) */
export function SidebarInset(args: SidebarInsetArgs = {}): string {
  return renderElement("main", sidebarTw.inset, args, "sidebar-inset");
}

/** Eingabefeld in der Sidebar (verwendet Input) */
export function SidebarInput(args: SidebarInputArgs = {}): string {
  return Input({
    class: cn(sidebarTw.input, args.class),
    attributes: {
      ...args.attributes,
      ...buildSidebarDataAttributes("sidebar-input", "input"),
    },
  });
}

export function SidebarHeader(args: SidebarHeaderArgs = {}): string {
  return renderElement("div", sidebarTw.header, args, "sidebar-header", "header");
}

export function SidebarFooter(args: SidebarFooterArgs = {}): string {
  return renderElement("div", sidebarTw.footer, args, "sidebar-footer", "footer");
}

/** Trennlinie (horizontal) */
export function SidebarSeparator(args: SidebarSeparatorArgs = {}): string {
  return renderElement("div", sidebarTw.separator, args, "sidebar-separator", "separator", {
    role: "separator",
    "aria-orientation": "horizontal",
    "data-orientation": "horizontal",
  });
}

export function SidebarContent(args: SidebarContentArgs = {}): string {
  return renderElement("div", sidebarTw.content, args, "sidebar-content", "content");
}

export function SidebarGroup(args: SidebarGroupArgs = {}): string {
  return renderElement("div", sidebarTw.group, args, "sidebar-group", "group");
}

/** Gruppenüberschrift: `div`, mit `href` ein Link */
export function SidebarGroupLabel(args: SidebarGroupLabelArgs = {}): string {
  const isLink = args.href !== undefined;
  const extra: HtmlAttributes = isLink ? { href: safeUrl(args.href ?? "") } : {};
  return renderElement(isLink ? "a" : "div", sidebarTw.groupLabel, args, "sidebar-group-label", "group-label", extra);
}

/** Aktion oben rechts in einer Gruppe: `button`, mit `href` ein Link */
export function SidebarGroupAction(args: SidebarGroupActionArgs = {}): string {
  const isLink = args.href !== undefined;
  const extra: HtmlAttributes = isLink ? { href: safeUrl(args.href ?? "") } : { type: "button" };
  return renderElement(isLink ? "a" : "button", sidebarTw.groupAction, args, "sidebar-group-action", "group-action", extra);
}

export function SidebarGroupContent(args: SidebarGroupContentArgs = {}): string {
  return renderElement("div", sidebarTw.groupContent, args, "sidebar-group-content", "group-content");
}

export function SidebarMenu(args: SidebarMenuArgs = {}): string {
  return renderElement("ul", sidebarTw.menu, args, "sidebar-menu", "menu");
}

export function SidebarMenuItem(args: SidebarMenuItemArgs = {}): string {
  return renderElement("li", sidebarTw.menuItem, args, "sidebar-menu-item", "menu-item");
}

/**
 * Menü-Eintrag: `button`, mit `href` ein Link.
 * Mit `tooltip` (und `sidebarId`) erscheint ein Tooltip rechts neben dem Eintrag, aber nur bei eingeklappter Desktop-Sidebar.
 */
export function SidebarMenuButton(args: SidebarMenuButtonArgs = {}): string {
  const size = args.size ?? "default";
  const variant = args.variant ?? "default";
  const isLink = args.href !== undefined;

  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildSidebarDataAttributes("sidebar-menu-button", "menu-button"),
    "data-size": size,
    class: sidebarMenuButtonVariants({ variant, size, class: args.class }),
  };

  if (isLink) attrs.href = safeUrl(args.href ?? "");
  else attrs.type = "button";
  if (args.isActive) attrs["data-active"] = true;

  let tooltipHtml = "";

  if (args.tooltip) {
    if (!args.sidebarId) {
      throw new Error("SidebarMenuButton: sidebarId ist Pflicht, wenn tooltip gesetzt ist.");
    }

    const tooltipId = createRandomId("sidebar_tip");
    const userStyle = typeof args.attributes?.style === "string" ? `${args.attributes.style}; ` : "";

    attrs.style = `${userStyle}${buildAnchorStyle(tooltipId)}`;
    attrs["data-on:mouseenter"] = buildTooltipShowHandler(args.sidebarId, tooltipId);
    attrs["data-on:focus"] = buildTooltipShowHandler(args.sidebarId, tooltipId);
    attrs["data-on:mouseleave"] = buildTooltipHideHandler(tooltipId);
    attrs["data-on:blur"] = buildTooltipHideHandler(tooltipId);

    const tooltipStyle = `position: absolute; ${buildPositionAnchorStyle(tooltipId)}; z-index: 50; ${getAnchorPosition("right", "center", 4)};`;
    const tooltipClass = tooltipContentVariants({ class: "anchor-positioned" });

    tooltipHtml = `<div id="${escapeHtml(tooltipId)}" popover="manual" data-slot="tooltip-content" class="${escapeHtml(tooltipClass)}" style="${escapeHtml(tooltipStyle)}">${escapeHtml(args.tooltip)}</div>`;
  }

  const tag = isLink ? "a" : "button";

  return `<${tag}${renderAttributes(attrs)}>${renderChildren(args.children)}</${tag}>${tooltipHtml}`;
}

/** Aktion rechts im Menü-Eintrag (z. B. Dropdown-Auslöser): `button`, mit `href` ein Link */
export function SidebarMenuAction(args: SidebarMenuActionArgs = {}): string {
  const isLink = args.href !== undefined;
  const extra: HtmlAttributes = isLink ? { href: safeUrl(args.href ?? "") } : { type: "button" };
  const base = cn(sidebarTw.menuAction, args.showOnHover && sidebarTw.menuActionOnHover);

  return renderElement(isLink ? "a" : "button", base, args, "sidebar-menu-action", "menu-action", extra);
}

export function SidebarMenuBadge(args: SidebarMenuBadgeArgs = {}): string {
  return renderElement("div", sidebarTw.menuBadge, args, "sidebar-menu-badge", "menu-badge");
}

/** Lade-Platzhalter für einen Menü-Eintrag (verwendet Skeleton) */
export function SidebarMenuSkeleton(args: SidebarMenuSkeletonArgs = {}): string {
  const width = args.width ?? randomSkeletonWidth();

  const icon = args.showIcon
    ? Skeleton({
        class: sidebarTw.menuSkeletonIcon,
        attributes: { "data-sidebar": "menu-skeleton-icon" },
      })
    : "";

  const text = Skeleton({
    class: sidebarTw.menuSkeletonText,
    attributes: { "data-sidebar": "menu-skeleton-text", style: `--skeleton-width: ${width}` },
  });

  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildSidebarDataAttributes("sidebar-menu-skeleton", "menu-skeleton"),
    class: cn(sidebarTw.menuSkeleton, args.class),
  };

  return `<div${renderAttributes(attrs)}>${icon}${text}</div>`;
}

export function SidebarMenuSub(args: SidebarMenuSubArgs = {}): string {
  return renderElement("ul", sidebarTw.menuSub, args, "sidebar-menu-sub", "menu-sub");
}

export function SidebarMenuSubItem(args: SidebarMenuSubItemArgs = {}): string {
  return renderElement("li", sidebarTw.menuSubItem, args, "sidebar-menu-sub-item", "menu-sub-item");
}

/** Untermenü-Eintrag: Link (`a`, wie in der Vorlage), `href` ist optional */
export function SidebarMenuSubButton(args: SidebarMenuSubButtonArgs = {}): string {
  const size = args.size ?? "md";
  const extra: HtmlAttributes = { "data-size": size };

  if (args.href !== undefined) extra.href = safeUrl(args.href);
  if (args.isActive) extra["data-active"] = true;

  return renderElement("a", sidebarTw.menuSubButton, args, "sidebar-menu-sub-button", "menu-sub-button", extra);
}
