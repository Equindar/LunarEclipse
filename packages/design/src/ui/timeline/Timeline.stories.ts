import type { Meta, StoryObj } from "@storybook/html-vite";

import { escapeHtml } from "../../utils/escapeHtml";
import { renderIcon } from "../../utils/renderIcon";
import {
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDescription,
    TimelineDot,
    TimelineHeader,
    TimelineTime,
    TimelineTitle,
} from "./Timeline";
import type { TimelineArgs, TimelineItemContext, TimelineStatus } from "./Timeline.types";

type TimelineStoryArgs = Omit<TimelineArgs, "items" | "attributes">;
type TimelineItemInput = NonNullable<TimelineArgs["items"]>[number];

interface TimelineEvent {
  dateTime: string;
  date: string;
  title: string;
  description: string;
}

/** Beispieldaten (entsprechen der Vorschau der Docs-Seite) */
const events: TimelineEvent[] = [
  { dateTime: "2025-01-15", date: "January 15, 2025", title: "Project Kickoff", description: "Initial meeting to define scope." },
  { dateTime: "2025-02-01", date: "February 1, 2025", title: "Design Phase", description: "Created wireframes and mockups." },
  { dateTime: "2025-03-01", date: "March 1, 2025", title: "Development", description: "Building core features." },
];

/** Beispieldaten für das RTL-Layout */
const eventsRtl: TimelineEvent[] = [
  { dateTime: "2025-01-15", date: "١٥ يناير ٢٠٢٥", title: "بدء المشروع", description: "اجتماع أولي لتحديد النطاق." },
  { dateTime: "2025-02-01", date: "١ فبراير ٢٠٢٥", title: "مرحلة التصميم", description: "إنشاء الهياكل والنماذج الأولية." },
  { dateTime: "2025-03-01", date: "١ مارس ٢٠٢٥", title: "التطوير", description: "بناء الميزات الأساسية." },
];

/** Optionale Anpassung des Dots je Item (Klassen und Inhalt) */
type DotRenderer = (context: TimelineItemContext) => { class?: string; children?: string };

/** Items aus Daten bauen: Dot, Connector und Content mit Header und Description */
const buildItems = (data: TimelineEvent[], renderDot?: DotRenderer): TimelineItemInput[] =>
  data.map((event) => ({
    children: (context) => [
      TimelineDot({ context, ...renderDot?.(context) }),
      TimelineConnector({ context }),
      TimelineContent({
        context,
        children: [
          TimelineHeader({
            children: [
              TimelineTime({ dateTime: event.dateTime, children: escapeHtml(event.date) }),
              TimelineTitle({ children: escapeHtml(event.title) }),
            ],
          }),
          TimelineDescription({ children: escapeHtml(event.description) }),
        ],
      }),
    ],
  }));

/** Rahmen mit Abstand und Breite, damit die Varianten (insbesondere "alternate") sichtbar sind */
const frame = (inner: string, widthClass = "max-w-md"): string => `<div class="w-full ${widthClass} p-4">${inner}</div>`;

/** Lucide-Icons (Innenleben, 24x24) für die Story mit eigenen Dots */
const checkBody = `<path d="M20 6 9 17l-5-5"></path>`;
const circleDotBody = `<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="1"></circle>`;
const clockBody = `<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>`;

const customDotClassTw: Record<TimelineStatus, string> = {
  completed: "border-primary bg-primary text-primary-foreground",
  active: "border-primary text-primary",
  pending: "text-muted-foreground",
};

const customDotBody: Record<TimelineStatus, string> = {
  completed: checkBody,
  active: circleDotBody,
  pending: clockBody,
};

const customDot: DotRenderer = (context) => ({
  class: customDotClassTw[context.status],
  children: renderIcon(customDotBody[context.status], { class: "size-3.5" }),
});

const meta: Meta<TimelineStoryArgs> = {
  title: "UI-Library/Timeline",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Zeigt chronologische Ereignisse als Zeitleiste, vertikal oder horizontal, mit abwechselnden Seiten (`variant: \"alternate\"`), RTL-Layout und Status je Item (`activeIndex`). Port von Dice UI (Base), das auf shadcn/ui basiert. Statisches Markup, benötigt kein Datastar. Das Root berechnet den Kontext jedes Items; `TimelineDot`, `TimelineConnector` und `TimelineContent` erhalten ihn über das Argument `context`.",
      },
    },
  },
  argTypes: {
    orientation: { control: "select", options: ["vertical", "horizontal"] },
    variant: { control: "select", options: ["default", "alternate"] },
    dir: { control: "select", options: ["ltr", "rtl"] },
    activeIndex: { control: "number" },
    class: { control: "text" },
  },
  args: {
    orientation: "vertical",
    variant: "default",
    activeIndex: 1,
  },
  render: (args) => frame(Timeline({ ...args, items: buildItems(events) }), "max-w-2xl"),
};

export default meta;
type Story = StoryObj<TimelineStoryArgs>;

export const Playground: Story = {};

/** Horizontale Zeitleiste über die Breite */
export const Horizontal: Story = {
  args: { orientation: "horizontal" },
  render: (args) => frame(Timeline({ ...args, items: buildItems(events) }), "max-w-3xl"),
};

/** Rechts-nach-links-Layout über `dir: "rtl"` */
export const Rtl: Story = {
  args: { dir: "rtl" },
  render: (args) => frame(Timeline({ ...args, items: buildItems(eventsRtl) })),
};

/** Inhalt wechselt abwechselnd die Seite der Mittellinie */
export const Alternate: Story = {
  args: { variant: "alternate" },
  render: (args) => frame(Timeline({ ...args, items: buildItems(events) }), "max-w-2xl"),
};

/** Alternate im RTL-Layout. Die Vorlage nutzt hier physische Klassen (pr-, -right-), der Port logische. */
export const AlternateRtl: Story = {
  args: { variant: "alternate", dir: "rtl" },
  render: (args) => frame(Timeline({ ...args, items: buildItems(eventsRtl) }), "max-w-2xl"),
};

/** Horizontal, Inhalt wechselt abwechselnd oberhalb und unterhalb der Linie */
export const HorizontalAlternate: Story = {
  args: { variant: "alternate", orientation: "horizontal" },
  render: (args) => frame(Timeline({ ...args, items: buildItems(events) }), "max-w-3xl"),
};

/** Eigene Icons in den Dots; die Größe kommt über die CSS-Variable `--timeline-dot-size` am Root */
export const CustomDots: Story = {
  args: { class: "[--timeline-dot-size:1.75rem]" },
  render: (args) => frame(Timeline({ ...args, items: buildItems(events, customDot) })),
};

/** `activeIndex` steuert den Status: davor "completed", danach "pending". Ohne Angabe sind alle "pending". */
export const ActiveIndex: Story = {
  render: () => {
    const variants: { label: string; activeIndex?: number }[] = [
      { label: "Ohne activeIndex" },
      { label: "activeIndex 0", activeIndex: 0 },
      { label: "activeIndex 1", activeIndex: 1 },
      { label: "activeIndex 3 (alle abgeschlossen)", activeIndex: 3 },
    ];

    return `<div class="grid w-full max-w-4xl grid-cols-1 gap-8 p-4 sm:grid-cols-2">${variants
      .map(
        ({ label, activeIndex }) =>
          `<div class="flex flex-col gap-4"><p class="text-sm font-medium">${label}</p>${Timeline({ activeIndex, items: buildItems(events) })}</div>`
      )
      .join("")}</div>`;
  },
};
