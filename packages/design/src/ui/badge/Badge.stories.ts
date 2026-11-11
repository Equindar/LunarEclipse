import type { Meta, StoryObj } from "@storybook/html-vite";

import { renderAttributes } from "../../utils/renderHtmlAttributes";
import { Badge } from "./Badge";
import { buildBadgeIconAttributes } from "./Badge.expressions";
import type { BadgeArgs, BadgeIconPosition, BadgeVariant } from "./Badge.types";

type BadgeStoryArgs = BadgeArgs & { text?: string };

const variants: BadgeVariant[] = ["default", "secondary", "destructive", "outline", "ghost", "link"];

/** Icon mit data-icon, damit das Badge das Padding auf der entsprechenden Seite anpasst */
const icon = (inner: string, position: BadgeIconPosition, extraClass = ""): string =>
  `<svg${extraClass ? ` class="${extraClass}"` : ""}${renderAttributes(buildBadgeIconAttributes(position))} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

const badgeCheckPaths = `<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path><path d="m9 12 2 2 4-4"></path>`;
const bookmarkPaths = `<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>`;
const arrowUpRightPaths = `<path d="M7 7h10v10"></path><path d="M7 17 17 7"></path>`;
const spinnerPaths = `<path d="M21 12a9 9 0 1 1-6.219-8.56"></path>`;

const meta: Meta<BadgeStoryArgs> = {
  title: "UI-Library/Badge",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Zeigt ein Badge oder eine Komponente, die wie ein Badge aussieht. Port von shadcn/ui (Base). Mit `href` wird das Badge als Link gerendert.",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: variants },
    class: { control: "text" },
    href: { control: "text" },
  },
  args: {
    variant: "default",
    text: "Badge",
  },
  render: ({ text, ...args }) => Badge({ ...args, children: text }),
};

export default meta;
type Story = StoryObj<BadgeStoryArgs>;

export const Default: Story = {};

/** Die Variante wird über `variant` gewählt */
export const Variants: Story = {
  render: () =>
    `<div class="flex flex-wrap items-center gap-2">${variants
      .map((variant) => Badge({ variant, children: variant.charAt(0).toUpperCase() + variant.slice(1) }))
      .join("")}</div>`,
};

/** Icon links oder rechts: `data-icon="inline-start"` bzw. `data-icon="inline-end"` am Icon */
export const WithIcon: Story = {
  render: () =>
    `<div class="flex flex-wrap items-center gap-2">${[
      Badge({ variant: "secondary", children: [icon(badgeCheckPaths, "inline-start"), "Verified"] }),
      Badge({ variant: "outline", children: ["Bookmark", icon(bookmarkPaths, "inline-end")] }),
    ].join("")}</div>`,
};

/** Spinner im Badge; ebenfalls mit data-icon */
export const WithSpinner: Story = {
  render: () =>
    `<div class="flex flex-wrap items-center gap-2">${[
      Badge({ variant: "destructive", children: [icon(spinnerPaths, "inline-start", "animate-spin"), "Deleting"] }),
      Badge({ variant: "secondary", children: ["Generating", icon(spinnerPaths, "inline-end", "animate-spin")] }),
    ].join("")}</div>`,
};

/** Mit `href` wird das Badge als Link (`<a>`) gerendert; die Hover-Styles gelten nur dafür */
export const AsLink: Story = {
  render: () => Badge({ href: "#link", children: ["Open Link", icon(arrowUpRightPaths, "inline-end")] }),
};

/** Eigene Farben über `class` */
export const CustomColors: Story = {
  render: () => {
    const colors: [string, string][] = [
      ["Blue", "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"],
      ["Green", "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"],
      ["Sky", "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300"],
      ["Purple", "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300"],
      ["Red", "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"],
    ];

    return `<div class="flex flex-wrap items-center gap-2">${colors
      .map(([label, className]) => Badge({ class: className, children: label }))
      .join("")}</div>`;
  },
};
