import type { Meta, StoryObj } from "@storybook/html-vite";

import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
} from "./InputGroup";
import type { InputGroupAddonAlign } from "./InputGroup.types";

type InputGroupStoryArgs = {
  align?: Extract<InputGroupAddonAlign, "inline-start" | "inline-end">;
  placeholder?: string;
  disabled?: boolean;
  class?: string;
};

/** Lucide-artiges Icon als SVG-String; Größe und Farbe kommen vom Addon bzw. Button */
const icon = (inner: string, extraClass = ""): string =>
  `<svg${extraClass ? ` class="${extraClass}"` : ""} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

const searchPaths = `<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>`;
const eyeOffPaths = `<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"></path><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"></path><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"></path><path d="m2 2 20 20"></path>`;
const copyPaths = `<rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>`;
const fileCodePaths = `<path d="M10 12.5 8 15l2 2.5"></path><path d="m14 12.5 2 2.5-2 2.5"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"></path>`;
const checkPaths = `<path d="M20 6 9 17l-5-5"></path>`;
const creditCardPaths = `<rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line>`;
const infoPaths = `<circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>`;
const loaderPaths = `<path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path>`;

/** Lokaler Platzhalter für Kbd (die Komponente ist noch nicht portiert) */
const kbd = (text: string): string =>
  `<kbd class="pointer-events-none inline-flex h-5 min-w-5 items-center justify-center rounded-sm bg-muted px-1 font-sans text-xs font-medium text-muted-foreground select-none">${text}</kbd>`;

/** Container für mehrere Gruppen untereinander */
const stack = (...groups: string[]): string => `<div class="flex w-full max-w-sm flex-col gap-6">${groups.join("")}</div>`;

const meta: Meta<InputGroupStoryArgs> = {
  title: "UI-Library/Input Group",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Fügt einem Eingabefeld oder Textfeld Addons hinzu: Icons, Text, Buttons oder Tastenkürzel. Port von shadcn/ui (Base). Das Addon steht im DOM nach dem Eingabefeld und wird über `align` positioniert. Für den Fokus beim Klick auf ein Addon braucht die Komponente ein geladenes Datastar.",
      },
    },
  },
  argTypes: {
    align: { control: "select", options: ["inline-start", "inline-end"] },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    class: { control: "text" },
  },
  args: {
    align: "inline-start",
    placeholder: "Search...",
    disabled: false,
  },
  render: ({ align, placeholder, disabled, class: className }) =>
    stack(
      InputGroup({
        class: className,
        attributes: disabled ? { "data-disabled": "true" } : undefined,
        children: [
          InputGroupInput({ attributes: { placeholder, "aria-label": "Search", disabled } }),
          InputGroupAddon({ align, children: icon(searchPaths) }),
        ],
      })
    ),
};

export default meta;
type Story = StoryObj<InputGroupStoryArgs>;

export const Default: Story = {};

/** `align="inline-start"` (Standard): Addon vor dem Eingabefeld */
export const InlineStart: Story = {
  render: () =>
    stack(
      InputGroup({
        children: [
          InputGroupInput({ attributes: { placeholder: "Search...", "aria-label": "Search" } }),
          InputGroupAddon({ children: icon(searchPaths) }),
        ],
      })
    ),
};

/** `align="inline-end"`: Addon nach dem Eingabefeld */
export const InlineEnd: Story = {
  render: () =>
    stack(
      InputGroup({
        children: [
          InputGroupInput({ attributes: { type: "password", placeholder: "Enter password", "aria-label": "Password" } }),
          InputGroupAddon({ align: "inline-end", children: icon(eyeOffPaths) }),
        ],
      })
    ),
};

/** `align="block-start"`: Addon über dem Feld; `border-b` am Addon erzeugt eine Trennlinie */
export const BlockStart: Story = {
  render: () =>
    stack(
      InputGroup({
        children: [
          InputGroupInput({ attributes: { placeholder: "John Doe", "aria-label": "Full name" } }),
          InputGroupAddon({ align: "block-start", children: InputGroupText({ children: "Full Name" }) }),
        ],
      }),
      InputGroup({
        children: [
          InputGroupTextarea({
            class: "min-h-[120px] font-mono text-sm",
            attributes: { placeholder: "console.log('Hello, world!');", "aria-label": "Code" },
          }),
          InputGroupAddon({
            align: "block-start",
            class: "border-b",
            children: [
              InputGroupText({ class: "font-mono font-medium", children: [icon(fileCodePaths), "script.js"] }),
              InputGroupButton({
                size: "icon-xs",
                class: "ml-auto",
                attributes: { "aria-label": "Copy" },
                children: icon(copyPaths),
              }),
            ],
          }),
        ],
      })
    ),
};

/** `align="block-end"`: Addon unter dem Feld; `border-t` am Addon erzeugt eine Trennlinie */
export const BlockEnd: Story = {
  render: () =>
    stack(
      InputGroup({
        children: [
          InputGroupInput({ attributes: { placeholder: "0.00", "aria-label": "Amount" } }),
          InputGroupAddon({
            align: "block-end",
            children: [InputGroupText({ children: "USD" }), InputGroupText({ class: "ml-auto", children: "Footer positioned below the input." })],
          }),
        ],
      }),
      InputGroup({
        children: [
          InputGroupTextarea({ attributes: { placeholder: "Write a comment...", "aria-label": "Comment" } }),
          InputGroupAddon({
            align: "block-end",
            class: "border-t",
            children: [
              InputGroupText({ children: "0/280" }),
              InputGroupButton({ variant: "default", size: "sm", class: "ml-auto", children: "Post" }),
            ],
          }),
        ],
      })
    ),
};

/** Icons als Addon; mehrere Icons in einem Addon sind möglich */
export const Icon: Story = {
  render: () =>
    stack(
      InputGroup({
        children: [
          InputGroupInput({ attributes: { placeholder: "Card number", "aria-label": "Card number" } }),
          InputGroupAddon({ children: icon(creditCardPaths) }),
          InputGroupAddon({ align: "inline-end", children: icon(checkPaths) }),
        ],
      }),
      InputGroup({
        children: [
          InputGroupInput({ attributes: { placeholder: "Card number", "aria-label": "Card number" } }),
          InputGroupAddon({ align: "inline-end", children: [icon(checkPaths), icon(infoPaths)] }),
        ],
      })
    ),
};

/** Text als Präfix oder Suffix, z. B. Währung, Protokoll, Domain oder Zeichenzähler */
export const Text: Story = {
  render: () =>
    stack(
      InputGroup({
        children: [
          InputGroupAddon({ children: InputGroupText({ children: "$" }) }),
          InputGroupInput({ attributes: { placeholder: "0.00", "aria-label": "Amount" } }),
          InputGroupAddon({ align: "inline-end", children: InputGroupText({ children: "USD" }) }),
        ],
      }),
      InputGroup({
        children: [
          InputGroupAddon({ children: InputGroupText({ children: "https://" }) }),
          InputGroupInput({ attributes: { placeholder: "example", "aria-label": "Domain" } }),
          InputGroupAddon({ align: "inline-end", children: InputGroupText({ children: ".com" }) }),
        ],
      }),
      InputGroup({
        children: [
          InputGroupInput({ attributes: { placeholder: "Enter your username", "aria-label": "Username" } }),
          InputGroupAddon({ align: "inline-end", children: InputGroupText({ children: "@company.com" }) }),
        ],
      }),
      InputGroup({
        children: [
          InputGroupTextarea({ attributes: { placeholder: "Enter your message", "aria-label": "Message" } }),
          InputGroupAddon({ align: "block-end", children: InputGroupText({ class: "text-xs", children: "120 characters left" }) }),
        ],
      })
    ),
};

/** Buttons im Addon; Klicks auf Buttons fokussieren das Feld nicht */
export const WithButton: Story = {
  render: () =>
    stack(
      InputGroup({
        children: [
          InputGroupAddon({ children: InputGroupText({ children: "https://" }) }),
          InputGroupInput({ attributes: { value: "example.com", "aria-label": "URL" } }),
          InputGroupAddon({
            align: "inline-end",
            children: InputGroupButton({ size: "icon-xs", attributes: { "aria-label": "Copy" }, children: icon(copyPaths) }),
          }),
        ],
      }),
      InputGroup({
        children: [
          InputGroupInput({ attributes: { placeholder: "Type to search...", "aria-label": "Search" } }),
          InputGroupAddon({ align: "inline-end", children: InputGroupButton({ variant: "secondary", children: "Search" }) }),
        ],
      })
    ),
};

/** Tastenkürzel (kbd) im Addon */
export const WithKbd: Story = {
  render: () =>
    stack(
      InputGroup({
        children: [
          InputGroupInput({ attributes: { placeholder: "Search...", "aria-label": "Search" } }),
          InputGroupAddon({ children: icon(searchPaths) }),
          InputGroupAddon({ align: "inline-end", children: kbd("&#8984;K") }),
        ],
      })
    ),
};

/** Ladeanzeige im Addon */
export const WithSpinner: Story = {
  render: () =>
    stack(
      InputGroup({
        attributes: { "data-disabled": "true" },
        children: [
          InputGroupInput({ attributes: { placeholder: "Searching...", disabled: true, "aria-label": "Search" } }),
          InputGroupAddon({ align: "inline-end", children: icon(loaderPaths, "animate-spin") }),
        ],
      }),
      InputGroup({
        attributes: { "data-disabled": "true" },
        children: [
          InputGroupInput({ attributes: { value: "Please wait...", disabled: true, "aria-label": "Status" } }),
          InputGroupAddon({ children: icon(loaderPaths, "animate-spin") }),
        ],
      }),
      InputGroup({
        attributes: { "data-disabled": "true" },
        children: [
          InputGroupInput({ attributes: { value: "Saving...", disabled: true, "aria-label": "Status" } }),
          InputGroupAddon({
            align: "inline-end",
            children: [icon(loaderPaths, "animate-spin"), InputGroupText({ children: "Saving..." })],
          }),
        ],
      })
    ),
};

/** Textfeld mit Kopf- und Fußzeile */
export const WithTextarea: Story = {
  render: () =>
    stack(
      InputGroup({
        children: [
          InputGroupTextarea({
            class: "min-h-[120px] font-mono text-sm",
            attributes: { placeholder: "console.log('Hello, world!');", "aria-label": "Code" },
          }),
          InputGroupAddon({
            align: "block-end",
            class: "border-t",
            children: [
              InputGroupText({ children: "Line 1, Column 1" }),
              InputGroupButton({ variant: "default", size: "sm", class: "ml-auto", children: "Run" }),
            ],
          }),
          InputGroupAddon({
            align: "block-start",
            class: "border-b",
            children: [
              InputGroupText({ class: "font-mono font-medium", children: [icon(fileCodePaths), "script.js"] }),
              InputGroupButton({
                size: "icon-xs",
                class: "ml-auto",
                attributes: { "aria-label": "Copy" },
                children: icon(copyPaths),
              }),
            ],
          }),
        ],
      })
    ),
};

/**
 * Eigenes Feld: `data-slot="input-group-control"` aktiviert Fokus- und Fehlerzustand der Gruppe.
 * Hier ein Textfeld mit `field-sizing-content` statt einer Autosize-Bibliothek.
 */
export const CustomInput: Story = {
  render: () =>
    stack(
      InputGroup({
        children: [
          `<textarea data-slot="input-group-control" aria-label="Message" placeholder="Autoresize textarea..." class="flex field-sizing-content min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"></textarea>`,
          InputGroupAddon({
            align: "block-end",
            children: InputGroupButton({ variant: "default", size: "sm", class: "ml-auto", children: "Submit" }),
          }),
        ],
      })
    ),
};

/** Deaktiviert: `data-disabled="true"` an der Gruppe dimmt die Addons (der Selektor erwartet den Wert "true") */
export const Disabled: Story = {
  render: () =>
    stack(
      InputGroup({
        attributes: { "data-disabled": "true" },
        children: [
          InputGroupInput({ attributes: { placeholder: "Search...", disabled: true, "aria-label": "Search" } }),
          InputGroupAddon({ children: icon(searchPaths) }),
        ],
      })
    ),
};

/** Fehlerzustand: `aria-invalid="true"` am Feld färbt Rahmen und Ring der Gruppe */
export const Invalid: Story = {
  render: () =>
    stack(
      InputGroup({
        children: [
          InputGroupInput({ attributes: { value: "not-an-email", "aria-invalid": "true", "aria-label": "Email" } }),
          InputGroupAddon({ align: "inline-end", children: InputGroupText({ children: "@company.com" }) }),
        ],
      })
    ),
};
