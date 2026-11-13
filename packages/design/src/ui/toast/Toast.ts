import { cn } from "../../utils/cn";
import { escapeHtml } from "../../utils/escapeHtml";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import { Button } from "../button";
import {
    buildCloseToastHandler,
    buildToastBehaviorAttributes,
    buildToastDataAttributes,
    buildToastSvg,
    closeIconPaths,
    DEFAULT_TOASTER_ID,
    resolveToastTimeout,
    toastIconPaths,
    toastRole,
} from "./Toast.expressions";
import type {
    ToastActionArgs,
    ToastArgs,
    ToastCloseArgs,
    ToastContentArgs,
    ToastDescriptionArgs,
    ToasterArgs,
    ToastIconArgs,
    ToastRootArgs,
    ToastTitleArgs,
    ToastType,
} from "./Toast.types";

/**
 * Tailwind-Klassen (shadcn/ui, Base-Variante, Style "vega").
 * Die Quelle verwendet den Platzhalter cn-toast; die konkrete Klasse ist rounded-2xl.
 * Die Stapel-Klassen der Vorlage (--toast-index, Swipe, data-expanded, data-limited) hängen an
 * CSS-Variablen von Base UI und entfallen. Stattdessen: flex flex-col gap-3 am Viewport sowie
 * Ein- und Austrittsanimation über starting: und data-[state=closed].
 */
const toastViewportTw = tw`pointer-events-none fixed inset-x-4 bottom-4 z-50 mx-auto flex w-auto max-w-sm flex-col gap-3 outline-none sm:right-4 sm:left-auto sm:mx-0 sm:w-full`;

const toastTw = tw`group/toast pointer-events-auto relative w-full rounded-2xl border bg-popover text-popover-foreground shadow-lg outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] starting:translate-y-[150%] data-[state=closed]:translate-y-[150%] data-[state=closed]:opacity-0`;

const toastContentTw = tw`flex h-full items-center gap-3 overflow-hidden p-4`;
const toastTextTw = tw`flex min-w-0 flex-1 flex-col gap-1`;
const toastTitleTw = tw`text-sm font-medium`;
const toastDescriptionTw = tw`text-sm text-muted-foreground`;
const toastActionTw = tw`shrink-0`;
const toastCloseTw = tw`relative shrink-0 text-muted-foreground after:absolute after:-inset-2 after:content-[''] hover:text-foreground`;
const toastIconTw = tw`shrink-0 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4`;

/** Klassen am SVG je Typ (error rot, loading dreht sich) */
const toastIconSvgTw: Partial<Record<ToastType, string>> = {
  error: "text-destructive",
  loading: "animate-spin",
};

/** Container der Toasts (fixiert unten rechts, auf kleinen Bildschirmen volle Breite) */
export function ToastViewport(args: ToasterArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    "data-slot": "toast-viewport",
    id: args.id ?? DEFAULT_TOASTER_ID,
    role: "region",
    "aria-live": "polite",
    "aria-label": "Notifications",
    class: cn(toastViewportTw, args.class),
  };

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/**
 * Einmal im Layout rendern. Neue Toasts landen per buildAddToastHandler oder per
 * Datastar-Patch (patch-elements, Selektor "#<id>", Modus append) in diesem Container.
 */
export function Toaster(args: ToasterArgs = {}): string {
  return ToastViewport(args);
}

/** Wurzelelement eines Toasts */
export function ToastRoot(args: ToastRootArgs = {}): string {
  const timeoutMs = resolveToastTimeout(args.type, args.timeout);

  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildToastDataAttributes(args.type),
    ...buildToastBehaviorAttributes(timeoutMs),
    role: toastRole(args.type),
    tabindex: 0,
    class: cn(toastTw, args.class),
  };
  if (args.id) attrs.id = args.id;

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

export function ToastContent(args: ToastContentArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    "data-slot": "toast-content",
    class: cn(toastContentTw, args.class),
  };

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

export function ToastTitle(args: ToastTitleArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    "data-slot": "toast-title",
    class: cn(toastTitleTw, args.class),
  };

  return `<h2${renderAttributes(attrs)}>${renderChildren(args.children)}</h2>`;
}

export function ToastDescription(args: ToastDescriptionArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    "data-slot": "toast-description",
    class: cn(toastDescriptionTw, args.class),
  };

  return `<p${renderAttributes(attrs)}>${renderChildren(args.children)}</p>`;
}

/** Aktions-Button (Button, Variante outline, Größe sm) */
export function ToastAction(args: ToastActionArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    "data-slot": "toast-action",
  };
  if (args.onClick) attrs["data-on:click"] = args.onClick;

  return Button({
    variant: "outline",
    size: "sm",
    class: cn(toastActionTw, args.class),
    attributes: attrs,
    children: args.children,
  });
}

/** Schließen-Button (Button, Variante ghost, Größe icon-sm) mit X-Icon */
export function ToastClose(args: ToastCloseArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    "data-slot": "toast-close",
    "aria-label": "Close toast",
    "data-on:click": buildCloseToastHandler(),
  };

  return Button({
    variant: "ghost",
    class: cn(toastCloseTw, args.class),
    attributes: attrs,
    children: args.children ?? buildToastSvg(closeIconPaths),
  });
}

/** Status-Icon; ohne type (oder bei unbekanntem type) wird nichts gerendert */
export function ToastIcon(args: ToastIconArgs = {}): string {
  const paths = args.type ? toastIconPaths[args.type] : undefined;
  if (!args.type || !paths) return "";

  return `<span data-slot="toast-icon" class="${escapeHtml(toastIconTw)}">${buildToastSvg(paths, toastIconSvgTw[args.type])}</span>`;
}

/** Vollständiger Toast (entspricht einem Eintrag der ToastList in der Vorlage) */
export function Toast(args: ToastArgs = {}): string {
  const text = [
    args.title ? ToastTitle({ children: escapeHtml(args.title) }) : "",
    args.description ? ToastDescription({ children: escapeHtml(args.description) }) : "",
  ].join("");

  const content = ToastContent({
    children: [
      ToastIcon({ type: args.type }),
      `<div class="${escapeHtml(toastTextTw)}">${text}</div>`,
      args.action ? ToastAction(args.action) : "",
      args.closable === false ? "" : ToastClose(),
    ],
  });

  return ToastRoot({
    id: args.id,
    type: args.type,
    timeout: args.timeout,
    class: args.class,
    attributes: args.attributes,
    children: content,
  });
}
