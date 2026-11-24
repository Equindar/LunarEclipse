import type { Meta, StoryObj } from "@storybook/html-vite";

import { escapeHtml } from "../../utils/escapeHtml";
import { renderIcon, type RenderIconOptions } from "../../utils/renderIcon";
import {
    Attachment,
    AttachmentAction,
    AttachmentActions,
    AttachmentContent,
    AttachmentDescription,
    AttachmentGroup,
    AttachmentMedia,
    AttachmentTitle,
    AttachmentTrigger,
} from "./Attachment";
import type {
    AttachmentArgs,
    AttachmentMediaVariant,
    AttachmentOrientation,
    AttachmentSize,
    AttachmentState,
} from "./Attachment.types";

type AttachmentStoryArgs = Pick<AttachmentArgs, "state" | "size" | "orientation" | "class"> & {
  mediaVariant?: AttachmentMediaVariant;
  title?: string;
  description?: string;
  showAction?: boolean;
};

const states: AttachmentState[] = ["idle", "uploading", "processing", "error", "done"];
const sizes: AttachmentSize[] = ["default", "sm", "xs"];
const orientations: AttachmentOrientation[] = ["horizontal", "vertical"];

/** Innere Pfade der Lucide-Icons (24x24); Stand-in für den zentralen Icon-Ordner des Design-Systems */
const iconBodies = {
  check: `<path d="M20 6 9 17l-5-5"></path>`,
  clock: `<circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path>`,
  copy: `<rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>`,
  fileCode: `<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M10 12.5 8 15l2 2.5"></path><path d="m14 12.5 2 2.5-2 2.5"></path>`,
  fileSearch: `<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><circle cx="11.5" cy="14.5" r="2.5"></circle><path d="M13.3 16.3 15 18"></path>`,
  fileSpreadsheet: `<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M8 13h2"></path><path d="M14 13h2"></path><path d="M8 17h2"></path><path d="M14 17h2"></path>`,
  fileText: `<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path>`,
  loader: `<path d="M21 12a9 9 0 1 1-6.219-8.56"></path>`,
  refresh: `<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path>`,
  x: `<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>`,
} as const;

type IconName = keyof typeof iconBodies;

const icon = (name: IconName, options?: RenderIconOptions): string => renderIcon(iconBodies[name], options);

/** Spinner im Media-Bereich (data-slot="spinner", damit das Attachment ihn in der vertikalen Ansicht vergrößert) */
const spinner = (): string =>
  renderIcon(iconBodies.loader, { class: "animate-spin", attributes: { "data-slot": "spinner" } });

/** Kleine Beispielbilder als Data-URI (Verlauf mit Form), damit die Stories ohne externe Dateien laufen */
const images = {
  workspace: {
    name: "workspace.png",
    meta: "PNG · 820 KB",
    alt: "Workspace",
    src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAIAAABt+uBvAAAC4klEQVR42u3cwY3bMBAF0B8iheQeIA2kltxSSUpIYXtLK7nOHihKokROLM4EYYbfwK6NtS2DD6ZIin/nw9cfv0UEAPJvAFIebfcCKXflCUh5uvxsD+R4NS5vOx2/PN85/unvcnpB7/jliNXxm5870K5EHb1diTp6uxJ19HYl6qjtKl2MOk2drYtRp6cDQaKOogNIoo6iAyBRR9HZRzHqtHUEkqij6OQuRp2uztbFqNPTASRRR9E5uhh1mjoQSdRRdAAk6ig6UroYddo6uYtRp6sD5MUqdTo6+yhGnbbO1sWo09NBuaJInbaOQBJ1FJ28FqNOV2c7SVOnpwPJi1XqdHTqkzR1Gu2q50HUuehU8yDq3HX2nVXqtHXyzip1ujp5Z5U6XZ19FKNOW+eaD6LOvV0fvXTefn7CZLfP396MOlUXs353JryZdWTvYh49a0oim86+s+p03gmnk3dWY+rAQ0fNBz0eszD3mWhEp58Pej6ih9RBOx80Nt+JqCONfJBxNjjdedqkc8sHUafWqfNBsXSOocOgc8oHuayz5h7pB3RKPog6HZ3rPMiyRp95HjSsU82DHK5ghNM5ctLUaersO6t+V7+mG8RMOvt/+wTUgYdOtdQIpwO7Di45act15cm/RGM6VU7a4ap7OB1BPx/0/+vAroNePmh0x2ba9eqgTjsfRJ1zu5KTjszaxUw6uOekLXuh056EhnWuOelYOrDrVF3Muo8eUefISTulDCa9aj+sk8MLPjpfvv/6hxkMrzHr/rkpQELl7+k08kHUubQrUUfRQRXBo46SD6KOKPkg6oiSD6KOotPOSVNnbw7gXEcxmo5vHcWAOo51FGPqeNVRDKvjUkcxso69jmJwHWMdxfg6MNRRXEJnuI7iKjpjdRQX0sHzOopr6Tyto7iczqM6iivq4OU6iovqvFhHcV0dvFBHcWmdP9ZRXF1Hr6NIHa2OInW0OorU0eooUkero0ida/L7HQJ3iJ+d/xwsAAAAAElFTkSuQmCC",
  },
  desk: {
    name: "desk-reference.jpg",
    meta: "JPG · 1.1 MB",
    alt: "Desk",
    src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAIAAABt+uBvAAADd0lEQVR42u3dy05TURQG4HVWfBpxqgUlDLxBCAPxFXCuoEMVkGuYiO8gU3VkolwMIfEGgQk8gjyB8+3gVHp6es5f0q69d7f+u0knPWnol1X6r71XIfs999E5J+Kck5p7J3WPSOsmUvtQ+bLC03beg4eKP2fVre3SqosqnrH0tJ33Sh3w8kWcUgfoOCdKHaADKog6AiqIOgIqiDoCKog6AiqIOgIqiDoCKog6tVlHqYOToFIHJ0GlDk6CSh2cBJU6OAkqdXASVOrgJKjUwUlQqQOToCh1gE5eQdQBP65T6jjYSyh1cC+h1EG9BAiK1BEQFKkjIChSp3jZlUHQufZhVmrWydRGRB0nkp0/2oqlM/T+iVx6HU+uh9cR57Lzma3wOkPvHktP62hiNaSOE5f9mnkbUudqrzTFdTi+HEanGRTT0hGR65+eh9FptRoJ6eTrxucXAXTaKighnXw1tl/61mlvVpPSydfwzrxXnUKzmqBOvkZ2F/zpVAwvpKWTr5t7i550ysML9mkw3PKi0za8MDhpsId168uSD53W8IKPTkICLw86zeGF6H2WyRrdXzHXqa4gmx49xjLXqaggw/2dGELGOuUKCrC/43WNHazZ6rRVUNq1U36X2egURvBsd05jClnq/B3Bs95XjlpBljrOwaDY+657dCEjnYvvixmfSUT2sdOpDYr9nthE/kVtpgNajb7Os/4ZnboK6vu0L/7HvI1OZQUZnIWeTG1E0dkdeWar01lBZifFsd9fNjqlCjI9Rx+EGN23TrGCjKcMjifXA+vsDD8117moIE8zGPGaDCOdvIJ8TagcTayGK5/GnA+dvII8zu9EaMFMdZqb9v6mmw7HlwPobDdmPelUDC+Yz379vL+Urk55eMHTZNyPe68S1emsIF9zg9/vLqaoU6ogv1OV3+4sJKdTrKAQM6dfb8+npePEZWcP34SfyG2eFA9S3qn5NJfsbHoz1rzy6P5K9E4C6zhx2en0ZvRp7rGDtZA7GJfXEeey0wevB3zWPaJO66sI1Kl7+Uod3EsodeCMSrdW4z/X6dJqUAe1GtRBrQZ1Ss0qdap1av/AEnXKQZE6AoIidQQEReoITIJKHZwElTo4CSp1cBJU6uAkqNTBSVCpg5OgUgcnQaUOToJKHZwElTo4CSp1cBJU6uAkqNTp8t+hqAOToPwB0jkCIdHnn7gAAAAASUVORK5CYII=",
  },
  office: {
    name: "office-reference.jpg",
    meta: "JPG · 940 KB",
    alt: "Office",
    src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAIAAABt+uBvAAADrElEQVR42u3cyXITMRAG4D86c+AtCTYEEigoloIKFFBwjpc4EPawPQHPNbJ9FAfLlJdxq2dGm0vdp1Q8mkm+anusVo8Orv89NcYAgAFgYAAA1G+WPwO8gVuv1g9kXH1tIP1Hrp/WvtLkv1sOVKJD6BgDJTqEDmCU6BA6MFCiQ+gAUKJD6MAYJTr0QCU69EAlOuRAKNEhdBafQaJDHaZEhz5MiQ59mBId6rCVu5jo1J9EiQ59dSU69EmU6NAnUaJDX12JDnV1dsm1UB1mybVcHU7JNbZOdeMsHx1nyTWJDqrDQSY6dMk1yTtrGXnobE9WU+pUh2f/fareIAedjclq6k/l9chBp7bkmkbHfu6shO4Pk+tsl1yT3tFrI6nORsk1mU51c1CLo2+N0uqs3sXyyx0guc7uZZ+IOrvSxybR0Tihzo5v0rFnEoxIpFP3TTquzuL7Dh36znkqHWbJNewslJdBaXQ4JdeAOlVvyPTRx5MkOs6SaxY61ujkIr4OXXLN4J1Ve8+PqANAJdFpmj42ie69j6wDGJWoNoj2SRRRx7Amq751dH/Ymmd6/0NMHcZkNURduWNE1HFNVgPo6P6oo8/0wWU0HXKyGm5NwktE0UGDTnsfOrZ80TmmDy/j6LA77bPKHSCaDq/T3pOOr/SxSfToYwQduDvts9SxRo8/hdZxddr7XSkOFCF1QHXa+9PRt8eBcKZPPgfVYZZcc82d+hU0nzqckmtXnXDpY5Po6ZdwOs6Sq5cOlQgpFEqHLrl60NFH4wg+s2dfA+msNy+E6G6KF0F0VpoXAujoo/NoPLPn30Lo1JZcvXbGxYwAOtslV286djErYsxOv3vX2Si57m3u0AXZDjqm5mEWHzrx08cm0YsrvzrgPRa+HzrW6OWVRx3OY+GtOnLThj8duB4Lb6yj706S+8xe/fClgwad9nuRO+t3/O467E57nk4O6bOI+eufXnR4nfaNOnKzis46cHfas3X08SQrnPmbX911XJ32+5s7a2WQ9jpkp30TndzSxybR298ddXZ32rd4EgA551FLHdQ3LzTU0ScX2eLM3/3pogNjDq6Nevk8vRauctpOB5vNC6JDLfuIDrXsIzrUso/oUMs+okPVRY0SHULHNN6JszAdNNuJszydJjtxFqkD7k6cperwduIsWAfunTjL1nHtxFm8DqidOEUHxE6cogNiJ07RAbETp+i4l31Eh+q0Fx2q0150WpVcy9XhlFyL1nGWXEvXoUuuogMA/wB1RCFLwfvGfwAAAABJRU5ErkJggg==",
  },
};

type ImageFile = (typeof images)[keyof typeof images];

const image = (file: ImageFile): string => `<img src="${file.src}" alt="${escapeHtml(file.alt)}">`;

/** Titel und optional Beschreibung (Text wird escaped) */
const content = (title: string, description?: string): string =>
  AttachmentContent({
    children: [
      AttachmentTitle({ children: escapeHtml(title) }),
      description ? AttachmentDescription({ children: escapeHtml(description) }) : "",
    ],
  });

/** Aktion mit aria-label, benannt nach Ziel ("Remove datei.pdf") */
const action = (label: string, name: IconName = "x"): string =>
  AttachmentAction({ attributes: { "aria-label": label }, children: icon(name) });

const actions = (...items: string[]): string => AttachmentActions({ children: items });

const meta: Meta<AttachmentStoryArgs> = {
  title: "UI-Library/Attachment",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Zeigt eine Datei oder ein Bild als Karte mit Media, Name, Metadaten, Aktionen und Upload-Zustand. Port von shadcn/ui (Base). Die Komponente lädt nichts hoch: der Zustand (`state`) wird von außen gesetzt. Benötigt die CSS-Utilities `shimmer`, `scroll-fade-x` und `scrollbar-none`. Hat keine Datastar-Logik.",
      },
    },
  },
  argTypes: {
    state: { control: "select", options: states },
    size: { control: "select", options: sizes },
    orientation: { control: "select", options: orientations },
    mediaVariant: { control: "inline-radio", options: ["icon", "image"] },
    class: { control: "text" },
    title: { control: "text" },
    description: { control: "text" },
    showAction: { control: "boolean" },
  },
  args: {
    state: "done",
    size: "default",
    orientation: "horizontal",
    mediaVariant: "icon",
    title: "sales-dashboard.pdf",
    description: "PDF · 2.4 MB",
    showAction: true,
  },
  render: ({ title, description, mediaVariant, showAction, ...args }) => {
    const name = title ?? "";
    const media =
      mediaVariant === "image"
        ? AttachmentMedia({ variant: "image", children: image(images.workspace) })
        : AttachmentMedia({ children: icon("fileText") });

    return `<div class="flex max-w-sm">${Attachment({
      ...args,
      children: [media, content(name, description), showAction ? actions(action(`Remove ${name}`)) : ""],
    })}</div>`;
  },
};

export default meta;
type Story = StoryObj<AttachmentStoryArgs>;

export const Playground: Story = {};

/** Bild im Media-Bereich: `variant: "image"` mit einem `<img>`; mit `orientation: "vertical"` steht das Bild über dem Content */
export const Images: Story = {
  render: () =>
    `<div class="flex flex-wrap gap-3">${[images.workspace, images.desk, images.office]
      .map((file) =>
        Attachment({
          orientation: "vertical",
          children: [
            AttachmentMedia({ variant: "image", children: image(file) }),
            content(file.name, file.meta),
            actions(action(`Remove ${file.name}`)),
            AttachmentTrigger({ href: `#${file.alt.toLowerCase()}`, attributes: { "aria-label": `Open ${file.name}` } }),
          ],
        })
      )
      .join("")}</div>`,
};

/**
 * Zustände über `state`: `idle` (gestrichelter Rahmen), `uploading` und `processing` (Titel schimmert),
 * `error` (destruktive Farben) und `done`. Der Fehlergrund steht in der Beschreibung, damit der Zustand nicht nur über die Farbe vermittelt wird.
 */
export const States: Story = {
  render: () =>
    `<div class="flex w-full max-w-sm flex-col gap-2">${[
      Attachment({
        state: "idle",
        class: "w-full",
        children: [
          AttachmentMedia({ children: icon("fileText") }),
          content("selected-file.pdf", "Ready to upload"),
          actions(action("Remove selected-file.pdf")),
        ],
      }),
      Attachment({
        state: "uploading",
        class: "w-full",
        children: [
          AttachmentMedia({ children: spinner() }),
          content("design-system.zip", "Uploading · 64%"),
          actions(action("Cancel upload of design-system.zip")),
        ],
      }),
      Attachment({
        state: "processing",
        class: "w-full",
        children: [
          AttachmentMedia({ children: icon("clock") }),
          content("market-research.pdf", "Processing document"),
          actions(action("Cancel processing of market-research.pdf")),
        ],
      }),
      Attachment({
        state: "error",
        class: "w-full",
        children: [
          AttachmentMedia({ children: icon("fileSpreadsheet") }),
          content("financial-model.xlsx", "Upload failed. Try again."),
          actions(action("Retry upload of financial-model.xlsx", "refresh"), action("Remove financial-model.xlsx")),
        ],
      }),
      Attachment({
        state: "done",
        class: "w-full",
        children: [
          AttachmentMedia({ children: icon("check") }),
          content("uploaded-report.pdf", "Uploaded · 1.8 MB"),
          actions(action("Remove uploaded-report.pdf")),
        ],
      }),
    ].join("")}</div>`,
};

/** Größen über `size`: default, sm und xs */
export const Sizes: Story = {
  render: () =>
    `<div class="flex w-full max-w-sm flex-col items-start gap-3">${[
      Attachment({
        size: "default",
        children: [AttachmentMedia({ children: icon("fileText") }), content("Default attachment", "PDF · 2.4 MB")],
      }),
      Attachment({
        size: "sm",
        children: [AttachmentMedia({ children: icon("fileText") }), content("Small attachment", "PDF · 2.4 MB")],
      }),
      Attachment({
        size: "xs",
        children: [AttachmentMedia({ children: icon("fileText") }), content("Extra small attachment")],
      }),
    ].join("")}</div>`,
};

/**
 * Gruppe: waagerecht scrollbare Reihe mit Snap und Kantenverlauf.
 * Eine Gruppe aus rein darstellenden Attachments wird per Tastatur nur scrollbar, wenn sie selbst fokussierbar ist
 * (`tabindex`, `role="group"`, `aria-label` über `attributes`).
 */
export const Group: Story = {
  render: () =>
    `<div class="w-full max-w-md">${AttachmentGroup({
      attributes: { tabindex: 0, role: "group", "aria-label": "Attachments" },
      children: [
        Attachment({
          children: [AttachmentMedia({ children: icon("fileText") }), content("briefing-notes.pdf", "PDF · 1.4 MB")],
        }),
        Attachment({
          children: [
            AttachmentMedia({ variant: "image", children: image(images.workspace) }),
            content(images.workspace.name, images.workspace.meta),
          ],
        }),
        Attachment({
          children: [AttachmentMedia({ children: icon("fileSpreadsheet") }), content("customers.csv", "CSV · 18 KB")],
        }),
        Attachment({
          children: [AttachmentMedia({ children: icon("fileCode") }), content("renderer.tsx", "TSX · 12 KB")],
        }),
      ],
    })}</div>`,
};

/**
 * Trigger: die ganze Karte öffnet einen Link oder ein Popover. Der Trigger liegt hinter den Aktionen,
 * sodass diese klickbar bleiben. Das Popover nutzt die native Popover API (kein Datastar nötig);
 * für einen echten Dialog den Dialog des Design-Systems einsetzen.
 */
export const Trigger: Story = {
  render: () =>
    `<div class="flex w-full max-w-sm flex-col gap-2">${[
      Attachment({
        class: "w-full",
        children: [
          AttachmentMedia({ children: icon("fileSearch") }),
          content("research-summary.pdf", "Open preview popover"),
          actions(action("Copy research-summary.pdf", "copy")),
          AttachmentTrigger({
            attributes: { "aria-label": "Preview research-summary.pdf", popovertarget: "attachment-trigger-preview" },
          }),
        ],
      }),
      Attachment({
        class: "w-full",
        children: [
          AttachmentMedia({ children: icon("fileCode") }),
          content("message-renderer.tsx", "Open as link"),
          actions(action("Remove message-renderer.tsx")),
          AttachmentTrigger({
            href: "#message-renderer",
            attributes: { "aria-label": "Open message-renderer.tsx" },
          }),
        ],
      }),
    ].join("")}</div>
    <div id="attachment-trigger-preview" popover class="m-auto w-80 rounded-xl border bg-popover p-4 text-sm text-popover-foreground shadow-lg backdrop:bg-black/40">
      <p class="font-medium">research-summary.pdf</p>
      <p class="mt-1 text-muted-foreground">Vorschau der Datei (Beispielinhalt).</p>
    </div>`,
};
