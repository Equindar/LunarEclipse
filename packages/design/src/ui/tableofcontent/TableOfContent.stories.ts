import type { Meta, StoryObj } from "@storybook/html-vite";
import { TableOfContent, TableOfContentIndicator, TableOfContentItem, TableOfContentLink, TableOfContentList, TableOfContentTitle } from ".";
import type { TableOfContentArgs, TableOfContentLinkDepth } from "./TableOfContent.types";


type TableOfContentStoryArgs = Pick<
  TableOfContentArgs,
  "id" | "class" | "label" | "scrollContainer" | "rootMargin" | "threshold" | "endOffset"
> & {
  title?: string;
};

interface Section {
  id: string;
  title: string;
  depth?: TableOfContentLinkDepth;
}

const PARAGRAPH =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

/** Dokument mit einer Überschrift je Abschnitt (Stufe 1 = h2, Stufe 2 = h3, ...). IDs pro Story eindeutig halten. */
const article = (sections: Section[], sectionClass: string): string =>
  sections
    .map((section) => {
      const tag = `h${(section.depth ?? 1) + 1}`;
      return `<section class="${sectionClass}"><${tag} id="${section.id}" class="scroll-mt-8 text-lg font-semibold">${section.title}</${tag}><p class="mt-2 text-muted-foreground">${PARAGRAPH}</p></section>`;
    })
    .join("");

/** Inhaltsverzeichnis mit Title, List, Indicator und einem Link je Abschnitt */
const toc = (sections: Section[], args: TableOfContentStoryArgs & { id: string }): string => {
  const { title, ...rootArgs } = args;

  return TableOfContent({
    ...rootArgs,
    targetIds: sections.map((section) => section.id),
    children: [
      TableOfContentTitle({ children: title ?? "On this page" }),
      TableOfContentList({
        children: [
          TableOfContentIndicator({ tocId: args.id }),
          ...sections.map((section) =>
            TableOfContentItem({
              children: TableOfContentLink({
                tocId: args.id,
                targetId: section.id,
                depth: section.depth,
                children: section.title,
              }),
            })
          ),
        ],
      }),
    ],
  });
};

const withPrefix = (prefix: string, sections: Omit<Section, "id">[]): Section[] =>
  sections.map((section, index) => ({ ...section, id: `${prefix}-${index + 1}` }));

const meta: Meta<TableOfContentStoryArgs> = {
  title: "UI-Library/TableOfContent",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Inhaltsverzeichnis mit Scroll-Spy: Der Eintrag der Überschrift, die gerade im Sichtbereich liegt, wird hervorgehoben, ein Balken (Indicator) folgt dem aktiven Bereich. Funktioniert nur mit geladenem Datastar. Ohne Datastar bleiben die Links normale Anker.",
      },
    },
  },
  argTypes: {
    id: { control: "text" },
    class: { control: "text" },
    label: { control: "text" },
    title: { control: "text" },
    scrollContainer: { control: "text", description: "CSS-Selektor des Scroll-Containers (leer: Seite)" },
    rootMargin: { control: "text", description: "Band, in dem eine Überschrift als aktiv gilt" },
    threshold: { control: "number" },
    endOffset: { control: "number", description: "Abstand zum Ende in Pixeln, ab dem der letzte Eintrag aktiv ist" },
  },
  args: {
    id: "toc-playground",
    label: "Table of contents",
    title: "On this page",
    rootMargin: "-20px 0px -40% 0px",
    threshold: 0,
    endOffset: 48,
  },
  render: (args) => {
    const sections = withPrefix(args.id ?? "toc-playground", [
      { title: "Introduction" },
      { title: "Installation" },
      { title: "Usage" },
      { title: "API reference" },
      { title: "Accessibility" },
    ]);

    return `<div class="mx-auto grid max-w-4xl grid-cols-[minmax(0,1fr)_14rem] gap-10 p-8"><article>${article(sections, "min-h-[70vh] py-4")}</article><aside><div class="sticky top-8">${toc(sections, { ...args, id: args.id ?? "toc-playground" })}</div></aside></div>`;
  },
};

export default meta;
type Story = StoryObj<TableOfContentStoryArgs>;

export const Playground: Story = {
  parameters: { docs: { story: { inline: false, iframeHeight: 520 } } },
};

/** Verschachtelte Einträge: Einrückung über `depth` am TableOfContentLink */
export const Nested: Story = {
  args: { id: "toc-nested" },
  parameters: { docs: { story: { inline: false, iframeHeight: 520 } } },
  render: (args) => {
    const id = args.id ?? "toc-nested";
    const sections = withPrefix(id, [
      { title: "Getting started" },
      { title: "Requirements", depth: 2 },
      { title: "Setup", depth: 2 },
      { title: "Components" },
      { title: "TableOfContent", depth: 2 },
      { title: "Parts", depth: 3 },
      { title: "Changelog" },
    ]);

    return `<div class="mx-auto grid max-w-4xl grid-cols-[minmax(0,1fr)_14rem] gap-10 p-8"><article>${article(sections, "min-h-[60vh] py-4")}</article><aside><div class="sticky top-8">${toc(sections, { ...args, id })}</div></aside></div>`;
  },
};

/** Scroll-Spy in einem eigenen Scroll-Container (`scrollContainer` als CSS-Selektor) */
export const ScrollContainer: Story = {
  args: { id: "toc-container", scrollContainer: "#toc-container-box" },
  render: (args) => {
    const id = args.id ?? "toc-container";
    const sections = withPrefix(id, [
      { title: "Overview" },
      { title: "Details" },
      { title: "Examples" },
      { title: "Summary" },
    ]);

    return `<div class="flex gap-8 p-8"><div id="toc-container-box" class="relative h-72 flex-1 overflow-y-auto rounded-md border p-4">${article(sections, "min-h-64 py-2")}</div><div class="w-56 shrink-0">${toc(sections, { ...args, id })}</div></div>`;
  },
};
