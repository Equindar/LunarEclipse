import type { Meta, StoryObj } from "@storybook/html-vite";

import { Button } from "../button";
import {
    MessageScroller,
    MessageScrollerButton,
    MessageScrollerContent,
    MessageScrollerItem,
    MessageScrollerProvider,
    MessageScrollerViewport,
    messageScrollerCommands,
} from "./MessageScroller";
import type { MessageScrollerProviderArgs } from "./MessageScroller.types";

type Role = "user" | "assistant";

type MessageScrollerStoryArgs = MessageScrollerProviderArgs & {
  /** Rolle, deren Zeilen als Anker dienen */
  anchorRole?: Role;
  preserveScrollOnPrepend?: boolean;
};

const userTexts = [
  "Wir sehen einen Rückgang bei der Aktivierung nach dem Anlegen eines Workspaces. Kannst du helfen?",
  "Was sollten wir vergleichen, bevor wir den Onboarding-Ablauf ändern?",
  "Mach daraus ein Experiment.",
  "Welches Risiko entsteht, wenn wir die Einladung verzögern?",
  "Fasse die nächsten Schritte kurz zusammen.",
];

const assistantTexts = [
  "Der stärkste Rückgang liegt zwischen dem Anlegen des Workspaces und der ersten Einladung. Das Anlegen selbst läuft gut, danach zögern viele Nutzer.",
  "Vergleiche drei Gruppen: Nutzer mit Vorlage, Nutzer mit leerem Workspace und Nutzer, die Einladungen überspringen und innerhalb von 24 Stunden zurückkommen.",
  "Zeige nach dem Anlegen eine kurze Checkliste: Vorlage wählen, ein Projektdetail ergänzen, erst dann Teammitglieder einladen. Gemessen werden Einladungsquote, Rückkehr nach 24 Stunden und ein zweites Projekt.",
  "Das Hauptrisiko ist, dass Teams, die schon wissen, wen sie einladen wollen, weniger Workspaces anlegen. Halte die Einladung deshalb im Header sichtbar und ändere nur die Hinweise im leeren Zustand.",
  "Prüfe zuerst die Abbruchrate je Kontogrösse, dann den Text des leeren Zustands, danach die Vorlagen. Erst wenn das Muster bleibt, lohnt sich ein grösserer Eingriff.",
];


const sampleText = (index: number, role: Role): string => {
  if (role === "user" && userTexts[index] === undefined)
    throw new Error("userTexts ist leer.");
  if (role === "assistant" && assistantTexts[index] === undefined)
    throw new Error("assistantTexts ist leer.");
  return role === "user"? userTexts[Math.floor(index / 2) % userTexts.length]! : assistantTexts[Math.floor(index / 2) % assistantTexts.length]!;
}

/** Nachrichtenzeile mit schlichtem Markup (Message und Bubble werden bewusst nicht vorausgesetzt) */
const messageRow = (id: string, role: Role, text: string, anchorRole: Role | undefined = "user"): string =>
  MessageScrollerItem({
    messageId: id,
    scrollAnchor: role === anchorRole,
    children:
      role === "user"
        ? `<div class="flex justify-end"><p class="max-w-[80%] rounded-2xl bg-muted px-4 py-2 text-sm">${text}</p></div>`
        : `<p data-stream class="max-w-[85%] text-sm leading-relaxed">${text}</p>`,
  });

/** Vorbefülltes Transcript: abwechselnd Nutzer und Assistent */
const transcript = (prefix: string, count: number, anchorRole: Role = "user"): string[] =>
  Array.from({ length: count }, (_, i) => {
    const role: Role = i % 2 === 0 ? "user" : "assistant";
    return messageRow(`${prefix}-${i + 1}`, role, sampleText(i, role), anchorRole);
  });

/** Rahmen mit fester Höhe: der Scroller füllt sein Elternelement */
const frame = (inner: string, extraClass = ""): string =>
  `<div class="flex h-96 w-full max-w-xl flex-col overflow-hidden rounded-xl border bg-background ${extraClass}">${inner}</div>`;

interface ChatOptions {
  id: string;
  items: string[];
  provider?: MessageScrollerProviderArgs;
  preserveScrollOnPrepend?: boolean;
  pendingScroll?: boolean;
  /** Wird innerhalb des Rahmens nach dem Viewport gerendert (Buttons, Statuszeile) */
  overlay?: string;
}

/** Scroller mit Standard-Zusammensetzung aus Provider, Rahmen, Viewport, Content und End-Button */
const chat = (options: ChatOptions): string =>
  MessageScrollerProvider({
    ...options.provider,
    id: options.id,
    children: MessageScroller({
      children: [
        MessageScrollerViewport({
          pendingScroll: options.pendingScroll,
          preserveScrollOnPrepend: options.preserveScrollOnPrepend,
          children: MessageScrollerContent({ class: "gap-6 p-4", children: options.items }),
        }),
        options.overlay ?? MessageScrollerButton(),
      ],
    }),
  });

/* Browser-seitige Hilfen für die Demo-Buttons (Datastar-Expressions) */

const rowTemplate = (role: Role, anchorRole: Role): string => messageRow("__ID__", role, "__TEXT__", anchorRole);

/** Findet den Content des Scrollers und definiert add(vorlage, id, text, amAnfang) */
const domHelpers = (scrollerId: string): string =>
  `const c = document.querySelector(${JSON.stringify(`#${scrollerId} [data-slot="message-scroller-content"]`)}); ` +
  `const add = (tpl, id, text, atStart) => { const t = document.createElement('template'); t.innerHTML = tpl.replace('__ID__', id).replace('__TEXT__', text); atStart ? c.prepend(t.content) : c.append(t.content); };`;

/** Nutzer-Nachricht senden, kurz danach antwortet der Assistent */
const sendExpression = (scrollerId: string, anchorRole: Role): string =>
  `(() => { ${domHelpers(scrollerId)} const n = (el.__n = (el.__n || 0) + 1); ` +
  `add(${JSON.stringify(rowTemplate("user", anchorRole))}, 'user-new-' + n, 'Neue Nachricht ' + n, false); ` +
  `setTimeout(() => add(${JSON.stringify(rowTemplate("assistant", anchorRole))}, 'assistant-new-' + n, 'Antwort ' + n + ': Das ist eine kurze Antwort, die unter der verankerten Nachricht erscheint.', false), 400); })()`;

const streamText =
  "Streaming ändert das Modell: Nachrichten kommen in Stücken an, während du noch liest, scrollst oder woanders hinschaust. Der Scroller folgt dem Ende nur, solange du dort bist. Scrollst du weg, bleibt die Position stehen, und ein Button bringt dich zurück zur neuesten Antwort. Beim nächsten Senden rückt die Nachricht wieder nach oben, und die Antwort wächst darunter in den freien Platz.";

/** Nutzer-Nachricht senden und die Antwort Wort für Wort streamen */
const streamExpression = (scrollerId: string): string =>
  `(() => { ${domHelpers(scrollerId)} const n = (el.__n = (el.__n || 0) + 1); ` +
  `add(${JSON.stringify(rowTemplate("user", "user"))}, 'user-stream-' + n, 'Erkläre mir das Scrollverhalten beim Streamen (' + n + ').', false); ` +
  `const id = 'assistant-stream-' + n; add(${JSON.stringify(rowTemplate("assistant", "user"))}, id, '', false); ` +
  `const p = c.querySelector('[data-message-id=' + JSON.stringify(id) + '] [data-stream]'); ` +
  `const words = ${JSON.stringify(streamText)}.split(' '); let i = 0; ` +
  `const timer = setInterval(() => { p.textContent += (i ? ' ' : '') + words[i++]; if (i >= words.length) clearInterval(timer); }, 40); })()`;

/** Vier frühere Nachrichten oben einfügen (ältere Zeilen entstehen in umgekehrter Reihenfolge) */
const loadEarlierExpression = (scrollerId: string): string =>
  `(() => { ${domHelpers(scrollerId)} const k = (el.__k = (el.__k || 0) + 1); ` +
  `for (let i = 4; i >= 1; i--) { const role = i % 2 === 1 ? 'user' : 'assistant'; ` +
  `add(role === 'user' ? ${JSON.stringify(rowTemplate("user", "user"))} : ${JSON.stringify(rowTemplate("assistant", "user"))}, 'history-' + k + '-' + i, 'Frühere Nachricht ' + k + '.' + i + ' (oben eingefügt)', true); } })()`;

const toolbar = (...buttons: string[]): string => `<div class="flex w-full max-w-xl flex-wrap items-center gap-2 pt-3">${buttons.join("")}</div>`;

const actionButton = (label: string, expression: string): string =>
  Button({ variant: "outline", children: label, attributes: { "data-on:click": expression } });

const meta: Meta<MessageScrollerStoryArgs> = {
  title: "UI-Library/MessageScroller",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Scroll-Container für Chat-Transkripte: verankert neue Turns nahe am oberen Rand, folgt gestreamten Antworten am Live-Edge, öffnet gespeicherte Threads an der letzten Anker-Zeile, hält beim Laden älterer Nachrichten die Position und springt zu beliebigen Nachrichten. Port von shadcn/ui (Base). Das Verhalten (Anker, Follow-Output, Prepend-Erhalt, Sprünge) übernimmt ein kleiner Controller und funktioniert nur mit geladenem Datastar (`data-init` am Provider). Die Demo-Buttons nutzen ebenfalls Datastar.",
      },
    },
  },
  argTypes: {
    autoScroll: { control: "boolean" },
    defaultScrollPosition: { control: "select", options: ["start", "end", "last-anchor"] },
    scrollEdgeThreshold: { control: "number" },
    scrollMargin: { control: "number" },
    scrollPreviousItemPeek: { control: "number" },
    preserveScrollOnPrepend: { control: "boolean" },
    anchorRole: { control: "inline-radio", options: ["user", "assistant"] },
  },
  args: {
    id: "message-scroller-playground",
    autoScroll: false,
    defaultScrollPosition: "last-anchor",
    scrollEdgeThreshold: 8,
    scrollMargin: 0,
    scrollPreviousItemPeek: 64,
    preserveScrollOnPrepend: true,
    anchorRole: "user",
  },
  render: ({ anchorRole = "user", preserveScrollOnPrepend, ...provider }) => {
    const id = provider.id ?? "message-scroller-playground";

    return (
      frame(chat({ id, provider, preserveScrollOnPrepend, items: transcript("playground", 8, anchorRole) })) +
      toolbar(actionButton("Nachricht senden", sendExpression(id, anchorRole)))
    );
  },
};

export default meta;
type Story = StoryObj<MessageScrollerStoryArgs>;

/** Alle Controls des Providers. Sendet man eine Nachricht, rückt der Anker nahe an den oberen Rand und die Antwort erscheint darunter. */
export const Playground: Story = {};

/** Mit `scrollAnchor` am Nutzer-Turn bleibt ein Stück der vorherigen Antwort sichtbar (`scrollPreviousItemPeek`). Hier mit grösserem Peek. */
export const KeepingContextVisible: Story = {
  args: { id: "message-scroller-peek", scrollPreviousItemPeek: 120 },
};

/** `autoScroll` folgt der gestreamten Antwort, solange der Leser am Ende ist. Wegscrollen löst das Verfolgen, der Button bringt zurück. */
export const StreamingWithAutoScroll: Story = {
  args: { id: "message-scroller-stream", autoScroll: true, defaultScrollPosition: "end" },
  render: ({ anchorRole = "user", ...provider }) => {
    const id = provider.id ?? "message-scroller-stream";

    return (
      frame(chat({ id, provider, items: transcript("stream", 4, anchorRole) })) +
      toolbar(actionButton("Antwort streamen", streamExpression(id)))
    );
  },
};

/** Drei gespeicherte Threads mit derselben Länge, aber unterschiedlicher `defaultScrollPosition`. "last-anchor" zeigt die letzte Nutzer-Nachricht mit der Antwort darunter. */
export const OpeningPosition: Story = {
  render: () => {
    const positions = ["start", "end", "last-anchor"] as const;

    const columns = positions
      .map(
        (position) =>
          `<div class="flex min-w-0 flex-1 flex-col gap-2"><p class="font-mono text-xs text-muted-foreground">${position}</p>${frame(
            chat({
              id: `message-scroller-open-${position}`,
              provider: { defaultScrollPosition: position },
              pendingScroll: position !== "start",
              items: transcript(`open-${position}`, 10),
            }),
            "h-80"
          )}</div>`
      )
      .join("");

    return `<div class="flex w-full gap-4">${columns}</div>`;
  },
};

/** Ältere Zeilen oben einzufügen verschiebt die sichtbare Nachricht nicht (`preserveScrollOnPrepend`, Standard an). Zeilen brauchen stabile `messageId`s. */
export const LoadingEarlierMessages: Story = {
  render: () => {
    const id = "message-scroller-history";

    return (
      frame(chat({ id, provider: { defaultScrollPosition: "end" }, items: transcript("history-base", 6) })) +
      toolbar(actionButton("Frühere Nachrichten laden", loadEarlierExpression(id)))
    );
  },
};

/** Sprungbefehle für Steuerelemente innerhalb des Providers (`messageScrollerCommands`), z. B. für Suchtreffer oder Permalinks. */
export const JumpingToMessages: Story = {
  render: () => {
    const id = "message-scroller-jump";
    const commands = messageScrollerCommands(id);

    return MessageScrollerProvider({
      id,
      defaultScrollPosition: "start",
      children:
        frame(
          MessageScroller({
            children: [
              MessageScrollerViewport({
                children: MessageScrollerContent({ class: "gap-6 p-4", children: transcript("jump", 12) }),
              }),
              MessageScrollerButton(),
            ],
          })
        ) +
        toolbar(
          actionButton("Zu Nachricht 3", commands.scrollToMessage("jump-3", { behavior: "smooth" })),
          actionButton("Nachricht 7 mittig", commands.scrollToMessage("jump-7", { align: "center", behavior: "smooth" })),
          actionButton("Zum Anfang", commands.scrollToStart({ behavior: "smooth" })),
          actionButton("Zum Ende", commands.scrollToEnd({ behavior: "smooth" }))
        ),
    });
  },
};

/** Statt `useMessageScrollerScrollable` spiegelt der Controller die Kanten in `data-scrollable` an Root und Viewport. Die Statuszeile reagiert rein per CSS darauf. */
export const ScrollStatus: Story = {
  render: () => {
    const group = "group-data-[scrollable=end]/message-scroller";
    const status = `<p class="border-t px-4 py-2 text-xs text-muted-foreground">
      <span class="group-data-scrollable/message-scroller:hidden">Alle Nachrichten passen in den Viewport.</span>
      <span class="hidden ${group}:inline">Am Anfang: nur nach unten scrollen.</span>
      <span class="hidden group-data-[scrollable='start_end']/message-scroller:inline">In der Mitte: in beide Richtungen scrollen.</span>
      <span class="hidden group-data-[scrollable=start]/message-scroller:inline">Am Ende: nur nach oben scrollen.</span>
    </p>`;

    return frame(
      MessageScrollerProvider({
        id: "message-scroller-status",
        defaultScrollPosition: "start",
        children: MessageScroller({
          children: [
            MessageScrollerViewport({
              children: MessageScrollerContent({ class: "gap-6 p-4", children: transcript("status", 8) }),
            }),
            status,
            MessageScrollerButton(),
          ],
        }),
      })
    );
  },
};

/** Zwei Buttons (Richtung "start" und "end"). Jeder ist inert, bis es in seiner Richtung etwas zu scrollen gibt. */
export const ScrollButtons: Story = {
  render: () =>
    frame(
      chat({
        id: "message-scroller-buttons",
        provider: { defaultScrollPosition: "start" },
        items: transcript("buttons", 10),
        overlay: MessageScrollerButton({ direction: "start" }) + MessageScrollerButton({ direction: "end" }),
      })
    ),
};
