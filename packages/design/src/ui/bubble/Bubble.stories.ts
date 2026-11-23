import type { Meta, StoryObj } from "@storybook/html-vite";

import { renderIcon } from "../../utils/renderIcon";
import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from "./Bubble";
import type { BubbleAlign, BubbleArgs, BubbleReactionsSide, BubbleVariant } from "./Bubble.types";

type BubbleStoryArgs = BubbleArgs & { text?: string };

const variants: BubbleVariant[] = ["default", "secondary", "muted", "tinted", "outline", "ghost", "destructive"];
const aligns: BubbleAlign[] = ["start", "end"];
const sides: BubbleReactionsSide[] = ["top", "bottom"];

const thumbsUpPaths = `<path d="M7 10v12"></path><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"></path>`;
const heartPaths = `<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>`;

const reactionIcons = [
  renderIcon(thumbsUpPaths, { class: "size-3.5", label: "Daumen hoch" }),
  renderIcon(heartPaths, { class: "size-3.5", label: "Herz" }),
].join("");

/** Container für die Stories: schmale Spalte wie in einem Chatfenster */
const column = (inner: string, gap = "gap-6"): string =>
  `<div class="flex w-full max-w-sm flex-col ${gap} py-6">${inner}</div>`;

const meta: Meta<BubbleStoryArgs> = {
  title: "UI-Library/Bubble",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Zeigt gerahmten Unterhaltungsinhalt (Chattext, kurze strukturierte Ausgaben, Zitate, Vorschläge, Reactions). Port von shadcn/ui (Base). Die Bubble besteht aus `BubbleContent` und optional `BubbleReactions`, `BubbleGroup` gruppiert aufeinanderfolgende Bubbles desselben Absenders. Die Komponente braucht kein Datastar. Avatare, Namen und Zeitstempel gehören nicht in die Bubble.",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: variants },
    align: { control: "inline-radio", options: aligns },
    class: { control: "text" },
    text: { control: "text" },
  },
  args: {
    variant: "default",
    align: "start",
    text: "I checked the registry output and removed the stale route.",
  },
  render: ({ text, ...args }) => column(Bubble({ ...args, children: BubbleContent({ children: text }) })),
};

export default meta;
type Story = StoryObj<BubbleStoryArgs>;

export const Playground: Story = {};

/** Die Variante wird über `variant` gewählt; `ghost` hat keine Maximalbreite und eignet sich für Assistententext */
export const Variants: Story = {
  render: () =>
    column(
      variants
        .map((variant) =>
          Bubble({
            variant,
            children: BubbleContent({
              children: `This is the ${variant} variant.`,
            }),
          })
        )
        .join("")
    ),
};

/** `align` gehört an die Bubble: `start` für empfangene, `end` für gesendete Nachrichten */
export const Alignment: Story = {
  render: () =>
    column(
      [
        Bubble({
          variant: "muted",
          align: "start",
          children: BubbleContent({ children: "This bubble is aligned to the start. This is the default alignment." }),
        }),
        Bubble({
          align: "end",
          children: BubbleContent({ children: "This bubble is aligned to the end. Use this for user messages." }),
        }),
      ].join("")
    ),
};

/** Aufeinanderfolgende Bubbles desselben Absenders; `align` steht an jeder Bubble, nicht an der Gruppe */
export const Group: Story = {
  render: () =>
    column(
      [
        BubbleGroup({
          children: [
            Bubble({ variant: "muted", children: BubbleContent({ children: "Hey! Want to see chat bubbles?" }) }),
            Bubble({ variant: "muted", children: BubbleContent({ children: "They group nicely." }) }),
          ],
        }),
        BubbleGroup({
          children: [
            Bubble({ align: "end", children: BubbleContent({ children: "Sure." }) }),
            Bubble({ align: "end", children: BubbleContent({ children: "Hit me with your best demo." }) }),
          ],
        }),
      ].join("")
    ),
};

/** Klickbare Bubble: `as: "button"` rendert einen Button, `href` einen Link. So bleibt sie fokussierbar und hat die richtige Rolle */
export const LinksAndButtons: Story = {
  render: () =>
    column(
      [
        Bubble({
          variant: "muted",
          children: BubbleContent({ as: "button", children: "I forgot my password" }),
        }),
        Bubble({
          variant: "outline",
          children: BubbleContent({ href: "#docs", children: "Open the documentation" }),
        }),
      ].join(""),
      "gap-3"
    ),
};

/** Reactions überlappen die Bubble; `side` (top, bottom) und `align` (start, end) wählen die Kante. Lasse zwischen den Zeilen extra Abstand */
export const Reactions: Story = {
  render: () =>
    column(
      [
        Bubble({
          variant: "muted",
          children: [
            BubbleContent({ children: "Reactions sit on the bottom edge by default." }),
            BubbleReactions({ children: reactionIcons }),
          ],
        }),
        ...sides.flatMap((side) =>
          aligns.map((align) =>
            Bubble({
              variant: "secondary",
              children: [
                BubbleContent({ children: `side: ${side}, align: ${align}` }),
                BubbleReactions({ side, align, children: renderIcon(thumbsUpPaths, { class: "size-3.5", label: "Daumen hoch" }) }),
              ],
            })
          )
        ),
      ].join(""),
      "gap-10"
    ),
};

/** Reactions als Buttons: `has-[button]:p-0` entfernt das Padding, die Buttons bringen ihr eigenes mit */
export const ReactionButtons: Story = {
  render: () =>
    column(
      Bubble({
        variant: "muted",
        children: [
          BubbleContent({ children: "Tap a reaction." }),
          BubbleReactions({
            children: [
              `<button type="button" aria-label="Daumen hoch" class="rounded-full px-1.5 py-0.5 hover:bg-foreground/10">${renderIcon(thumbsUpPaths, { class: "size-3.5" })}</button>`,
              `<button type="button" aria-label="Herz" class="rounded-full px-1.5 py-0.5 hover:bg-foreground/10">${renderIcon(heartPaths, { class: "size-3.5" })}</button>`,
            ],
          }),
        ],
      })
    ),
};

/** Ghost-Bubble mit Rich Content (Code), nutzt die volle Breite */
export const GhostWithCode: Story = {
  render: () =>
    column(
      Bubble({
        variant: "ghost",
        children: BubbleContent({
          children: `<p>Run the command below to add the component.</p><pre class="mt-2 overflow-x-auto rounded-md bg-muted p-2 text-xs"><code>pnpm dlx shadcn@latest add bubble</code></pre>`,
        }),
      })
    ),
};

/** Fehlerzustand: den Fehlerkontext im Text nennen, nicht nur über die Farbe vermitteln */
export const Destructive: Story = {
  render: () =>
    column(
      Bubble({
        variant: "destructive",
        children: BubbleContent({ children: "Message failed to send. Check your connection and try again." }),
      })
    ),
};

/** Zusammenspiel: eine kurze Unterhaltung mit mehreren Varianten */
export const Conversation: Story = {
  render: () =>
    column(
      [
        Bubble({ align: "end", children: BubbleContent({ children: "Hey there! what's up?" }) }),
        BubbleGroup({
          children: [
            Bubble({ variant: "muted", children: BubbleContent({ children: "Hey! Want to see chat bubbles?" }) }),
            Bubble({
              variant: "muted",
              children: [
                BubbleContent({ children: "I can show you reactions, too." }),
                BubbleReactions({ children: reactionIcons }),
              ],
            }),
          ],
        }),
        Bubble({ align: "end", children: BubbleContent({ children: "Sure. Hit me with your best demo." }) }),
        Bubble({ variant: "ghost", children: BubbleContent({ children: "Here it is. Ghost bubbles span the full row." }) }),
      ].join(""),
      "gap-8"
    ),
};
