import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import type { Button } from "../button";

/** Args des Buttons aus dem Design-System (shadcn: `React.ComponentProps<typeof Button>`) */
type ButtonArgs = Parameters<typeof Button>[0];

/** Öffnungsposition eines gespeicherten Transcripts */
export type MessageScrollerPosition = "start" | "end" | "last-anchor";

/** Rand des Transcripts, zu dem ein Button scrollt */
export type MessageScrollerDirection = "start" | "end";

/** Ausrichtung einer Nachricht im Viewport bei `scrollToMessage` */
export type MessageScrollerAlign = "start" | "center" | "end" | "nearest";

export interface MessageScrollerProviderArgs {
  /**
   * ID des Providers. Wird für die Befehle (`messageScrollerCommands`) gebraucht.
   * Ohne Angabe wird eine Zufalls-ID erzeugt (`message_scroller_<8 hex>`).
   */
  id?: string;
  /** Neuen Inhalt nur verfolgen, solange der Leser am unteren Rand (Live-Edge) ist (Standard: false) */
  autoScroll?: boolean;
  /** Öffnungsposition beim ersten Rendern, wird einmal angewendet (Standard: "end") */
  defaultScrollPosition?: MessageScrollerPosition;
  /** Abstand in Pixeln zum Rand, der noch als "am Anfang/Ende" zählt (Standard: 8) */
  scrollEdgeThreshold?: number;
  /** Rand in Pixeln an der ausgerichteten Kante für `scrollToMessage` und Anker (Standard: 0) */
  scrollMargin?: number;
  /** Zusätzlicher Rand in Pixeln, damit vom vorherigen Item ein Stück über einem neuen Anker sichtbar bleibt (Standard: 64) */
  scrollPreviousItemPeek?: number;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
  /** Inhalt: normalerweise `MessageScroller(...)` und weitere Steuerelemente */
  children?: Children;
}

export interface MessageScrollerArgs {
  /** Zusätzliche CSS-Klassen, z. B. `flex-1` */
  class?: string;
  attributes?: HtmlAttributes;
  /** Inhalt: Viewport und Buttons */
  children?: Children;
}

export interface MessageScrollerViewportArgs {
  class?: string;
  /**
   * Position des Scrollers beim Öffnen vor dem ersten Paint verstecken (`data-pending-scroll`).
   * Setze `true`, wenn `defaultScrollPosition` "end" oder "last-anchor" ist und das Transcript
   * serverseitig gerendert wird, sonst sieht man kurz die ältesten Nachrichten. Der Controller
   * setzt das Attribut beim Start auch selbst und entfernt es, sobald die Position angewendet ist.
   * Ohne Datastar bleibt der Viewport mit `true` unsichtbar (Standard: false).
   */
  pendingScroll?: boolean;
  /** Sichtbare Nachricht stabil halten, wenn ältere Zeilen oben eingefügt werden (Standard: true) */
  preserveScrollOnPrepend?: boolean;
  /**
   * Zusätzliche HTML-Attribute. `role` ("region"), `aria-label` ("Messages") und `tabindex` (0)
   * sind überschreibbare Standardwerte.
   */
  attributes?: HtmlAttributes;
  /** Inhalt: `MessageScrollerContent(...)` */
  children?: Children;
}

export interface MessageScrollerContentArgs {
  class?: string;
  /** Live-Region als beschäftigt markieren (`aria-busy`), solange eine Antwort gestreamt wird */
  busy?: boolean;
  /** Klassen für den internen Platzhalter, der Platz für verankerte Zeilen schafft */
  spacerClass?: string;
  /**
   * Zusätzliche HTML-Attribute. `role` ("log") und `aria-relevant` ("additions")
   * sind überschreibbare Standardwerte.
   */
  attributes?: HtmlAttributes;
  /** Inhalt: ausschliesslich `MessageScrollerItem(...)` */
  children?: Children;
}

export interface MessageScrollerItemArgs {
  /** Stabile Zeilen-ID für `scrollToMessage`, Prepend-Erhalt und Sichtbarkeit (`data-message-id`) */
  messageId?: string;
  /** Markiert die Zeile als Turn-Grenze, die neu angehängte Turns verankern kann (Standard: false) */
  scrollAnchor?: boolean;
  class?: string;
  attributes?: HtmlAttributes;
  /** Inhalt der Zeile: Nachricht, Marker, Tipp-Indikator, Trenner ... */
  children?: Children;
}

export interface MessageScrollerButtonArgs {
  /** Rand, zu dem der Button scrollt (Standard: "end") */
  direction?: MessageScrollerDirection;
  /** Scroll-Verhalten beim Klick (Standard: "smooth") */
  behavior?: ScrollBehavior;
  /** Button-Variante aus dem Design-System (Standard: "secondary") */
  variant?: ButtonArgs["variant"];
  /** Button-Grösse aus dem Design-System (Standard: "icon-sm") */
  size?: ButtonArgs["size"];
  class?: string;
  /** Text für Screenreader beim Standard-Inhalt (Standard: "Scroll to end" bzw. "Scroll to start") */
  label?: string;
  attributes?: HtmlAttributes;
  /** Eigener Inhalt, ersetzt Pfeil-Icon und Label */
  children?: Children;
}

/** Optionen eines Sprungbefehls (`messageScrollerCommands`) */
export interface MessageScrollerCommandOptions {
  /** Ausrichtung der Nachricht im Viewport (Standard: "start"), nur für `scrollToMessage` */
  align?: MessageScrollerAlign;
  /** Natives Scroll-Verhalten (Standard: "auto") */
  behavior?: ScrollBehavior;
  /** Rand an der ausgerichteten Kante, Standard: `scrollMargin` des Providers */
  scrollMargin?: number;
}

/** Interne Konfiguration des Controllers (wird als JSON in die Init-Expression geschrieben) */
export interface MessageScrollerControllerConfig {
  auto: boolean;
  pos: MessageScrollerPosition;
  edge: number;
  margin: number;
  peek: number;
}

/** Sprungbefehle für einen Scroller (Gegenstück zu `useMessageScroller`), jeweils als Datastar-Expression */
export interface MessageScrollerCommands {
  /** Zu einer Nachricht springen (`data-message-id`). Liefert `true`, wenn der Sprung lief oder vorgemerkt wurde */
  scrollToMessage: (messageId: string, options?: MessageScrollerCommandOptions) => string;
  /** Zur letzten Nachricht springen; bei `autoScroll` setzt das das Verfolgen fort */
  scrollToEnd: (options?: MessageScrollerCommandOptions) => string;
  /** An den Anfang des Transcripts springen */
  scrollToStart: (options?: MessageScrollerCommandOptions) => string;
}
