import type { Meta, StoryObj } from "@storybook/html-vite";

import { createSignals } from "../../utils/SignalManager";
import { Button } from "../button";
import { Cropper, CropperArea, CropperImage, CropperVideo } from "./Cropper";
import { cropperSignals } from "./Cropper.expressions";
import type { CropperArgs } from "./Cropper.types";

type CropperStoryArgs = Omit<CropperArgs, "children" | "attributes" | "crop"> & {
  cropX?: number;
  cropY?: number;
};

/** Demo-Bild als SVG-Data-URI (1600 x 1000), damit die Stories ohne externe Dateien laufen */
const demoImage = (hueA = 215, hueB = 28): string => {
  const lines = Array.from({ length: 7 }, (_, i) => {
    const x = (i + 1) * 200;
    return `<line x1="${x}" y1="0" x2="${x}" y2="1000" stroke="white" stroke-opacity="0.35" stroke-width="2"/><text x="${x + 8}" y="40" fill="white" font-family="sans-serif" font-size="28">${x}</text>`;
  }).join("");
  const rows = Array.from({ length: 4 }, (_, i) => {
    const y = (i + 1) * 200;
    return `<line x1="0" y1="${y}" x2="1600" y2="${y}" stroke="white" stroke-opacity="0.35" stroke-width="2"/><text x="8" y="${y - 8}" fill="white" font-family="sans-serif" font-size="28">${y}</text>`;
  }).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hueA} 80% 45%)"/><stop offset="1" stop-color="hsl(${hueB} 90% 55%)"/></linearGradient></defs><rect width="1600" height="1000" fill="url(#g)"/>${lines}${rows}<circle cx="800" cy="500" r="260" fill="white" fill-opacity="0.18" stroke="white" stroke-width="6"/><circle cx="380" cy="300" r="110" fill="black" fill-opacity="0.25"/><rect x="1080" y="560" width="360" height="260" rx="24" fill="black" fill-opacity="0.25"/><text x="800" y="520" fill="white" font-family="sans-serif" font-size="96" text-anchor="middle">Cropper</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

/** Demo-Video (320 x 180, 2 Sekunden, mp4/h264) als Data-URI */
const demoVideo = "data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAQlbW9vdgAAAGxtdmhkAAAAAAAAAAAAAAAAAAAD6AAAB9AAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAA090cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAABAAAAAAAAB9AAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAUAAAAC0AAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAAfQAAAIAAABAAAAAALHbWRpYQAAACBtZGhkAAAAAAAAAAAAAAAAAAAwAAAAYABVxAAAAAAALWhkbHIAAAAAAAAAAHZpZGUAAAAAAAAAAAAAAABWaWRlb0hhbmRsZXIAAAACcm1pbmYAAAAUdm1oZAAAAAEAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAjJzdGJsAAAAwnN0c2QAAAAAAAAAAQAAALJhdmMxAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAUAAtABIAAAASAAAAAAAAAABFUxhdmM2MC4zMS4xMDIgbGlieDI2NAAAAAAAAAAAAAAAGP//AAAAOGF2Y0MBZAAV/+EAG2dkABWscgRBQZ+fARAAAAMAEAAAAwGA8WLYRgEABmjoQ7LIsP34+AAAAAAQcGFzcAAAAAEAAAABAAAAFGJ0cnQAAAAAAAAkRAAAJEQAAAAYc3R0cwAAAAAAAAABAAAAGAAABAAAAAAUc3RzcwAAAAAAAAABAAAAAQAAAJhjdHRzAAAAAAAAABEAAAABAAAIAAAAAAEAACAAAAAAAQAADAAAAAACAAAAAAAAAAMAAAQAAAAAAQAAGAAAAAABAAAIAAAAAAEAAAAAAAAAAgAABAAAAAABAAAYAAAAAAEAAAgAAAAAAQAAAAAAAAACAAAEAAAAAAEAABwAAAAAAQAADAAAAAACAAAAAAAAAAIAAAQAAAAAHHN0c2MAAAAAAAAAAQAAAAEAAAAYAAAAAQAAAHRzdHN6AAAAAAAAAAAAAAAYAAAD4AAAALgAAAAjAAAAIAAAABAAAAATAAAAHgAAABUAAAC8AAAALwAAABgAAAAYAAAAEQAAAMQAAAAqAAAAGQAAABUAAAAWAAAAyQAAAD0AAAAfAAAAGAAAACIAAAAjAAAAFHN0Y28AAAAAAAAAAQAABFUAAABidWR0YQAAAFptZXRhAAAAAAAAACFoZGxyAAAAAAAAAABtZGlyYXBwbAAAAAAAAAAAAAAAAC1pbHN0AAAAJal0b28AAAAdZGF0YQAAAAEAAAAATGF2ZjYwLjE2LjEwMAAAAAhmcmVlAAAJGW1kYXQAAAK9BgX//7ncRem95tlIt5Ys2CDZI+7veDI2NCAtIGNvcmUgMTY0IHIzMTA4IDMxZTE5ZjkgLSBILjI2NC9NUEVHLTQgQVZDIGNvZGVjIC0gQ29weWxlZnQgMjAwMy0yMDIzIC0gaHR0cDovL3d3dy52aWRlb2xhbi5vcmcveDI2NC5odG1sIC0gb3B0aW9uczogY2FiYWM9MSByZWY9MTYgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MzoweDEzMyBtZT11bWggc3VibWU9MTAgcHN5PTEgcHN5X3JkPTEuMDA6MC4wMCBtaXhlZF9yZWY9MSBtZV9yYW5nZT0yNCBjaHJvbWFfbWU9MSB0cmVsbGlzPTIgOHg4ZGN0PTEgY3FtPTAgZGVhZHpvbmU9MjEsMTEgZmFzdF9wc2tpcD0xIGNocm9tYV9xcF9vZmZzZXQ9LTIgdGhyZWFkcz0xIGxvb2thaGVhZF90aHJlYWRzPTEgc2xpY2VkX3RocmVhZHM9MCBucj0wIGRlY2ltYXRlPTEgaW50ZXJsYWNlZD0wIGJsdXJheV9jb21wYXQ9MCBzdGl0Y2hhYmxlPTEgY29uc3RyYWluZWRfaW50cmE9MCBiZnJhbWVzPTggYl9weXJhbWlkPTIgYl9hZGFwdD0yIGJfYmlhcz0wIGRpcmVjdD0zIHdlaWdodGI9MSBvcGVuX2dvcD0wIHdlaWdodHA9MiBrZXlpbnQ9MjUwIGtleWludF9taW49MTIgc2NlbmVjdXQ9NDAgaW50cmFfcmVmcmVzaD0wIHJjX2xvb2thaGVhZD02MCByYz1jcmYgbWJ0cmVlPTEgY3JmPTM2LjAgcWNvbXA9MC42MCBxcG1pbj0wIHFwbWF4PTY5IHFwc3RlcD00IGlwX3JhdGlvPTEu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";

const frame = (inner: string, height = "h-80"): string => `<div class="${height} w-full max-w-xl">${inner}</div>`;

const rangeClass = "w-full accent-primary";
const selectClass = "h-9 rounded-md border border-input bg-background px-2 text-sm";

/** Beschriftetes Feld, das ein Signal als Zahl über einen Schieberegler steuert */
const slider = (id: string, label: string, prop: "zoom" | "rotation" | "cropX" | "cropY", min: number, max: number, step: number): string => {
  const s = cropperSignals(id);
  return `<label class="grid gap-1 text-sm"><span class="flex justify-between"><span>${label}</span><span class="tabular-nums text-muted-foreground" data-text="Number(${s.signal(prop)}).toFixed(2)"></span></span><input type="range" class="${rangeClass}" min="${min}" max="${max}" step="${step}" data-effect="el.value = ${s.signal(prop)}" data-on:input="${s.set(prop, "Number(el.value)")}"></label>`;
};

/** Button mit Klick-Handler: Der Handler hängt am Wrapper, weil die Button-Args hier nicht bekannt sind */
const action = (label: string, expression: string): string =>
  `<span class="contents" data-on:click="${expression.replaceAll('"', "&quot;")}">${Button({ children: label, variant: "outline" })}</span>`;

const meta: Meta<CropperStoryArgs> = {
  title: "UI-Library/Cropper",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Zuschnitt für Bilder und Videos mit Zoom, Drehung und verschiebbarem Zuschnittbereich. Port von Dice UI (Base) nach Datastar: crop, zoom, rotation und alle Optionen sind Signale (`$<id>.zoom` usw., aus `-` in der ID wird `_`), die Callbacks sind Events am Cropper (`cropcomplete`, `cropareachange` ...). Funktioniert nur mit geladenem Datastar. Der Container braucht eine feste Höhe.",
      },
    },
  },
  argTypes: {
    id: { control: "text" },
    shape: { control: "select", options: ["rectangle", "circle"] },
    objectFit: { control: "select", options: ["contain", "cover", "horizontal-cover", "vertical-cover"] },
    aspectRatio: { control: { type: "number", step: 0.1 } },
    zoom: { control: { type: "range", min: 1, max: 3, step: 0.05 } },
    minZoom: { control: "number" },
    maxZoom: { control: "number" },
    zoomSpeed: { control: "number" },
    rotation: { control: { type: "range", min: -180, max: 180, step: 1 } },
    keyboardStep: { control: "number" },
    cropX: { control: "number" },
    cropY: { control: "number" },
    allowOverflow: { control: "boolean" },
    preventScrollZoom: { control: "boolean" },
    withGrid: { control: "boolean" },
  },
  args: {
    id: "cropper-playground",
    shape: "rectangle",
    objectFit: "contain",
    aspectRatio: 4 / 3,
    zoom: 1,
    minZoom: 1,
    maxZoom: 3,
    zoomSpeed: 1,
    rotation: 0,
    keyboardStep: 1,
    cropX: 0,
    cropY: 0,
    allowOverflow: false,
    preventScrollZoom: false,
    withGrid: false,
  },
  render: ({ cropX, cropY, ...args }) =>
    frame(
      Cropper({
        ...args,
        crop: { x: cropX ?? 0, y: cropY ?? 0 },
        children: [CropperImage({ cropperId: args.id, src: demoImage(), alt: "Demo-Bild" }), CropperArea({ cropperId: args.id })],
      })
    ),
};

export default meta;
type Story = StoryObj<CropperStoryArgs>;

export const Playground: Story = {};

/** Aufbau: Cropper, CropperImage und CropperArea teilen sich die `id` (`cropperId`) */
export const Layout: Story = {
  render: () =>
    frame(
      Cropper({
        id: "cropper-layout",
        children: [CropperImage({ cropperId: "cropper-layout", src: demoImage(), alt: "Demo-Bild" }), CropperArea({ cropperId: "cropper-layout" })],
      })
    ),
};

/** Externe Steuerung: Zoom, Drehung und Position sind Signale. Die Werte unten kommen aus den Signalen des Croppers. */
export const ControlledState: Story = {
  render: () => {
    const id = "cropper-controlled";
    const s = cropperSignals(id);
    const readout = (label: string, prop: Parameters<typeof s.signal>[0]): string =>
      `<div class="flex justify-between"><dt class="text-muted-foreground">${label}</dt><dd class="tabular-nums" data-text="Math.round(${s.signal(prop)})"></dd></div>`;

    return `<div class="grid w-full max-w-xl gap-4">${frame(
      Cropper({
        id,
        children: [CropperImage({ cropperId: id, src: demoImage(), alt: "Demo-Bild" }), CropperArea({ cropperId: id, withGrid: true })],
      })
    )}<div class="grid gap-3">${slider(id, "Zoom", "zoom", 1, 3, 0.01)}${slider(id, "Drehung", "rotation", -180, 180, 1)}${slider(id, "Position X", "cropX", -600, 600, 1)}${slider(id, "Position Y", "cropY", -400, 400, 1)}</div><div>${action("Zurücksetzen", [s.set("cropX", "0"), s.set("cropY", "0"), s.set("zoom", "1"), s.set("rotation", "0")].join(", "))}</div><dl class="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">${readout("Ausschnitt X (px)", "pixelX")}${readout("Ausschnitt Y (px)", "pixelY")}${readout("Breite (px)", "pixelWidth")}${readout("Höhe (px)", "pixelHeight")}</dl></div>`;
  },
};

/** Datei wählen: Das Bild kommt aus einem Signal, das nach der Auswahl auf eine Objekt-URL gesetzt wird. */
export const WithFileUpload: Story = {
  render: () => {
    const id = "cropper-upload";
    const file = createSignals("cropper-upload-file", { src: demoImage(160, 300) });
    const s = cropperSignals(id);

    return `<div class="grid w-full max-w-xl gap-4" data-signals="${file.dataSignals.replaceAll('"', "&quot;")}"><input type="file" accept="image/*" class="text-sm file:mr-3 file:rounded-md file:border file:border-input file:bg-background file:px-3 file:py-1.5 file:text-sm" data-on:change="const f = el.files && el.files[0]; f ? (${file.set("src", "URL.createObjectURL(f)")}, ${s.set("cropX", "0")}, ${s.set("cropY", "0")}, ${s.set("zoom", "1")}) : null">${frame(
      Cropper({
        id,
        aspectRatio: 1,
        shape: "circle",
        children: [
          CropperImage({ cropperId: id, src: file.signals.src, alt: "Gewähltes Bild", attributes: { "data-attr:src": file.signal("src") } }),
          CropperArea({ cropperId: id }),
        ],
      })
    )}<p class="text-sm text-muted-foreground">Ausschnitt in Pixeln: <span class="tabular-nums" data-text="${s.signal("pixelX")} + ', ' + ${s.signal("pixelY")} + ' / ' + ${s.signal("pixelWidth")} + ' x ' + ${s.signal("pixelHeight")}"></span></p></div>`;
  },
};

/** Form, Seitenverhältnis und Optionen sind Signale und lassen sich zur Laufzeit ändern. */
export const DifferentShapes: Story = {
  render: () => {
    const id = "cropper-shapes";
    const s = cropperSignals(id);
    const toggle = (label: string, prop: "withGrid" | "allowOverflow" | "preventScrollZoom"): string =>
      `<label class="flex items-center gap-2 text-sm"><input type="checkbox" data-on:change="${s.set(prop, "el.checked")}">${label}</label>`;

    return `<div class="grid w-full max-w-xl gap-4">${frame(
      Cropper({
        id,
        children: [CropperImage({ cropperId: id, src: demoImage(280, 40), alt: "Demo-Bild" }), CropperArea({ cropperId: id })],
      })
    )}<div class="flex flex-wrap items-center gap-4"><label class="flex items-center gap-2 text-sm">Form<select class="${selectClass}" data-on:change="${s.set("shape", "el.value")}"><option value="rectangle">Rechteck</option><option value="circle">Kreis</option></select></label><label class="flex items-center gap-2 text-sm">Seitenverhältnis<select class="${selectClass}" data-on:change="${s.set("aspectRatio", "Number(el.value)")}"><option value="${4 / 3}">4:3</option><option value="1">1:1</option><option value="${16 / 9}">16:9</option><option value="${3 / 4}">3:4</option></select></label><label class="flex items-center gap-2 text-sm">Darstellung<select class="${selectClass}" data-on:change="${s.set("objectFit", "el.value")}"><option value="contain">contain</option><option value="cover">cover</option><option value="horizontal-cover">horizontal-cover</option><option value="vertical-cover">vertical-cover</option></select></label>${toggle("Raster", "withGrid")}${toggle("Überlauf erlauben", "allowOverflow")}${toggle("Mausrad-Zoom aus", "preventScrollZoom")}</div></div>`;
  },
};

/** Video: wie das Bild, mit den Standardwerten der Vorlage (autoplay, loop, muted). */
export const VideoCropping: Story = {
  render: () => {
    const id = "cropper-video";
    return frame(
      Cropper({
        id,
        aspectRatio: 16 / 9,
        children: [CropperVideo({ cropperId: id, src: demoVideo }), CropperArea({ cropperId: id, withGrid: true })],
      })
    );
  },
};
