import { cn } from "../../utils/cn";
import { escapeHtml } from "../../utils/escapeHtml";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import { withSlot } from "../../utils/withSlot";
import { Button } from "../button";
import { Icon } from "../icon";
import {
    buildBackdropClickHandler,
    buildCloseHandler,
    buildCloseSyncHandler,
    buildOpenHandler,
    buildSyncEffect,
    dialogDescriptionId,
    dialogSignals,
    dialogTitleId,
} from "./Dialog.expressions";
import type {
    DialogArgs,
    DialogCloseArgs,
    DialogContentArgs,
    DialogDescriptionArgs,
    DialogFooterArgs,
    DialogHeaderArgs,
    DialogTitleArgs,
    DialogTriggerArgs,
} from "./Dialog.types";

const DEFAULT_CLOSE_LABEL = "Close";

/**
 * Tailwind-Klassen des Contents (Stil vega).
 * Das native dialog-Element ersetzt Overlay und Portal: Der Overlay-Stil liegt als backdrop:-Variante
 * am Content. "hidden open:grid" ist nötig, weil "grid" sonst das Ausblenden des geschlossenen
 * dialog-Elements überschreibt. Animationen nutzen open: statt data-open:. Exit-Animationen entfallen.
 */
const dialogContentTw = tw`fixed inset-auto top-1/2 left-1/2 z-50 hidden w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6 rounded-xl bg-popover p-6 text-sm text-popover-foreground ring-1 ring-foreground/10 outline-none duration-100 open:grid open:animate-in open:fade-in-0 open:zoom-in-95 sm:max-w-md backdrop:bg-black/10 backdrop:duration-100 backdrop:animate-in backdrop:fade-in-0 supports-backdrop-filter:backdrop:backdrop-blur-xs`;

/** Schließen-Button oben rechts (Klassen aus new-york-v4, die vega-Quelle nutzt dort den Button) */
const dialogCloseButtonTw = tw`absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`;

const dialogHeaderTw = tw`flex flex-col gap-2`;
const dialogFooterTw = tw`flex flex-col-reverse gap-2 sm:flex-row sm:justify-end`;
const dialogTitleTw = tw`leading-none font-medium`;
const dialogDescriptionTw = tw`text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground`;

export function dialogContentVariants(args: Pick<DialogContentArgs, "class"> = {}): string {
  return cn(dialogContentTw, args.class);
}

/** Wurzel: hält das Signal "open" (display: contents, erzeugt keine eigene Box) */
export function Dialog(args: DialogArgs): string {
  const signals = dialogSignals(args.id, args.open ?? false);

  const attrs = withSlot(args.attributes, "dialog");
  attrs.class = cn("contents", args.class);
  attrs["data-signals"] = signals.dataSignals;
  attrs["data-dialog-id"] = args.id;

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Trigger: Wrapper um beliebiges Markup (asChild), öffnet den Dialog per Klick */
export function DialogTrigger(args: DialogTriggerArgs): string {
  const attrs = withSlot(args.attributes, "dialog-trigger");
  attrs.class = cn("contents", args.class);
  attrs["data-on:click"] = buildOpenHandler(args.dialogId);

  return `<span${renderAttributes(attrs)}>${renderChildren(args.children)}</span>`;
}

/** Schließen-Wrapper (asChild): schließt beim Klick den umgebenden Dialog */
export function DialogClose(args: DialogCloseArgs = {}): string {
  const attrs = withSlot(args.attributes, "dialog-close");
  attrs.class = cn("contents", args.class);
  attrs["data-on:click"] = buildCloseHandler();

  return `<span${renderAttributes(attrs)}>${renderChildren(args.children)}</span>`;
}

/** Content: natives modales dialog-Element (Fokusfalle, Escape und inerter Hintergrund kommen vom Browser) */
export function DialogContent(args: DialogContentArgs): string {
  const showCloseButton = args.showCloseButton ?? true;

  const attrs = withSlot(args.attributes, "dialog-content");
  attrs.id = args.id;
  attrs.class = dialogContentVariants(args);
  attrs["aria-labelledby"] = dialogTitleId(args.id);
  attrs["aria-describedby"] = dialogDescriptionId(args.id);
  attrs["data-effect"] = buildSyncEffect(args.id);
  attrs["data-on:close"] = buildCloseSyncHandler(args.id);
  attrs["data-on:click"] = buildBackdropClickHandler();

  const closeButton = showCloseButton
    ? `<button type="button" data-slot="dialog-close" class="${dialogCloseButtonTw}" data-on:click="${escapeHtml(buildCloseHandler())}">${Icon({ name: "close" })}<span class="sr-only">${escapeHtml(args.closeLabel ?? DEFAULT_CLOSE_LABEL)}</span></button>`
    : "";

  return `<dialog${renderAttributes(attrs)}>${renderChildren(args.children)}${closeButton}</dialog>`;
}

export function DialogHeader(args: DialogHeaderArgs = {}): string {
  const attrs = withSlot(args.attributes, "dialog-header");
  attrs.class = cn(dialogHeaderTw, args.class);

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

export function DialogFooter(args: DialogFooterArgs = {}): string {
  const attrs = withSlot(args.attributes, "dialog-footer");
  attrs.class = cn(dialogFooterTw, args.class);

  const closeButton = args.showCloseButton
    ? DialogClose({ children: Button({ children: escapeHtml(args.closeLabel ?? DEFAULT_CLOSE_LABEL), variant: "outline" }) })
    : "";

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}${closeButton}</div>`;
}

export function DialogTitle(args: DialogTitleArgs = {}): string {
  const attrs = withSlot(args.attributes, "dialog-title");
  attrs.class = cn(dialogTitleTw, args.class);
  if (args.dialogId) attrs.id = dialogTitleId(args.dialogId);

  return `<h2${renderAttributes(attrs)}>${renderChildren(args.children)}</h2>`;
}

export function DialogDescription(args: DialogDescriptionArgs = {}): string {
  const attrs = withSlot(args.attributes, "dialog-description");
  attrs.class = cn(dialogDescriptionTw, args.class);
  if (args.dialogId) attrs.id = dialogDescriptionId(args.dialogId);

  return `<p${renderAttributes(attrs)}>${renderChildren(args.children)}</p>`;
}
