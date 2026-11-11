import type { Meta, StoryObj } from "@storybook/html-vite";

import { escapeHtml } from "../../utils/escapeHtml";
import { Button } from "../button";
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemFooter,
    ItemGroup,
    ItemHeader,
    ItemMedia,
    ItemSeparator,
    ItemTitle,
} from "./Item";
import type { ItemArgs, ItemSize, ItemVariant } from "./Item.types";

type ItemStoryArgs = ItemArgs & {
  title?: string;
  description?: string;
  actionLabel?: string;
};

const variants: ItemVariant[] = ["default", "outline", "muted"];
const sizes: ItemSize[] = ["default", "sm", "xs"];

/** Platzhalterbilder als Data-URI, damit die Stories ohne externe Dateien laufen */
const images = {
  one: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAABQ0lEQVR42tXaMY7DMAxE0Zk5yPZ7wxw/BSWLsC2l/p1BOMlrhE/D8d//x1IkS5HjulBk+zSP5DV3pDm3pXjesJ/H84Yx9/iJOZ+f3c5rCNZbClsvB623FbZeClt/HWKo3nLY+joDYL0UtP5HBwD6QwcQ+m0HMPrXDpD0zw6w9PcO8PS9A0j91QGofnQArK8zANZbQevdOsDUr1WCqa9DTNa7tlGuvnUAqW+rBFRfZwCsd22jWP3oAFi/Vgmovq65ep87ANAfOoDQbzuA0b92gKR/doClv3eAp+8dQOqvDkD1owNg/XwmxurrS7j69oIDqm8dQOoth61fqwRUv15wMPX3DvD0dQbA+rVKMPXtBQdU356JmXo5aL3PHQDoDx1A6LcdwOhfO0DSPzvA0t87wNP3DiD1Vweg+vaaFarvf/pD6u0vvcMjhEZgNAUAAAAASUVORK5CYII=",
  two: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAABTElEQVR42tXZWw6DIBSEYQ4L6Zq6nO7ePrS1XhAOiDJ/4qMx30RjJoO9ng8Lk1nwXdV3xgueOV/RQkTrLYSI1pt5A4jqnQF09Z4A0vpiAHV9PgBAnwnA0JtNEa1PvgGSfh8Apt8E4OmXAZD6OQBV/wkA1vvLnKi+uo2q6evaqKC+oo1q6r1tVFbvaqPK+nIbFdcX2qi+PtdGEfrDNkrRp9soSJ9ooyz9to3i9Ks2StT/PyGo/huAqzcLka2/Yhu9U99/G71Z33kbvV/fcxsdou+2jY7S99lGB+o7bKNj9We30eH6U9uogr59GxXRN26jOvqWbVRK335SL6JvPKnX0bec1Evpq9uomr6ujQrqK9qopt7bRmX1rjaqrC+3UXF9oY3q63NtFKE/bKMUfbqNgvSJvxBLvw2A068CEPXreR2oX8zrTP1vXufqLbwBrwJCknlFlKYAAAAASUVORK5CYII=",
  three: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAABQ0lEQVR42tXYOw7CMBBF0XmzAXZKyfopYmLHf1PNpUDgWMmJ5Oha0evzNlP63D8kMy/+rMZNJm8nn43b9eXt5PG4O1pv6l0ApO8cY+klOVqvvISY+nwDUH2ax9VLcrTe5Gy9DjoQUr/dgaj6vQ4E1m90ILZ+1YHw+mkHCPpxByD6QQc4+l4HUPrmME3/7ABQ/1hCRP3vBrB6mRytv84C1hcdYOr7x0D6ejuN0z+200T9vx0Io8/zoPr0DHD1hx2Ipz/pQEj9dgei6vc6EFi/0YHY+lUHwuunHSDoxx2A6Acd4Oh7HUDpO69VWPr6tQpOX7+Zw+kfJyXq8xKC6tMS4uqLDjD1Zs7Wd7bTLH29ncbpNzsQV7/TgdD6ZQei6+cdAOgnHWDoRx3A6LsdIOnbDsD0VQd4+hKB1N/PAFV/LSGwXvIvVJEtP8uhl80AAAAASUVORK5CYII=",
};

/** Lucide-Icon aus Pfaden; ohne Grössenklasse setzt ItemMedia (variant="icon") die Grösse */
const icon = (paths: string, extraClass = ""): string =>
  `<svg${extraClass ? ` class="${extraClass}"` : ""} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

const badgeCheckPaths = `<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path><path d="m9 12 2 2 4-4"></path>`;
const chevronRightPaths = `<path d="m9 18 6-6-6-6"></path>`;
const externalLinkPaths = `<path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>`;
const inboxPaths = `<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>`;
const plusPaths = `<path d="M5 12h14"></path><path d="M12 5v14"></path>`;
const shieldAlertPaths = `<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="M12 8v4"></path><path d="M12 16h.01"></path>`;

/** Einfacher Avatar-Platzhalter mit Initialen (statt der Avatar-Komponente, deren Args hier nicht bekannt sind) */
const avatar = (initials: string): string =>
  `<span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">${escapeHtml(initials)}</span>`;

/** Schmaler Container wie in den Docs */
const column = (inner: string, extraClass = ""): string =>
  `<div class="flex w-full max-w-md flex-col gap-6${extraClass ? ` ${extraClass}` : ""}">${inner}</div>`;

const meta: Meta<ItemStoryArgs> = {
  title: "UI-Library/Item",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Flexibler Container für Titel, Beschreibung, Medien und Aktionen. Port von shadcn/ui (Base). Mit `href` wird das Item als Link gerendert, mit `ItemGroup` und `ItemSeparator` entstehen Listen. Kein Datastar nötig.",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: variants },
    size: { control: "select", options: sizes },
    class: { control: "text" },
    href: { control: "text" },
    title: { control: "text" },
    description: { control: "text" },
    actionLabel: { control: "text" },
  },
  args: {
    variant: "outline",
    size: "default",
    title: "Basic Item",
    description: "A simple item with title and description.",
    actionLabel: "Action",
  },
  render: ({ title, description, actionLabel, ...args }) =>
    column(
      Item({
        ...args,
        children: [
          ItemContent({
            children: [
              ItemTitle({ children: escapeHtml(title ?? "") }),
              ItemDescription({ children: escapeHtml(description ?? "") }),
            ],
          }),
          ItemActions({
            children: Button({ variant: "outline", size: "sm", children: escapeHtml(actionLabel ?? "") }),
          }),
        ],
      }),
    ),
};

export default meta;
type Story = StoryObj<ItemStoryArgs>;

export const Default: Story = {};

/** Die Variante wird über `variant` gewählt: default, outline und muted */
export const Variants: Story = {
  render: () =>
    column(
      [
        ["default", "Default Variant", "Transparent background with no border."],
        ["outline", "Outline Variant", "Outlined style with a visible border."],
        ["muted", "Muted Variant", "Muted background for secondary content."],
      ]
        .map(([variant, title, description]) =>
          Item({
            variant: variant as ItemVariant,
            children: [
              ItemMedia({ variant: "icon", children: icon(inboxPaths) }),
              ItemContent({ children: [ItemTitle({ children: title }), ItemDescription({ children: description })] }),
              ItemActions({ children: Button({ variant: "outline", size: "sm", children: "Open" }) }),
            ],
          }),
        )
        .join(""),
    ),
};

/** Die Grösse wird über `size` gewählt: default, sm und xs. Die Teilkomponenten reagieren über `data-size` */
export const Sizes: Story = {
  render: () =>
    column(
      [
        ["default", "Default Size", "The standard size for most use cases."],
        ["sm", "Small Size", "A compact size for dense layouts."],
        ["xs", "Extra Small Size", "The most compact size available."],
      ]
        .map(([size, title, description]) =>
          Item({
            variant: "outline",
            size: size as ItemSize,
            children: [
              ItemMedia({ variant: "icon", children: icon(inboxPaths) }),
              ItemContent({ children: [ItemTitle({ children: title }), ItemDescription({ children: description })] }),
              ItemActions({ children: Button({ variant: "outline", size: "sm", children: "Open" }) }),
            ],
          }),
        )
        .join(""),
    ),
};

/** Icon im Medienbereich: `ItemMedia` mit `variant="icon"` */
export const WithIcon: Story = {
  render: () =>
    column(
      Item({
        variant: "outline",
        children: [
          ItemMedia({ variant: "icon", children: icon(shieldAlertPaths) }),
          ItemContent({
            children: [
              ItemTitle({ children: "Security Alert" }),
              ItemDescription({ children: "New login detected from unknown device." }),
            ],
          }),
          ItemActions({ children: Button({ variant: "outline", size: "sm", children: "Review" }) }),
        ],
      }),
    ),
};

/**
 * Avatar im Medienbereich (`ItemMedia` mit Standard-Variante).
 * Die Stories nutzen einen einfachen Platzhalter; im Projekt kann hier die Avatar-Komponente stehen.
 */
export const WithAvatar: Story = {
  render: () =>
    column(
      [
        Item({
          variant: "outline",
          children: [
            ItemMedia({ children: avatar("ER") }),
            ItemContent({
              children: [ItemTitle({ children: "Evil Rabbit" }), ItemDescription({ children: "Last seen 5 months ago" })],
            }),
            ItemActions({
              children: Button({ variant: "outline", size: "sm", children: icon(plusPaths, "size-4") }),
            }),
          ],
        }),
        Item({
          variant: "outline",
          children: [
            ItemMedia({ children: avatar("TM") }),
            ItemContent({
              children: [
                ItemTitle({ children: "No Team Members" }),
                ItemDescription({ children: "Invite your team to collaborate on this project." }),
              ],
            }),
            ItemActions({ children: Button({ variant: "outline", size: "sm", children: "Invite" }) }),
          ],
        }),
      ].join(""),
    ),
};

/** Bild im Medienbereich: `ItemMedia` mit `variant="image"`, hier als Liste von Links */
export const WithImage: Story = {
  render: () =>
    column(
      ItemGroup({
        children: [
          ["Midnight City Lights", "Neon Dreams - Electric Nights", "3:45", images.one],
          ["Coffee Shop Conversations", "The Morning Brew - Urban Stories", "4:05", images.two],
          ["Digital Rain", "Cyber Symphony - Binary Beats", "3:30", images.three],
        ]
          .map(([title, description, duration, src]) =>
            Item({
              variant: "outline",
              href: "#track",
              children: [
                ItemMedia({
                  variant: "image",
                  children: `<img src="${escapeHtml(src ?? "")}" alt="${escapeHtml(title ?? "")}" width="32" height="32" />`,
                }),
                ItemContent({
                  children: [
                    ItemTitle({ children: escapeHtml(title ?? "") }),
                    ItemDescription({ children: escapeHtml(description ?? "") }),
                  ],
                }),
                ItemContent({
                  class: "flex-none text-center",
                  children: ItemDescription({ children: escapeHtml(duration ?? "") }),
                }),
              ],
            }),
          )
          .join(""),
      }),
    ),
};

/** Gruppe mit Trennlinien: `ItemGroup` und `ItemSeparator` */
export const Group: Story = {
  render: () => {
    const people: [string, string, string][] = [
      ["S", "shadcn", "shadcn@vercel.com"],
      ["M", "maxleiter", "maxleiter@vercel.com"],
      ["E", "evilrabbit", "evilrabbit@vercel.com"],
    ];

    const items = people.map(([initial, name, email]) =>
      Item({
        children: [
          ItemMedia({ children: avatar(initial) }),
          ItemContent({
            class: "gap-1",
            children: [ItemTitle({ children: name }), ItemDescription({ children: email })],
          }),
          ItemActions({
            children: Button({ variant: "ghost", size: "sm", children: icon(plusPaths, "size-4") }),
          }),
        ],
      }),
    );

    return column(ItemGroup({ children: items.flatMap((item, index) => (index === 0 ? [item] : [ItemSeparator(), item])) }));
  },
};

/** Kopfbereich über dem Inhalt: `ItemHeader` mit Bild */
export const WithHeader: Story = {
  render: () =>
    column(
      [
        ["v0-1.5-sm", "Everyday tasks and UI generation.", images.one],
        ["v0-1.5-lg", "Advanced thinking or reasoning.", images.two],
        ["v0-2.0-mini", "Open Source model for everyone.", images.three],
      ]
        .map(([title, description, src]) =>
          Item({
            variant: "outline",
            children: [
              ItemHeader({
                children: `<img src="${escapeHtml(src ?? "")}" alt="${escapeHtml(title ?? "")}" width="128" height="128" class="aspect-square w-full rounded-sm object-cover" />`,
              }),
              ItemContent({
                children: [ItemTitle({ children: title }), ItemDescription({ children: description })],
              }),
            ],
          }),
        )
        .join(""),
      "sm:max-w-none",
    ),
};

/** Fussbereich unter dem Inhalt: `ItemFooter` (in den Docs nicht als eigenes Beispiel gezeigt) */
export const WithFooter: Story = {
  render: () =>
    column(
      Item({
        variant: "muted",
        children: [
          ItemContent({
            children: [
              ItemTitle({ children: "Monthly report" }),
              ItemDescription({ children: "Summary of last month's activity." }),
            ],
          }),
          ItemFooter({
            children: [
              `<span class="text-muted-foreground text-xs">Updated 2 days ago</span>`,
              Button({ variant: "outline", size: "sm", children: "Download" }),
            ],
          }),
        ],
      }),
    ),
};

/** Mit `href` wird das Item als Link (`<a>`) gerendert; Hover- und Fokus-Styles gelten für den Anker */
export const AsLink: Story = {
  render: () =>
    column(
      [
        Item({
          href: "#documentation",
          children: [
            ItemContent({
              children: [
                ItemTitle({ children: "Visit our documentation" }),
                ItemDescription({ children: "Learn how to get started with our components." }),
              ],
            }),
            ItemActions({ children: icon(chevronRightPaths, "size-4") }),
          ],
        }),
        Item({
          variant: "outline",
          href: "#external",
          attributes: { target: "_blank", rel: "noopener noreferrer" },
          children: [
            ItemContent({
              children: [
                ItemTitle({ children: "External resource" }),
                ItemDescription({ children: "Opens in a new tab with security attributes." }),
              ],
            }),
            ItemActions({ children: icon(externalLinkPaths, "size-4") }),
          ],
        }),
      ].join(""),
    ),
};

/** Wie das Basic-Item der Docs: Icon-Badge links, Chevron rechts */
export const Verified: Story = {
  render: () =>
    column(
      Item({
        variant: "outline",
        size: "sm",
        href: "#profile",
        children: [
          ItemMedia({ children: icon(badgeCheckPaths, "size-5") }),
          ItemContent({ children: ItemTitle({ children: "Your profile has been verified." }) }),
          ItemActions({ children: icon(chevronRightPaths, "size-4") }),
        ],
      }),
    ),
};
