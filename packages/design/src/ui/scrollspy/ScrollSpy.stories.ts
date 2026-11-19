import type { Meta, StoryObj } from "@storybook/html-vite";

import { escapeHtml } from "../../utils/escapeHtml";
import {
    ScrollSpy,
    ScrollSpyLink,
    ScrollSpyNav,
    ScrollSpySection,
    ScrollSpyViewport,
    scrollSpySetValue,
} from "./ScrollSpy";
import { scrollSpySignals } from "./ScrollSpy.expressions";
import type { ScrollSpyArgs, ScrollSpyOrientation } from "./ScrollSpy.types";

type ScrollSpyStoryArgs = Omit<ScrollSpyArgs, "children" | "attributes">;

interface Section {
  value: string;
  title: string;
}

const PARAGRAPH =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

/** Abschnitte mit pro Story eindeutigen Werten (die Docs-Seite rendert mehrere Stories gleichzeitig) */
const sectionsFor = (prefix: string): Section[] =>
(
  [
    ["introduction", "Introduction"],
    ["getting-started", "Getting Started"],
    ["usage", "Usage"],
    ["api-reference", "API Reference"],
  ] as const
).map(([value, title]) => ({
  value: `${prefix}-${value}`,
  title
}));

const links = (id: string, sections: Section[], orientation: ScrollSpyOrientation): string[] =>
  sections.map((section) => ScrollSpyLink({ scrollSpyId: id, value: section.value, orientation, children: section.title }));

const content = (sections: Section[], orientation: ScrollSpyOrientation, sectionClass: string): string[] =>
  sections.map((section) =>
    ScrollSpySection({
      value: section.value,
      orientation,
      class: sectionClass,
      children: `<h2 class="text-lg font-semibold">${section.title}</h2><p class="mt-2 text-muted-foreground">${PARAGRAPH}</p>`,
    })
  );

const meta: Meta<ScrollSpyStoryArgs> = {
  title: "UI-Library/ScrollSpy",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Hebt in einer Navigation den Link des Abschnitts hervor, der gerade im Sichtbereich liegt, und scrollt beim Klick zum Abschnitt. Funktioniert nur mit geladenem Datastar. Ohne Datastar bleiben die Links normale Anker.",
      },
    },
  },
  argTypes: {
    id: { control: "text" },
    class: { control: "text" },
    defaultValue: { control: "text" },
    onValueChange: { control: "text", description: "Datastar-Expression, `value` enthält den neuen Wert" },
    rootMargin: { control: "text" },
    threshold: { control: "number" },
    offset: { control: "number" },
    scrollBehavior: { control: "select", options: ["auto", "instant", "smooth"] },
    scrollContainer: { control: "text", description: "CSS-Selektor des Scroll-Containers (leer: Seite)" },
    dir: { control: "select", options: ["ltr", "rtl"] },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
  args: {
    id: "scroll-spy-playground",
    orientation: "horizontal",
    offset: 0,
    threshold: 0.1,
    scrollBehavior: "smooth",
    scrollContainer: "#scroll-spy-playground-viewport",
  },
  render: (args) => {
    const id = args.id ?? "scroll-spy-playground";
    const orientation = args.orientation ?? "horizontal";
    const sections = sectionsFor(id);

    return `<div class="p-8">${ScrollSpy({
      ...args,
      id,
      children: [
        ScrollSpyNav({ orientation, class: "w-48 shrink-0", children: links(id, sections, orientation) }),
        ScrollSpyViewport({
          orientation,
          class: "h-72 overflow-y-auto pr-4",
          attributes: { id: `${id}-viewport` },
          children: content(sections, orientation, "min-h-64"),
        }),
      ],
    })}</div>`;
  },
};

export default meta;
type Story = StoryObj<ScrollSpyStoryArgs>;

export const Playground: Story = {};

/** Vertikale Ausrichtung: Navigation über dem Inhalt (`orientation: "vertical"`) */
export const Vertical: Story = {
  args: {
    id: "scroll-spy-vertical",
    orientation: "vertical",
    scrollContainer: "#scroll-spy-vertical-viewport",
  },
  render: (args) => {
    const id = args.id ?? "scroll-spy-vertical";
    const orientation = args.orientation ?? "vertical";
    const sections = sectionsFor(id);

    return `<div class="p-8">${ScrollSpy({
      ...args,
      id,
      class: "gap-4",
      children: [
        ScrollSpyNav({ orientation, class: "flex-wrap", children: links(id, sections, orientation) }),
        ScrollSpyViewport({
          orientation,
          class: "h-64 overflow-y-auto pr-4",
          attributes: { id: `${id}-viewport` },
          children: content(sections, orientation, "min-h-56"),
        }),
      ],
    })}</div>`;
  },
};

/**
 * Von außen gesteuert: Die Buttons setzen das Signal (`scrollSpySetValue`), der ScrollSpy scrollt zum Abschnitt.
 * `onValueChange` meldet jede Änderung des aktiven Abschnitts, egal ob durch Scrollen, Link oder Button.
 */
export const Controlled: Story = {
  args: {
    id: "scroll-spy-controlled",
    defaultValue: "scroll-spy-controlled-usage",
    scrollContainer: "#scroll-spy-controlled-viewport",
    onValueChange: 'document.getElementById("scroll-spy-controlled-reported").textContent = value',
  },
  render: (args) => {
    const id = args.id ?? "scroll-spy-controlled";
    const orientation = args.orientation ?? "horizontal";
    const sections = sectionsFor(id);
    const signals = scrollSpySignals(id);

    const buttons = sections
      .map(
        (section) =>
          `<button type="button" class="rounded-md border px-3 py-1 text-sm hover:bg-muted" data-on:click="${escapeHtml(scrollSpySetValue(id, section.value))}">${section.title}</button>`
      )
      .join("");

    const status = `<p class="text-sm text-muted-foreground">Aktiv: <code data-text="${escapeHtml(signals.signal("value"))}"></code>, zuletzt gemeldet: <code id="${id}-reported"></code></p>`;

    return `<div class="flex flex-col gap-4 p-8"><div class="flex flex-wrap gap-2">${buttons}</div>${status}${ScrollSpy({
      ...args,
      id,
      children: [
        ScrollSpyNav({ orientation, class: "w-48 shrink-0", children: links(id, sections, orientation) }),
        ScrollSpyViewport({
          orientation,
          class: "h-72 overflow-y-auto pr-4",
          attributes: { id: `${id}-viewport` },
          children: content(sections, orientation, "min-h-64"),
        }),
      ],
    })}</div>`;
  },
};

/**
 * Seite als Scroller (ohne `scrollContainer`): Die Navigation klebt mit `sticky` am oberen Rand,
 * `offset` hält den Abstand zum festen Kopfbereich.
 */
export const StickyLayout: Story = {
  args: {
    id: "scroll-spy-sticky",
    offset: 100,
    scrollContainer: undefined,
  },
  parameters: { docs: { story: { inline: false, iframeHeight: 520 } } },
  render: (args) => {
    const id = args.id ?? "scroll-spy-sticky";
    const orientation = args.orientation ?? "horizontal";
    const sections = sectionsFor(id);

    return `<div class="mx-auto max-w-4xl p-8">${ScrollSpy({
      ...args,
      id,
      class: "gap-10",
      children: [
        ScrollSpyNav({ orientation, class: "sticky top-20 h-fit w-48 shrink-0", children: links(id, sections, orientation) }),
        ScrollSpyViewport({ orientation, children: content(sections, orientation, "min-h-[70vh]") }),
      ],
    })}</div>`;
  },
};
