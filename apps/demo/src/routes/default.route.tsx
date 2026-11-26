import { LogCard, LogCardArgs, logCardContentSelector, logCardEntriesSelector, LogCardEntry, LogCardSection, LogCardSectionArgs, logCardSectionId, logCardSignalsPatch } from '@lunareclipse/design';
import createI18n, { toSupportedLanguage } from '@lunareclipse/i18n';
import { Hono } from 'hono';
import { raw } from 'hono/html';
import { AppBar } from '../templates/appBar';
import { Layout } from '../templates/layout';

type LogSection = Omit<LogCardSectionArgs, "id" | "startedAt">;

/** Beginn des Kampfes in UTC (Epoch in Millisekunden); die Zeilen enthalten nur das Delta dazu */
const combatStart = Date.UTC(2026, 10, 24, 23, 57, 52);

/** Kampfbericht: Ronan (Schwertkämpfer, 100 LP) gegen einen Werwolf (120 LP) */
const combatSections: LogSection[] = [
  {
    title: "Die Begegnung",
    entries: [
      { time: "00:03", message: "Ronan betritt die mondbeschienene Lichtung.", tone: "muted" },
      { time: "00:11", message: "Ein tiefes Knurren dringt aus dem Unterholz.", tone: "warning" },
      { time: "00:19", message: "Der Werwolf springt aus dem Dickicht und baut sich vor Ronan auf.", tone: "danger" },
      { time: "00:27", message: "Ronan zieht sein Silberschwert." },
    ],
  },
  {
    title: "Erste Schläge",
    entries: [
      { time: "01:04", message: "Ronan trifft den Werwolf an der Schulter. 14 Schaden.", tone: "success" },
      { time: "01:12", message: "Der Werwolf kontert mit einem Prankenhieb. Ronan verliert 9 Lebenspunkte.", tone: "danger" },
      { time: "01:25", message: "Ronan weicht dem nächsten Biss aus." },
      { time: "01:41", message: "Das Silber brennt in der Wunde, der Werwolf heult auf.", tone: "warning" },
      { time: "01:53", message: "Status: Ronan 91/100, Werwolf 106/120.", tone: "muted" },
    ],
  },
  {
    title: "Das Blatt wendet sich",
    entries: [
      { time: "02:06", message: "Der Werwolf schnappt nach Ronans Schwertarm, Ronan pariert im letzten Moment." },
      { time: "02:18", message: "Ronan landet einen Stich in die Flanke. 18 Schaden.", tone: "success" },
      { time: "02:30", message: "Der Werwolf reißt Ronan zu Boden. 22 Schaden.", tone: "danger" },
      { time: "02:44", message: "Ronan rollt sich ab und kommt wieder auf die Beine." },
      { time: "02:58", message: "Status: Ronan 69/100, Werwolf 88/120.", tone: "muted" },
    ],
  },
  {
    title: "Mondlicht und Feuer",
    entries: [
      { time: "03:07", message: "Der Werwolf heult den Mond an und regeneriert 10 Lebenspunkte.", tone: "warning" },
      { time: "03:19", message: "Ronan schleudert eine Fackel auf den Werwolf." },
      { time: "03:27", message: "Die Fackel setzt den Pelz in Brand. 12 Schaden.", tone: "success" },
      { time: "03:42", message: "Ronan duckt sich unter einer Pranke weg." },
      { time: "03:55", message: "Status: Ronan 69/100, Werwolf 86/120.", tone: "muted" },
    ],
  },
  {
    title: "Der Wendepunkt",
    entries: [
      { time: "04:05", message: "Ronan erkennt eine Lücke in der Deckung des Werwolfs." },
      { time: "04:12", message: "Kritischer Treffer! Das Silberschwert fährt tief in die Brust. 40 Schaden.", tone: "success" },
      { time: "04:20", message: "Der Werwolf taumelt rückwärts.", tone: "warning" },
      { time: "04:33", message: "Im Gegenangriff streifen die Klauen Ronans Hals. 17 Schaden.", tone: "danger" },
      { time: "04:51", message: "Status: Ronan 52/100, Werwolf 46/120.", tone: "muted" },
    ],
  },
  {
    title: "Der letzte Hieb",
    entries: [
      { time: "05:03", message: "Der Werwolf will fliehen, doch Ronan versperrt ihm den Weg." },
      { time: "05:14", message: "Ronan führt den entscheidenden Hieb. 46 Schaden.", tone: "success" },
      { time: "05:16", message: "Der Werwolf stürzt zu Boden und verwandelt sich zurück in einen Menschen.", tone: "warning" },
      { time: "05:30", message: "Kampf beendet. Sieger: Ronan.", tone: "success" },
    ],
  },
];

/** Gemeinsame Texte der Card */
const combatCard: LogCardArgs = {
  title: "Kampfbericht",
  description: "Ronan, der Schwertkämpfer, gegen den Werwolf der Mondlichtung",
  rangeLabel: "Zeitraum",
  sections: combatSections,
  startedAt: combatStart,
  timeMode: "duration",
  id: "log-card-ended",
  step: 10,
  live: false,
};

/* ---------------------------------------------------------------------------------------------
 * Live-Simulation
 *
 * Der Server wird nachgestellt: Die Card öffnet per data-init einen SSE-Stream (@get). Ein gemocktes fetch
 * liefert dafür einen echten text/event-stream mit Datastar-Events. Die Events sind dieselben, die ein
 * Server schicken würde, und werden mit denselben Bausteinen erzeugt (LogCardSection, LogCardEntry,
 * die Selector-Helfer und logCardSignalsPatch).
 * ------------------------------------------------------------------------------------------- */

/** Zeitraffer: 1 Sekunde echte Zeit entspricht so vielen Sekunden Kampfzeit */
const LIVE_SPEED = 6;
/** Mindestabstand zwischen zwei Zeilen in Millisekunden */
const LIVE_MIN_GAP_MS = 150;
const MOCK_PREFIX = "/mock/log-card/";

interface SimulatedEntry {
  sectionIndex: number;
  /** Erste Zeile ihrer Section: dann kommt die ganze Section neu in die Card */
  first: boolean;
  section: LogSection;
  entry: NonNullable<LogSection["entries"]>[number];
  seconds: number;
}

/** Alle Zeilen des Kampfes in zeitlicher Reihenfolge */
export const simulation: SimulatedEntry[] = combatSections.flatMap((section, sectionIndex) =>
  (section.entries ?? []).map((entry, index) => ({
    sectionIndex,
    first: index === 0,
    section,
    entry,
    seconds: Number(entry.time.slice(0, 2)) * 60 + Number(entry.time.slice(3, 5)),
  }))
);

/** Ein SSE-Frame im Datastar-Format */
const sseFrame = (event: string, lines: string[]): string =>
  `event: ${event}\n${lines.map((line) => `data: ${line}`).join("\n")}\n\n`;

const patchElementsFrame = (selector: string, elements: string): string =>
  sseFrame("datastar-patch-elements", ["mode append", `selector ${selector}`, `elements ${elements}`]);

const patchSignalsFrame = (signals: string): string => sseFrame("datastar-patch-signals", [`signals ${signals}`]);

/** Ein neuer Eintrag: die erste Zeile einer Section bringt die Section mit, alle weiteren hängen sich an */
function entryFrame(cardId: string, startedAt: number, item: SimulatedEntry): string {
  if (item.first) {
    const section = LogCardSection({
      ...item.section,
      id: cardId,
      sectionId: logCardSectionId(cardId, item.sectionIndex),
      startedAt,
      entries: [item.entry],
      announce: true,
    });
    return patchElementsFrame(logCardContentSelector(cardId), section);
  }
  const entry = LogCardEntry({ ...item.entry, cardId, startedAt, announce: true });
  return patchElementsFrame(logCardEntriesSelector(cardId, item.sectionIndex), entry);
}

/** Streamt die Zeilen ab Position skip im Zeitraffer und beendet den Kampf am Ende mit { live: false } */
function createMockStream(url: URL, signal?: AbortSignal | null): Response {
  const cardId = decodeURIComponent(url.pathname.slice(MOCK_PREFIX.length));
  const skip = Number(url.searchParams.get("skip") ?? 0);
  const startedAt = Number(url.searchParams.get("start"));
  const speed = Number(url.searchParams.get("speed") ?? LIVE_SPEED);

  const encoder = new TextEncoder();
  const timers: number[] = [];
  const stop = (): void => timers.forEach((timer) => window.clearTimeout(timer));

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (frame: string): void => {
        try {
          controller.enqueue(encoder.encode(frame));
        } catch {
          // Stream ist schon geschlossen (Story gewechselt)
        }
      };

      let previous = skip > 0 ? simulation[skip - 1]!.seconds : 0;
      let elapsed = 0;
      for (const item of simulation.slice(skip)) {
        elapsed += Math.max(((item.seconds - previous) / speed) * 1000, LIVE_MIN_GAP_MS);
        previous = item.seconds;
        timers.push(window.setTimeout(() => send(entryFrame(cardId, startedAt, item)), elapsed));
      }

      timers.push(
        window.setTimeout(() => {
          send(patchSignalsFrame(logCardSignalsPatch(cardId, { live: false })));
          try {
            controller.close();
          } catch {
            // schon geschlossen
          }
        }, elapsed + 500)
      );

      signal?.addEventListener("abort", () => {
        stop();
        try {
          controller.close();
        } catch {
          // schon geschlossen
        }
      });
    },
    cancel: stop,
  });

  return new Response(stream, { headers: { "Content-Type": "text/event-stream" } });
}

let mockInstalled = false;

/** Leitet fetch-Aufrufe an /mock/log-card/ auf den Mock-Stream um, alles andere läuft normal weiter */
function installMockSse(): void {
  if (mockInstalled || typeof window === "undefined") return;
  mockInstalled = true;

  const realFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const href = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    const url = new URL(href, window.location.href);
    if (url.pathname.startsWith(MOCK_PREFIX)) return Promise.resolve(createMockStream(url, init?.signal));
    return realFetch(input, init);
  };
}

/** Rendert eine Live-Card: bereits vorhandene Sections kommen im HTML, der Rest über den simulierten Stream */
function renderLive(args: LogCardArgs): string {
  installMockSse();

  const skip = (args.sections ?? []).reduce((sum, section) => sum + (section.entries?.length ?? 0), 0);
  const lastSeconds = skip > 0 ? simulation[skip - 1]!.seconds : 0;
  // Der Kampf hat vor lastSeconds Sekunden begonnen, damit die Uhrzeit-Darstellung zur aktuellen Zeit passt
  const startedAt = Date.now() - lastSeconds * 1000;
  const id = args.id ?? "log-card-live";
  const url = `${MOCK_PREFIX}${encodeURIComponent(id)}?skip=${skip}&start=${startedAt}&speed=${LIVE_SPEED}`;
  console.log(url);

  return LogCard({ ...args, id, startedAt, sseUrl: url });
}

const combatCardLive: LogCardArgs = {
  title: "Kampfbericht",
  description: "Ronan, der Schwertkämpfer, gegen den Werwolf der Mondlichtung",
  rangeLabel: "Zeitraum",
  sections: combatSections.slice(0, 1),
  step: 10,
  live: true,
};

export const defaultRouter = new Hono().get('/', async (c) => {
  const language = toSupportedLanguage(c.get('language'));
  const i18n = await createI18n(language, ['common']);
  const t = i18n.t.bind(i18n);

  return c.html(
    <Layout title="Demo: Prototyp Kampfbericht">
      <AppBar currentLang={language} currentPath={c.req.path} />
      <div class="flex flex-col md:flex-row justify-center p-5 gap-5 w-full">
        <div class="flex w-1/2 justify-end">
          {raw(LogCard(combatCard))}
        </div>
        <div class="flex w-1/2 justify-start">
          {raw(renderLive(combatCardLive))}
        </div>
      </div>
    </Layout>
  );
});
