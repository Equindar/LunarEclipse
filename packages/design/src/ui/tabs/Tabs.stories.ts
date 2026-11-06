import type { Meta, StoryObj } from "@storybook/html-vite";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";
import type { TabsListVariant, TabsOrientation } from "./Tabs.types";

type TabsStoryArgs = {
  /** IDs müssen pro Story eindeutig sein (die Docs-Seite rendert mehrere Stories gleichzeitig) */
  id: string;
  defaultValue?: string;
  orientation?: TabsOrientation;
  variant?: TabsListVariant;
};

const appWindowIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M10 4v4"/><path d="M2 8h20"/><path d="M6 4v4"/></svg>`;
const codeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/></svg>`;

/** Einfacher Inhaltsblock für die Panels (Platzhalter für die Karten der Docs) */
const panel = (title: string, text: string): string =>
  `<div class="flex flex-col gap-2 rounded-lg border bg-card p-4 text-card-foreground"><p class="font-medium">${title}</p><p class="text-muted-foreground">${text}</p></div>`;

const meta: Meta<TabsStoryArgs> = {
  title: "UI-Library/Tabs",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Gruppe von Inhaltsbereichen, von denen jeweils einer sichtbar ist. Funktioniert nur mit geladenem Datastar: Das Signal \"value\" hält den aktiven Tab, Pfeiltasten bewegen den Fokus, Enter oder Leertaste aktivieren. Vor dem Laden von Datastar sind alle Panels ausgeblendet.",
      },
    },
  },
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    variant: { control: "inline-radio", options: ["default", "line"] },
  },
  args: {
    id: "tabs-default",
    defaultValue: "overview",
    orientation: "horizontal",
    variant: "default",
  },
  render: (args) =>
    Tabs({
      id: args.id,
      defaultValue: args.defaultValue,
      orientation: args.orientation,
      class: "w-full max-w-sm",
      children: [
        TabsList({
          variant: args.variant,
          children: [
            TabsTrigger({ tabsId: args.id, value: "overview", children: "Overview" }),
            TabsTrigger({ tabsId: args.id, value: "analytics", children: "Analytics" }),
            TabsTrigger({ tabsId: args.id, value: "reports", children: "Reports" }),
            TabsTrigger({ tabsId: args.id, value: "settings", children: "Settings" }),
          ],
        }),
        TabsContent({
          tabsId: args.id,
          value: "overview",
          children: panel(
            "Overview",
            "View your key metrics and recent project activity. Track progress across all your active projects."
          ),
        }),
        TabsContent({
          tabsId: args.id,
          value: "analytics",
          children: panel("Analytics", "Track performance and user engagement metrics across your projects."),
        }),
        TabsContent({
          tabsId: args.id,
          value: "reports",
          children: panel("Reports", "Generate and download your detailed project reports."),
        }),
        TabsContent({
          tabsId: args.id,
          value: "settings",
          children: panel("Settings", "Configure your project preferences and notifications."),
        }),
      ],
    }),
};

export default meta;
type Story = StoryObj<TabsStoryArgs>;

export const Default: Story = {};

/** Linienstil über variant="line" an TabsList */
export const Line: Story = {
  args: { id: "tabs-line", variant: "line" },
  render: (args) =>
    Tabs({
      id: args.id,
      defaultValue: "overview",
      children: [
        TabsList({
          variant: "line",
          children: [
            TabsTrigger({ tabsId: args.id, value: "overview", children: "Overview" }),
            TabsTrigger({ tabsId: args.id, value: "analytics", children: "Analytics" }),
            TabsTrigger({ tabsId: args.id, value: "reports", children: "Reports" }),
          ],
        }),
        TabsContent({ tabsId: args.id, value: "overview", class: "pt-3", children: "Overview" }),
        TabsContent({ tabsId: args.id, value: "analytics", class: "pt-3", children: "Analytics" }),
        TabsContent({ tabsId: args.id, value: "reports", class: "pt-3", children: "Reports" }),
      ],
    }),
};

/** Senkrechte Ausrichtung über orientation="vertical" an Tabs. Pfeiltasten oben und unten bewegen den Fokus */
export const Vertical: Story = {
  args: { id: "tabs-vertical", orientation: "vertical" },
  render: (args) =>
    Tabs({
      id: args.id,
      defaultValue: "account",
      orientation: "vertical",
      class: "gap-4",
      children: [
        TabsList({
          children: [
            TabsTrigger({ tabsId: args.id, value: "account", children: "Account" }),
            TabsTrigger({ tabsId: args.id, value: "password", children: "Password" }),
            TabsTrigger({ tabsId: args.id, value: "notifications", children: "Notifications" }),
          ],
        }),
        TabsContent({
          tabsId: args.id,
          value: "account",
          children: panel("Account", "Make changes to your account here."),
        }),
        TabsContent({
          tabsId: args.id,
          value: "password",
          children: panel("Password", "Change your password here."),
        }),
        TabsContent({
          tabsId: args.id,
          value: "notifications",
          children: panel("Notifications", "Choose which updates you want to receive."),
        }),
      ],
    }),
};

/** Deaktivierte Tabs sind nicht klickbar und werden bei der Pfeiltasten-Navigation übersprungen */
export const Disabled: Story = {
  args: { id: "tabs-disabled" },
  render: (args) =>
    Tabs({
      id: args.id,
      defaultValue: "home",
      children: [
        TabsList({
          children: [
            TabsTrigger({ tabsId: args.id, value: "home", children: "Home" }),
            TabsTrigger({ tabsId: args.id, value: "disabled", disabled: true, children: "Disabled" }),
          ],
        }),
        TabsContent({ tabsId: args.id, value: "home", class: "pt-3", children: "Home" }),
        TabsContent({ tabsId: args.id, value: "disabled", class: "pt-3", children: "Disabled" }),
      ],
    }),
};

/** Icons im Trigger: SVGs als Kind-Markup, die Größe setzt der Trigger (size-4) */
export const Icons: Story = {
  args: { id: "tabs-icons" },
  render: (args) =>
    Tabs({
      id: args.id,
      defaultValue: "preview",
      children: [
        TabsList({
          children: [
            TabsTrigger({ tabsId: args.id, value: "preview", children: `${appWindowIcon}Preview` }),
            TabsTrigger({ tabsId: args.id, value: "code", children: `${codeIcon}Code` }),
          ],
        }),
        TabsContent({ tabsId: args.id, value: "preview", class: "pt-3", children: "Preview" }),
        TabsContent({ tabsId: args.id, value: "code", class: "pt-3", children: "Code" }),
      ],
    }),
};
