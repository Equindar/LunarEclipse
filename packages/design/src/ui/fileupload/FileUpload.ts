import { cn } from "../../utils/cn";
import { escapeHtml } from "../../utils/escapeHtml";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import { withSlot } from "../../utils/withSlot";
import {
    buildDropzoneBindings,
    buildFileUploadHandler,
    buildFileUploadInit,
    buildHasFilesCondition,
    DEFAULT_FILE_UPLOAD_LABEL,
    DEFAULT_PROGRESS_SIZE,
    fileUploadIds,
    fileUploadSignals,
} from "./FileUpload.expressions";
import type {
    FileUploadArgs,
    FileUploadClearArgs,
    FileUploadDropzoneArgs,
    FileUploadItemArgs,
    FileUploadItemDeleteArgs,
    FileUploadItemMetadataArgs,
    FileUploadItemPreviewArgs,
    FileUploadItemProgressArgs,
    FileUploadListArgs,
    FileUploadProgressVariant,
    FileUploadRender,
    FileUploadTriggerArgs,
} from "./FileUpload.types";

const fileUploadTw = tw`relative flex flex-col gap-1.5`;

const dropzoneTw = tw`relative flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed p-4 transition-colors outline-none select-none hover:bg-accent/30 focus-visible:border-ring/50 data-dragging:border-primary/30 data-dragging:bg-accent/30 data-invalid:border-destructive data-invalid:ring-destructive/20 data-disabled:pointer-events-none`;

const listTw = tw`flex flex-col gap-1.5 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-top-2 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:slide-out-to-top-2`;
const listHorizontalTw = tw`flex-row overflow-x-auto p-1.5`;

const itemTw = tw`relative flex items-center gap-2.5 rounded-lg border p-2`;
const previewTw = tw`relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded border bg-accent/50 [&>svg]:size-6`;
const metadataTw = tw`flex min-w-0 flex-1 flex-col`;
const nameTw = tw`truncate text-sm font-medium`;
const nameSmTw = tw`text-[13px] leading-snug font-normal`;
const sizeTw = tw`truncate text-xs text-muted-foreground`;
const sizeSmTw = tw`text-[11px] leading-snug`;
const messageTw = tw`text-xs text-destructive`;

const progressVariantTw: Record<FileUploadProgressVariant, string> = {
  linear: tw`relative h-1.5 w-full overflow-hidden rounded-full bg-muted`,
  circular: tw`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`,
  fill: tw`absolute inset-0 bg-primary/50 transition-[clip-path] duration-300 ease-linear`,
};
const progressBarTw = tw`h-full w-full flex-1 bg-primary transition-transform duration-300 ease-linear`;

export function fileUploadVariants(args: Pick<FileUploadArgs, "class"> = {}): string {
  return cn(fileUploadTw, args.class);
}

export function fileUploadDropzoneVariants(args: Pick<FileUploadDropzoneArgs, "class"> = {}): string {
  return cn(dropzoneTw, args.class);
}

export function fileUploadListVariants(args: Pick<FileUploadListArgs, "class" | "orientation"> = {}): string {
  return cn(listTw, args.orientation === "horizontal" && listHorizontalTw, args.class);
}

export function fileUploadItemVariants(args: Pick<FileUploadItemArgs, "class"> = {}): string {
  return cn(itemTw, args.class);
}

export function fileUploadItemPreviewVariants(args: Pick<FileUploadItemPreviewArgs, "class"> = {}): string {
  return cn(previewTw, args.class);
}

export function fileUploadItemMetadataVariants(args: Pick<FileUploadItemMetadataArgs, "class"> = {}): string {
  return cn(metadataTw, args.class);
}

export function fileUploadItemProgressVariants(args: Pick<FileUploadItemProgressArgs, "class" | "variant"> = {}): string {
  return cn(progressVariantTw[args.variant ?? "linear"], args.class);
}

/** Rendert ein Button-artiges Teil: eigene render-Funktion oder ein Standard-`<button>` */
function renderButtonPart(attrs: HtmlAttributes, render: FileUploadRender | undefined, children: FileUploadItemDeleteArgs["children"]): string {
  if (render) return render(attrs);
  return `<button${renderAttributes(attrs)}>${renderChildren(children)}</button>`;
}

/**
 * Root. Enthält zusätzlich den versteckten Datei-Input und das (nur für Screenreader sichtbare) Label.
 * Die Dateien liegen im Controller `el._fu` (siehe expressions), nicht in Signalen.
 */
export function FileUpload(args: FileUploadArgs): string {
  const ids = fileUploadIds(args.id);
  const signals = fileUploadSignals(args.id, args.invalid);

  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, "file-upload"),
    id: args.id,
    class: fileUploadVariants({ class: args.class }),
    "data-signals": signals.dataSignals,
    "data-init": buildFileUploadInit(args),
  };
  if (args.dir) attrs.dir = args.dir;
  if (args.disabled) attrs["data-disabled"] = true;

  const inputAttrs: HtmlAttributes = {
    type: "file",
    id: ids.input,
    "aria-labelledby": ids.label,
    "aria-describedby": ids.dropzone,
    tabindex: -1,
    class: "sr-only",
    disabled: args.disabled,
    multiple: args.multiple,
    required: args.required,
  };
  if (args.accept) inputAttrs.accept = args.accept;
  if (args.name) inputAttrs.name = args.name;

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}<input${renderAttributes(inputAttrs)}><div id="${escapeHtml(ids.label)}" class="sr-only">${escapeHtml(args.label ?? DEFAULT_FILE_UPLOAD_LABEL)}</div></div>`;
}

/** Bereich für Drag and Drop, Einfügen und Tastatur (Enter, Leertaste) */
export function FileUploadDropzone(args: FileUploadDropzoneArgs): string {
  const ids = fileUploadIds(args.id);

  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, "file-upload-dropzone"),
    role: "region",
    id: ids.dropzone,
    "aria-controls": `${ids.input} ${ids.list}`,
    "aria-disabled": args.disabled ? "true" : "false",
    "aria-invalid": "false",
    class: fileUploadDropzoneVariants({ class: args.class }),
    ...buildDropzoneBindings(args.id),
    "data-on:click": buildFileUploadHandler(args.id, "onDropzoneClick"),
    "data-on:dragenter": buildFileUploadHandler(args.id, "onDragEnter"),
    "data-on:dragleave": buildFileUploadHandler(args.id, "onDragLeave"),
    "data-on:dragover": buildFileUploadHandler(args.id, "onDragOver"),
    "data-on:drop": buildFileUploadHandler(args.id, "onDrop"),
    "data-on:keydown": buildFileUploadHandler(args.id, "onKeyDown"),
    "data-on:paste": buildFileUploadHandler(args.id, "onPaste"),
  };
  if (!args.disabled) attrs.tabindex = 0;
  if (args.disabled) attrs["data-disabled"] = true;

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Button, der den Dateidialog öffnet */
export function FileUploadTrigger(args: FileUploadTriggerArgs): string {
  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, "file-upload-trigger"),
    type: "button",
    "aria-controls": fileUploadIds(args.id).input,
    "data-file-upload-action": "trigger",
    "data-on:click": buildFileUploadHandler(args.id, "onTriggerClick"),
  };
  if (args.class) attrs.class = args.class;
  if (args.disabled) {
    attrs.disabled = true;
    attrs["data-disabled"] = true;
  }

  return renderButtonPart(attrs, args.render, args.children);
}

/**
 * Liste der Dateien. Ohne Dateien ist sie ausgeblendet (data-show), außer mit `forceMount`.
 * Der Klick-Handler erledigt das Löschen für alle (vom Controller geklonten) Einträge.
 */
export function FileUploadList(args: FileUploadListArgs): string {
  const orientation = args.orientation ?? "vertical";

  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, "file-upload-list"),
    role: "list",
    id: fileUploadIds(args.id).list,
    "aria-orientation": orientation,
    "data-orientation": orientation,
    "data-state": "active",
    class: fileUploadListVariants({ orientation, class: args.class }),
    "data-on:click": buildFileUploadHandler(args.id, "onListClick"),
  };
  if (!args.forceMount) {
    attrs["data-show"] = buildHasFilesCondition(args.id);
    attrs.style = "display: none;";
  }

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/**
 * Vorlage eines Listeneintrags (`<template>`). Der Controller klont sie für jede Datei,
 * setzt IDs und aria-Attribute und füllt Name, Größe, Status, Vorschau und Fortschritt.
 */
export function FileUploadItem(args: FileUploadItemArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, "file-upload-item"),
    role: "listitem",
    class: fileUploadItemVariants({ class: args.class }),
  };

  return `<template data-file-upload-item-template><div${renderAttributes(attrs)}>${renderChildren(args.children)}<span class="sr-only" data-file-upload-field="status"></span></div></template>`;
}

/** Vorschau: Bild bei Bildern, sonst ein Dateityp-Icon (vom Controller als erstes Kind eingefügt) */
export function FileUploadItemPreview(args: FileUploadItemPreviewArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, "file-upload-preview"),
    class: fileUploadItemPreviewVariants({ class: args.class }),
  };

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Name, Größe und Fehlertext der Datei */
export function FileUploadItemMetadata(args: FileUploadItemMetadataArgs = {}): string {
  const small = args.size === "sm";

  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, "file-upload-metadata"),
    class: fileUploadItemMetadataVariants({ class: args.class }),
  };

  const defaults =
    `<span data-file-upload-field="name" class="${escapeHtml(cn(nameTw, small && nameSmTw))}"></span>` +
    `<span data-file-upload-field="size" class="${escapeHtml(cn(sizeTw, small && sizeSmTw))}"></span>` +
    `<span data-file-upload-field="message" class="${escapeHtml(messageTw)}" hidden></span>`;

  return `<div${renderAttributes(attrs)}>${args.children === undefined ? defaults : renderChildren(args.children)}</div>`;
}

/** Fortschrittsanzeige (linear, kreisförmig oder als Füllung). Bei 100 Prozent ausgeblendet, außer mit `forceMount` */
export function FileUploadItemProgress(args: FileUploadItemProgressArgs = {}): string {
  const variant = args.variant ?? "linear";
  const size = args.size ?? DEFAULT_PROGRESS_SIZE;

  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, "file-upload-progress"),
    role: "progressbar",
    "aria-valuemin": 0,
    "aria-valuemax": 100,
    "aria-valuenow": 0,
    "aria-valuetext": "0%",
    "data-variant": variant,
    class: fileUploadItemProgressVariants({ variant, class: args.class }),
  };
  if (args.forceMount) attrs["data-force-mount"] = true;

  let inner = "";

  if (variant === "circular") {
    const radius = (size - 4) / 2;
    const circumference = 2 * Math.PI * radius;
    inner =
      `<svg class="-rotate-90 transform" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" stroke="currentColor">` +
      `<circle class="text-primary/20" stroke-width="2" cx="${size / 2}" cy="${size / 2}" r="${radius}"></circle>` +
      `<circle data-file-upload-progress-circle class="text-primary transition-[stroke-dashoffset] duration-300 ease-linear" stroke-width="2" stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}" cx="${size / 2}" cy="${size / 2}" r="${radius}"></circle>` +
      `</svg>`;
  } else if (variant === "fill") {
    attrs.style = "clip-path: inset(100% 0% 0% 0%);";
  } else {
    inner = `<div data-file-upload-progress-bar class="${escapeHtml(progressBarTw)}" style="transform: translateX(-100%);"></div>`;
  }

  return `<div${renderAttributes(attrs)}>${inner}</div>`;
}

/** Button zum Entfernen einer Datei (Handler liegt an der Liste) */
export function FileUploadItemDelete(args: FileUploadItemDeleteArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, "file-upload-item-delete"),
    type: "button",
    "data-file-upload-action": "delete",
  };
  if (args.class) attrs.class = args.class;

  return renderButtonPart(attrs, args.render, args.children);
}

/** Button zum Leeren der Liste. Ohne Dateien ausgeblendet, außer mit `forceMount` */
export function FileUploadClear(args: FileUploadClearArgs): string {
  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, "file-upload-clear"),
    type: "button",
    "aria-controls": fileUploadIds(args.id).list,
    "data-file-upload-action": "clear",
    "data-on:click": buildFileUploadHandler(args.id, "onClearClick"),
  };
  if (args.class) attrs.class = args.class;
  if (args.disabled) {
    attrs.disabled = true;
    attrs["data-disabled"] = true;
  }
  if (!args.forceMount) {
    attrs["data-show"] = buildHasFilesCondition(args.id);
    attrs.style = "display: none;";
  }

  return renderButtonPart(attrs, args.render, args.children);
}
