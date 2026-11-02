import type { Meta, StoryObj } from "@storybook/html-vite";

import { Button } from "../button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCustomItem,
    DropdownMenuFormItem,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuLinkItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "./Dropdown";
import type { DropdownMenuArgs, DropdownMenuContentArgs } from "./Dropdown.types";

const icon = (inner: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

const userIcon = icon(`<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>`);
const creditCardIcon = icon(`<rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line>`);
const settingsIcon = icon(
  `<circle cx="12" cy="12" r="3"></circle><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"></path>`
);
const logOutIcon = icon(
  `<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line>`
);

/**
 * Dropdown mit Button als Trigger (asChild) und Content.
 * IDs müssen pro Story eindeutig sein (die Docs-Seite rendert mehrere Stories).
 */
const dropdown = (
  id: string,
  triggerLabel: string,
  items: string[],
  contentArgs: Omit<DropdownMenuContentArgs, "id" | "children"> = { class: "w-56" }
): string =>
  DropdownMenu({
    id,
    children: [
      DropdownMenuTrigger({ id, asChild: true, children: Button({ children: triggerLabel, variant: "outline" }) }),
      DropdownMenuContent({ id, children: items, ...contentArgs }),
    ],
  });

const meta: Meta<DropdownMenuArgs> = {
  title: "UI-Library/Dropdown",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Zeigt ein Menü mit Aktionen oder Funktionen, ausgelöst über einen Button. Mehrere Dropdowns arbeiten unabhängig voneinander (eigene Signale pro ID). Öffnen und Schließen funktionieren nur, wenn Datastar geladen ist.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<DropdownMenuArgs>;

/** Einfaches Dropdown mit verschiedenen Menü-Items */
export const BasicDropdown: Story = {
  render: () => {
    const id = "dropdown-basic";

    return `<div class="p-24">${dropdown(id, "Open Menu", [
      DropdownMenuLabel({ children: "My Account" }),
      DropdownMenuSeparator(),
      DropdownMenuItem({ id, children: "Profile" }),
      DropdownMenuItem({ id, children: "Billing" }),
      DropdownMenuItem({ id, children: "Team" }),
      DropdownMenuItem({ id, children: "Subscription" }),
    ])}</div>`;
  },
};

/** Menü-Items mit Icons und Tastenkürzeln */
export const WithIconsAndShortcuts: Story = {
  render: () => {
    const id = "dropdown-icons";

    return `<div class="p-24">${dropdown(id, "Open Menu", [
      DropdownMenuItem({ id, children: [userIcon, "Profile", DropdownMenuShortcut({ children: "⇧⌘P" })] }),
      DropdownMenuItem({ id, children: [creditCardIcon, "Billing", DropdownMenuShortcut({ children: "⌘B" })] }),
      DropdownMenuItem({ id, children: [settingsIcon, "Settings", DropdownMenuShortcut({ children: "⌘S" })] }),
      DropdownMenuSeparator(),
      DropdownMenuItem({ id, children: [logOutIcon, "Log out", DropdownMenuShortcut({ children: "⇧⌘Q" })] }),
    ])}</div>`;
  },
};

/** Gruppierte Items mit Labels */
export const GroupedItems: Story = {
  render: () => {
    const id = "dropdown-grouped";

    return `<div class="p-24">${dropdown(id, "Open Menu", [
      DropdownMenuGroup({
        children: [
          DropdownMenuLabel({ children: "Personal" }),
          DropdownMenuItem({ id, children: "Profile" }),
          DropdownMenuItem({ id, children: "Settings" }),
        ],
      }),
      DropdownMenuSeparator(),
      DropdownMenuGroup({
        children: [
          DropdownMenuLabel({ children: "Team" }),
          DropdownMenuItem({ id, children: "Team Settings" }),
          DropdownMenuItem({ id, children: "Invite Users" }),
        ],
      }),
    ])}</div>`;
  },
};

/** Mehrere Dropdowns arbeiten unabhängig voneinander (eigene Signale pro ID) */
export const MultipleDropdowns: Story = {
  render: () => {
    const menus = [1, 2, 3].map((n) => {
      const id = `dropdown-multiple-${n}`;
      const ordinal = ["First", "Second", "Third"][n - 1];

      return dropdown(id, `Dropdown ${n}`, [
        DropdownMenuLabel({ children: `${ordinal} Menu` }),
        DropdownMenuSeparator(),
        ...["A", "B", "C"].map((letter) => DropdownMenuItem({ id, children: `Option ${n}${letter}` })),
      ]);
    });

    return `<div class="flex items-start gap-4 p-24">${menus.join("")}</div>`;
  },
};

/** Position über side, align und sideOffset (Offset in Tailwind-Spacing-Einheiten, 1 = 0.25rem) */
export const Positioning: Story = {
  render: () => {
    const menus = (["bottom", "top", "right", "left"] as const).map((side) => {
      const id = `dropdown-side-${side}`;

      return dropdown(
        id,
        side.charAt(0).toUpperCase() + side.slice(1),
        [DropdownMenuItem({ id, children: "Item one" }), DropdownMenuItem({ id, children: "Item two" })],
        { class: "w-40", side, align: "start" }
      );
    });

    return `<div class="flex items-center justify-center gap-4 p-32">${menus.join("")}</div>`;
  },
};

/** Item-Typen: destructive, deaktiviert, eingerückt, Link, Formular, eigener Inhalt und onClick */
export const ItemTypes: Story = {
  render: () => {
    const id = "dropdown-item-types";

    return `<div class="p-24">${dropdown(id, "Item types", [
      DropdownMenuLabel({ children: "Actions" }),
      DropdownMenuItem({ id, onClick: "console.log('clicked')", children: "Item with onClick" }),
      DropdownMenuItem({ id, inset: true, children: "Inset item" }),
      DropdownMenuItem({ id, disabled: true, children: "Disabled item" }),
      DropdownMenuLinkItem({ id, href: "https://datastar-ui.com", target: "_blank", rel: "noreferrer", children: "Link item" }),
      DropdownMenuFormItem({ id, action: "/logout", children: "Form item (POST)" }),
      DropdownMenuCustomItem({
        id,
        closeOnClick: true,
        children: `<span class="flex flex-col"><span>Custom item</span><span class="text-muted-foreground text-xs">Flow content</span></span>`,
      }),
      DropdownMenuSeparator(),
      DropdownMenuItem({ id, variant: "destructive", children: [logOutIcon, "Delete account"] }),
    ])}</div>`;
  },
};
