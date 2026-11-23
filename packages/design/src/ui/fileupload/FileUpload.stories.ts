import type { Meta, StoryObj } from "@storybook/html-vite";

import { renderIcon } from "../../utils/renderIcon";
import { Button } from "../button";
import {
    FileUpload,
    FileUploadClear,
    FileUploadDropzone,
    FileUploadItem,
    FileUploadItemDelete,
    FileUploadItemMetadata,
    FileUploadItemPreview,
    FileUploadItemProgress,
    FileUploadList,
    FileUploadTrigger,
} from "./FileUpload";
import type { FileUploadArgs, FileUploadProgressVariant } from "./FileUpload.types";
import { paperclipIconBody, uploadIconBody, xIconBody } from "./FileUploadIcons";

type FileUploadStoryArgs = Omit<FileUploadArgs, "children"> & {
  progressVariant?: FileUploadProgressVariant;
  hint?: string;
};

const uploadIcon = renderIcon(uploadIconBody, { class: "size-6 text-muted-foreground" });
const xIcon = renderIcon(xIconBody, { class: "size-4" });

/** Delete-Button als Button (ghost, icon) */
const deleteButton = (): string =>
  FileUploadItemDelete({
    render: (attributes) => Button({ variant: "ghost", size: "icon", class: "size-7", attributes: { ...attributes, "aria-label": "Delete file" }, children: xIcon }),
  });

/** Trigger als Button (outline, sm) */
const triggerButton = (id: string, label: string, disabled?: boolean): string =>
  FileUploadTrigger({
    id,
    disabled,
    render: (attributes) => Button({ variant: "outline", size: "sm", attributes, children: label }),
  });

/** Komplettes Beispiel mit Dropzone, Trigger, Liste und Clear. IDs müssen pro Story eindeutig sein. */
const fileUpload = (args: FileUploadStoryArgs): string => {
  const { progressVariant = "linear", hint = "Or click to browse", ...root } = args;
  const overlay = progressVariant !== "linear";

  const item = FileUploadItem({
    children: [
      FileUploadItemPreview({
        children: overlay ? FileUploadItemProgress({ variant: progressVariant }) : undefined,
      }),
      FileUploadItemMetadata(),
      overlay ? "" : FileUploadItemProgress({ variant: "linear", class: "absolute right-2 bottom-1.5 left-2 w-auto" }),
      deleteButton(),
    ],
  });

  return `<div class="w-full max-w-md">${FileUpload({
    ...root,
    children: [
      FileUploadDropzone({
        id: root.id,
        disabled: root.disabled,
        children: [
          `<div class="flex items-center justify-center rounded-full border p-2.5">${uploadIcon}</div>`,
          `<p class="text-sm font-medium">Drag and drop files here</p>`,
          `<p class="text-xs text-muted-foreground">${hint}</p>`,
          triggerButton(root.id, "Browse files", root.disabled),
        ],
      }),
      FileUploadList({ id: root.id, children: item }),
      FileUploadClear({
        id: root.id,
        disabled: root.disabled,
        render: (attributes) => Button({ variant: "outline", size: "sm", attributes, children: "Clear all" }),
      }),
    ],
  })}</div>`;
};

const meta: Meta<FileUploadStoryArgs> = {
  title: "UI-Library/FileUpload",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Datei-Upload mit Drag and Drop, Vorschau und Fortschritt. Port von Dice UI (Base UI), das auf shadcn/ui basiert. Funktioniert nur mit geladenem Datastar: Ein kleiner Controller am Root (`el._fu`) verwaltet die Dateien, Events (`file-upload-change`, `file-upload-accept`, `file-upload-reject`) und die Signale `dragging`, `invalid` und `count` stehen für eigene Bindings bereit.",
      },
    },
  },
  argTypes: {
    id: { control: "text" },
    accept: { control: "text" },
    maxFiles: { control: "number" },
    maxSize: { control: "number" },
    multiple: { control: "boolean" },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    required: { control: "boolean" },
    name: { control: "text" },
    label: { control: "text" },
    dir: { control: "select", options: ["ltr", "rtl"] },
    uploadUrl: { control: "text" },
    validateExpression: { control: "text" },
    class: { control: "text" },
    progressVariant: { control: "select", options: ["linear", "circular", "fill"] },
    hint: { control: "text" },
  },
  args: {
    id: "file-upload-playground",
    multiple: true,
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024,
    progressVariant: "linear",
    hint: "Or click to browse (max 5 files, up to 5MB each)",
  },
  render: (args) => fileUpload(args),
};

export default meta;
type Story = StoryObj<FileUploadStoryArgs>;

export const Playground: Story = {};

/** onFileValidate: `validateExpression` überschreibt die Standard-Ablehnungsmeldung */
export const WithValidation: Story = {
  args: {
    id: "file-upload-validation",
    accept: "image/*",
    maxFiles: 2,
    maxSize: 2 * 1024 * 1024,
    validateExpression: `file.name.length > 20 ? "Filename must be 20 characters or less" : null`,
    hint: "Images only, max 2 files, up to 2MB each, names up to 20 characters",
  },
};

/**
 * Simulierter Direkt-Upload: Ein Handler am Root reagiert auf `file-upload-accept` und meldet
 * den Fortschritt über die Controller-API (`setProgress`, `setSuccess`). Mit `uploadUrl` erledigt der Controller
 * den Upload selbst (multipart POST pro Datei).
 */
export const DirectUpload: Story = {
  args: {
    id: "file-upload-direct",
    hint: "Files are uploaded (simulated) as soon as they are added",
    attributes: {
      "data-on:file-upload-accept":
        "evt.detail.files.forEach((f) => { let p = 0; const t = setInterval(() => { p += 10 + Math.random() * 20; p >= 100 ? (clearInterval(t), el._fu.setSuccess(f)) : el._fu.setProgress(f, p) }, 300) })",
    },
  },
};

export const CircularProgress: Story = {
  args: { ...DirectUpload.args, id: "file-upload-circular", progressVariant: "circular" },
};

export const FillProgress: Story = {
  args: { ...DirectUpload.args, id: "file-upload-fill", progressVariant: "fill" },
};

/** Einbindung in ein Formular: der native Input trägt die Dateien, sie werden also mit dem Formular gesendet */
export const WithForm: Story = {
  render: () => {
    const id = "file-upload-form";
    return `<form class="flex w-full max-w-md flex-col gap-4" onsubmit="return false;">${fileUpload({
      id,
      name: "files",
      multiple: true,
      maxFiles: 3,
      required: true,
      hint: "Select up to 3 files",
    })}<p class="text-sm text-muted-foreground">Files: <span data-text="$file_upload_form.count"></span></p>${Button({ children: "Submit" })}</form>`;
  },
};

/** Ein Eingabefeld als Dropzone: Büroklammer als Trigger, Vorschau-Liste horizontal */
export const WithChatInput: Story = {
  render: () => {
    const id = "file-upload-chat";
    const item = FileUploadItem({
      class: "size-14 shrink-0 gap-0 p-0",
      children: [
        FileUploadItemPreview({ class: "size-full", children: FileUploadItemProgress({ variant: "fill" }) }),
        FileUploadItemDelete({
          class: "absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full border bg-background",
          children: renderIcon(xIconBody, { class: "size-3" }),
          attributes: { "aria-label": "Remove file" },
        }),
      ],
    });

    return `<div class="w-full max-w-md">${FileUpload({
      id,
      multiple: true,
      children: FileUploadDropzone({
        id,
        class: "items-stretch rounded-xl border-solid p-2",
        children: [
          FileUploadList({ id, orientation: "horizontal", class: "p-1", children: item }),
          `<textarea class="min-h-16 w-full resize-none bg-transparent p-2 text-sm outline-none" placeholder="Write a message or drop files here"></textarea>`,
          `<div class="flex items-center">${FileUploadTrigger({
            id,
            class: "inline-flex size-8 items-center justify-center rounded-md hover:bg-accent",
            attributes: { "aria-label": "Attach files" },
            children: renderIcon(paperclipIconBody, { class: "size-4" }),
          })}</div>`,
        ],
      }),
    })}</div>`;
  },
};

export const Disabled: Story = {
  args: { id: "file-upload-disabled", disabled: true, hint: "Uploads are disabled" },
};
