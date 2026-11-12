import type { Meta, StoryObj } from "@storybook/html-vite";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInput,
    SidebarInset,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
    SidebarSeparator,
    SidebarTrigger,
} from "./Sidebar";
import type { SidebarArgs } from "./Sidebar.types";

type SidebarStoryArgs = Pick<SidebarArgs, "side" | "variant" | "collapsible" | "defaultOpen">;

/** Inneres Markup lucide-artiger Icons (24x24, stroke) */
const iconPaths = {
  home: `<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>`,
  inbox: `<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>`,
  calendar: `<path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path>`,
  search: `<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>`,
  settings: `<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle>`,
  plus: `<path d="M5 12h14"></path><path d="M12 5v14"></path>`,
  more: `<circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle>`,
  chevronUp: `<path d="m18 15-6-6-6 6"></path>`,
  user: `<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>`,
  folder: `<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>`,
};

const icon = (name: keyof typeof iconPaths): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name]}</svg>`;

const navItems: { title: string; icon: keyof typeof iconPaths }[] = [
  { title: "Home", icon: "home" },
  { title: "Inbox", icon: "inbox" },
  { title: "Calendar", icon: "calendar" },
  { title: "Search", icon: "search" },
  { title: "Settings", icon: "settings" },
];

/** Menü mit Links und Tooltips (die Tooltips erscheinen nur bei eingeklappter Sidebar) */
const navMenu = (id: string, activeTitle = "Home"): string =>
  SidebarMenu({
    children: navItems.map((item) =>
      SidebarMenuItem({
        children: SidebarMenuButton({
          href: "#",
          isActive: item.title === activeTitle,
          tooltip: item.title,
          sidebarId: id,
          children: [icon(item.icon), `<span>${item.title}</span>`],
        }),
      })
    ),
  });

/** Hauptbereich mit Trigger und Platzhalterinhalt */
const pageContent = (id: string): string =>
  SidebarInset({
    children: [
      `<header class="flex h-12 shrink-0 items-center gap-2 border-b px-4">${SidebarTrigger({ id })}<span class="text-sm font-medium">Dashboard</span></header>`,
      `<div class="flex flex-1 flex-col gap-4 p-4"><div class="grid grid-cols-3 gap-4"><div class="h-24 rounded-lg bg-muted/50"></div><div class="h-24 rounded-lg bg-muted/50"></div><div class="h-24 rounded-lg bg-muted/50"></div></div><div class="min-h-40 flex-1 rounded-lg bg-muted/50"></div></div>`,
    ],
  });

/** Gesamtlayout einer Story: Provider, Sidebar, Hauptbereich */
const app = (id: string, args: SidebarStoryArgs, sidebarChildren: string | string[]): string =>
  SidebarProvider({
    id,
    defaultOpen: args.defaultOpen,
    children: [
      Sidebar({
        id,
        side: args.side,
        variant: args.variant,
        collapsible: args.collapsible,
        defaultOpen: args.defaultOpen,
        children: sidebarChildren,
      }),
      pageContent(id),
    ],
  });

const meta: Meta<SidebarStoryArgs> = {
  title: "UI-Library/Sidebar",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Zusammensetzbare, einklappbare Sidebar. Port von shadcn/ui (Base). Funktioniert nur mit geladenem Datastar: Zustand (`open`, `openMobile`), Trigger, Rail und Tastenkürzel Strg/Cmd + B laufen über Signale. Ab 768px Breite eine feste Spalte, darunter ein Overlay. Alle Teile verwenden die `id` des `SidebarProvider`. Die Stories laufen in einem eigenen iframe, weil die Sidebar `fixed` positioniert ist.",
      },
      story: { inline: false, iframeHeight: 520 },
    },
  },
  argTypes: {
    side: { control: "inline-radio", options: ["left", "right"] },
    variant: { control: "inline-radio", options: ["sidebar", "floating", "inset"] },
    collapsible: { control: "inline-radio", options: ["offcanvas", "icon", "none"] },
    defaultOpen: { control: "boolean" },
  },
  args: {
    side: "left",
    variant: "sidebar",
    collapsible: "offcanvas",
    defaultOpen: true,
  },
};

export default meta;
type Story = StoryObj<SidebarStoryArgs>;

/** Einfachste Struktur: Header, Content mit einer Gruppe, Footer */
export const Default: Story = {
  render: (args) => {
    const id = "sidebar-default";
    return app(id, args, [
      SidebarHeader({ children: `<div class="px-2 py-1 text-sm font-medium">Acme Inc</div>` }),
      SidebarContent({
        children: SidebarGroup({
          children: [
            SidebarGroupLabel({ children: "Application" }),
            SidebarGroupContent({ children: navMenu(id) }),
          ],
        }),
      }),
      SidebarFooter({ children: `<div class="px-2 py-1 text-xs text-sidebar-foreground/70">v1.0.0</div>` }),
      SidebarRail({ id }),
    ]);
  },
};

/** Mehrere Gruppen mit Suchfeld, Gruppen-Aktion, Menü-Aktion, Badge und Benutzer im Footer */
export const WithGroups: Story = {
  render: (args) => {
    const id = "sidebar-with-groups";
    const projects = ["Design Engineering", "Sales and Marketing", "Travel"];

    return app(id, args, [
      SidebarHeader({
        children: [
          `<div class="px-2 py-1 text-sm font-medium">Acme Inc</div>`,
          SidebarInput({ attributes: { type: "search", placeholder: "Search ...", "aria-label": "Search" } }),
        ],
      }),
      SidebarContent({
        children: [
          SidebarGroup({
            children: [
              SidebarGroupLabel({ children: "Application" }),
              SidebarGroupContent({
                children: SidebarMenu({
                  children: navItems.slice(0, 3).map((item, index) =>
                    SidebarMenuItem({
                      children: [
                        SidebarMenuButton({
                          href: "#",
                          isActive: index === 0,
                          children: [icon(item.icon), `<span>${item.title}</span>`],
                        }),
                        item.title === "Inbox" ? SidebarMenuBadge({ children: "24" }) : "",
                      ],
                    })
                  ),
                }),
              }),
            ],
          }),
          SidebarSeparator(),
          SidebarGroup({
            children: [
              SidebarGroupLabel({ children: "Projects" }),
              SidebarGroupAction({
                attributes: { title: "Add Project" },
                children: [icon("plus"), `<span class="sr-only">Add Project</span>`],
              }),
              SidebarGroupContent({
                children: SidebarMenu({
                  children: projects.map((project) =>
                    SidebarMenuItem({
                      children: [
                        SidebarMenuButton({ href: "#", children: [icon("folder"), `<span>${project}</span>`] }),
                        SidebarMenuAction({
                          showOnHover: true,
                          attributes: { "aria-label": `Actions for ${project}` },
                          children: icon("more"),
                        }),
                      ],
                    })
                  ),
                }),
              }),
            ],
          }),
        ],
      }),
      SidebarFooter({
        children: SidebarMenu({
          children: SidebarMenuItem({
            children: SidebarMenuButton({
              size: "lg",
              children: [icon("user"), `<span>Jane Doe</span>`, `<span class="ml-auto">${icon("chevronUp")}</span>`],
            }),
          }),
        }),
      }),
      SidebarRail({ id }),
    ]);
  },
};

/** Untermenüs mit `SidebarMenuSub`, `SidebarMenuSubItem` und `SidebarMenuSubButton` */
export const WithSubmenu: Story = {
  render: (args) => {
    const id = "sidebar-with-submenu";
    const subItems = [
      { title: "Overview", active: true },
      { title: "Members", active: false },
      { title: "Billing", active: false },
    ];

    return app(id, args, [
      SidebarContent({
        children: SidebarGroup({
          children: [
            SidebarGroupLabel({ children: "Workspace" }),
            SidebarGroupContent({
              children: SidebarMenu({
                children: SidebarMenuItem({
                  children: [
                    SidebarMenuButton({ href: "#", children: [icon("settings"), `<span>Settings</span>`] }),
                    SidebarMenuSub({
                      children: subItems.map((item) =>
                        SidebarMenuSubItem({
                          children: SidebarMenuSubButton({
                            href: "#",
                            isActive: item.active,
                            children: `<span>${item.title}</span>`,
                          }),
                        })
                      ),
                    }),
                  ],
                }),
              }),
            }),
          ],
        }),
      }),
      SidebarRail({ id }),
    ]);
  },
};

/** Auf Icons einklappbar: `collapsible="icon"`, Tooltips zeigen die Namen im eingeklappten Zustand */
export const CollapsibleIcon: Story = {
  args: { collapsible: "icon" },
  render: (args) => {
    const id = "sidebar-collapsible-icon";
    return app(id, args, [
      SidebarContent({
        children: SidebarGroup({
          children: [SidebarGroupLabel({ children: "Application" }), SidebarGroupContent({ children: navMenu(id) })],
        }),
      }),
      SidebarRail({ id }),
    ]);
  },
};

/** Variante `floating` mit Rahmen und Schatten */
export const Floating: Story = {
  args: { variant: "floating", collapsible: "icon" },
  render: (args) => {
    const id = "sidebar-floating";
    return app(id, args, [
      SidebarContent({
        children: SidebarGroup({
          children: [SidebarGroupLabel({ children: "Application" }), SidebarGroupContent({ children: navMenu(id) })],
        }),
      }),
    ]);
  },
};

/** Variante `inset`: der Hauptbereich wird als abgerundete Karte neben die Sidebar gesetzt */
export const Inset: Story = {
  args: { variant: "inset", collapsible: "icon" },
  render: (args) => {
    const id = "sidebar-inset";
    return app(id, args, [
      SidebarContent({
        children: SidebarGroup({
          children: [SidebarGroupLabel({ children: "Application" }), SidebarGroupContent({ children: navMenu(id) })],
        }),
      }),
    ]);
  },
};

/** Sidebar auf der rechten Seite */
export const RightSide: Story = {
  args: { side: "right" },
  render: (args) => {
    const id = "sidebar-right";
    return app(id, args, [
      SidebarContent({
        children: SidebarGroup({
          children: [SidebarGroupLabel({ children: "Application" }), SidebarGroupContent({ children: navMenu(id) })],
        }),
      }),
      SidebarRail({ id }),
    ]);
  },
};

/** Lade-Platzhalter mit `SidebarMenuSkeleton` (mit und ohne Icon) */
export const Loading: Story = {
  render: (args) => {
    const id = "sidebar-loading";
    return app(id, args, [
      SidebarContent({
        children: SidebarGroup({
          children: [
            SidebarGroupLabel({ children: "Projects" }),
            SidebarGroupContent({
              children: SidebarMenu({
                children: [true, true, true, false, false].map((showIcon, index) =>
                  SidebarMenuItem({
                    children: SidebarMenuSkeleton({ showIcon, width: `${[70, 85, 60, 75, 55][index]}%` }),
                  })
                ),
              }),
            }),
          ],
        }),
      }),
    ]);
  },
};

/** `collapsible="none"`: feste Sidebar ohne Ein-/Ausklappen (kein Trigger nötig) */
export const NotCollapsible: Story = {
  args: { collapsible: "none" },
  render: (args) => {
    const id = "sidebar-none";
    return SidebarProvider({
      id,
      children: [
        Sidebar({
          id,
          collapsible: "none",
          class: "border-r",
          children: SidebarContent({
            children: SidebarGroup({
              children: [SidebarGroupLabel({ children: "Application" }), SidebarGroupContent({ children: navMenu(id) })],
            }),
          }),
        }),
        SidebarInset({
          children: `<div class="flex flex-1 flex-col gap-4 p-4"><div class="min-h-40 flex-1 rounded-lg bg-muted/50"></div></div>`,
        }),
      ],
    });
  },
};
