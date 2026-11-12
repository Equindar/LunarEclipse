import type { Meta, StoryObj } from "@storybook/html-vite";

import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "./Breadcrumb";
import type { BreadcrumbArgs } from "./Breadcrumb.types";

/** Lucide "Dot" für den benutzerdefinierten Trenner */
const dotIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12.1" cy="12.1" r="1"></circle></svg>`;

const link = (label: string, href = "#"): string =>
  BreadcrumbItem({ children: BreadcrumbLink({ href, children: label }) });

const page = (label: string): string => BreadcrumbItem({ children: BreadcrumbPage({ children: label }) });

const meta: Meta<BreadcrumbArgs> = {
  title: "UI-Library/Breadcrumb",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Zeigt den Pfad zur aktuellen Seite als Hierarchie von Links. Port von shadcn/ui (Base). Teile: `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`. Ohne Datastar-Logik, funktioniert ohne weitere Abhängigkeiten.",
      },
    },
  },
  argTypes: {
    class: { control: "text" },
  },
  render: (args) =>
    Breadcrumb({
      ...args,
      children: BreadcrumbList({
        children: [link("Home"), BreadcrumbSeparator(), link("Components"), BreadcrumbSeparator(), page("Breadcrumb")],
      }),
    }),
};

export default meta;
type Story = StoryObj<BreadcrumbArgs>;

export const Default: Story = {};

/** Einfacher Breadcrumb mit Home-Link und einem weiteren Link */
export const Basic: Story = {
  render: () =>
    Breadcrumb({
      children: BreadcrumbList({
        children: [link("Home"), BreadcrumbSeparator(), link("Components"), BreadcrumbSeparator(), page("Breadcrumb")],
      }),
    }),
};

/** Eigener Trenner: `children` von `BreadcrumbSeparator` ersetzt das Standard-Icon */
export const CustomSeparator: Story = {
  render: () =>
    Breadcrumb({
      children: BreadcrumbList({
        children: [
          link("Home", "/"),
          BreadcrumbSeparator({ children: dotIcon }),
          link("Components", "/components"),
          BreadcrumbSeparator({ children: dotIcon }),
          page("Breadcrumb"),
        ],
      }),
    }),
};

/** Eingeklappter Zustand: `BreadcrumbEllipsis` steht für ausgelassene Ebenen */
export const Collapsed: Story = {
  render: () =>
    Breadcrumb({
      children: BreadcrumbList({
        children: [
          link("Home", "/"),
          BreadcrumbSeparator(),
          BreadcrumbItem({ children: BreadcrumbEllipsis() }),
          BreadcrumbSeparator(),
          link("Components", "/docs/components"),
          BreadcrumbSeparator(),
          page("Breadcrumb"),
        ],
      }),
    }),
};

/** Eigenes aria-label am Root (`attributes`) und eigener Screenreader-Text der Ellipsis (`label`) */
export const CollapsedWithLabel: Story = {
  render: () =>
    Breadcrumb({
      attributes: { "aria-label": "Brotkrumenpfad" },
      children: BreadcrumbList({
        children: [
          link("Start", "/"),
          BreadcrumbSeparator(),
          BreadcrumbItem({ children: BreadcrumbEllipsis({ label: "Weitere Ebenen" }) }),
          BreadcrumbSeparator(),
          page("Aktuelle Seite"),
        ],
      }),
    }),
};

/**
 * Eigene Link-Komponente: Die Quelle nutzt dafür `render` bzw. `asChild`.
 * Im Port bekommt der Link `href` und beliebige `attributes` (hier ein Router-Attribut).
 */
export const CustomLink: Story = {
  render: () =>
    Breadcrumb({
      children: BreadcrumbList({
        children: [
          BreadcrumbItem({
            children: BreadcrumbLink({ href: "#link", attributes: { "data-router-link": "" }, children: "Home" }),
          }),
          BreadcrumbSeparator(),
          BreadcrumbItem({
            children: BreadcrumbLink({
              href: "#link",
              attributes: { "data-router-link": "" },
              children: "Components",
            }),
          }),
          BreadcrumbSeparator(),
          page("Breadcrumb"),
        ],
      }),
    }),
};

/** RTL: `dir="rtl"` am Container, der Standard-Chevron wird gespiegelt */
export const Rtl: Story = {
  render: () =>
    `<div dir="rtl">${Breadcrumb({
      children: BreadcrumbList({
        children: [link("الرئيسية", "/"), BreadcrumbSeparator(), link("المكونات", "/components"), BreadcrumbSeparator(), page("مسار التنقل")],
      }),
    })}</div>`,
};

/** Lange Pfade brechen um (`flex-wrap`) */
export const LongTrail: Story = {
  render: () =>
    `<div class="w-64">${Breadcrumb({
      children: BreadcrumbList({
        children: [
          link("Home"),
          BreadcrumbSeparator(),
          link("Dokumentation"),
          BreadcrumbSeparator(),
          link("Komponenten"),
          BreadcrumbSeparator(),
          link("Navigation"),
          BreadcrumbSeparator(),
          page("Breadcrumb"),
        ],
      }),
    })}</div>`,
};
