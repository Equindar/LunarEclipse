import type { Meta, StoryObj } from "@storybook/html-vite";

import { LogCard } from "./LogCard";
import type { LogCardArgs, LogCardSectionArgs } from "./LogCard.types";

type LogSection = Omit<LogCardSectionArgs, "id" | "startedAt">;

/** Beginn des Kampfes in UTC (Epoch in Millisekunden); die Zeilen enthalten nur das Delta dazu */
const combatStart = Date.UTC(2026, 10, 24, 23, 58, 0);

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
const combatCard = {
  title: "Kampfbericht",
  description: "Ronan, der Schwertkämpfer, gegen den Werwolf der Mondlichtung",
  rangeLabel: "Zeitraum",
  sections: combatSections,
};

const meta: Meta<LogCardArgs> = {
  title: "UI-Library/LogCard",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Eine Card, deren Content aus Sections mit Log-Zeilen besteht. Die Zeilen enthalten nur das Delta zum Start (`mm:ss`), die Card bekommt den Startzeitpunkt in UTC (`startedAt`). Ein Toggle wechselt zwischen Dauer `[mm:ss]` und Uhrzeit `[HH:MM:SS]` (UTC). Der RangeSlider über dem Content wählt den Zeitraum in 10-Sekunden-Schritten, nur Zeilen und Sections in diesem Bereich (beide Grenzen inklusive) werden angezeigt. Slider, Toggle und Zeilen teilen sich das Signal-Objekt `$<id>` mit `from`, `to` (Sekunden) und `clock`. Funktioniert nur mit geladenem Datastar, ohne Datastar sind alle Zeilen im Startbereich sichtbar und Slider und Toggle wirkungslos.",
      },
    },
  },
  argTypes: {
    id: { control: "text" },
    startedAt: { control: "date" },
    timeMode: { control: "select", options: ["duration", "clock"] },
    title: { control: "text" },
    description: { control: "text" },
    rangeLabel: { control: "text" },
    step: { control: "number" },
    from: { control: "number" },
    to: { control: "number" },
    sections: { control: "object" },
    class: { control: "text" },
  },
  args: {
    id: "log-card-playground",
    startedAt: combatStart,
    timeMode: "duration",
    step: 10,
    ...combatCard,
  },
  render: (args) => `<div class="max-w-xl">${LogCard(args)}</div>`,
};

export default meta;
type Story = StoryObj<LogCardArgs>;

export const Playground: Story = {};

/** Startet in der Uhrzeit-Darstellung: [HH:MM:SS] in UTC, die Bereichsanzeige zeigt ebenfalls Uhrzeiten */
export const Uhrzeit: Story = {
  args: { id: "log-card-clock", timeMode: "clock" },
};

/** Startbereich 02:00 bis 04:00: spätere und frühere Zeilen sind von Anfang an ausgeblendet */
export const AbZweiBisVierMinuten: Story = {
  args: { id: "log-card-range-2-4", from: 120, to: 240 },
};

/** Enger Ausschnitt von 04:00 bis 04:20: nur die Zeilen 04:05, 04:12 und 04:20 bleiben sichtbar */
export const EngerAusschnitt: Story = {
  args: { id: "log-card-narrow", from: 240, to: 260 },
};

/** Startzeitpunkt als ISO-String mit Zeitzone statt als Epoch */
export const StartAlsIsoString: Story = {
  args: { id: "log-card-iso", startedAt: "2026-11-24T20:15:00Z", timeMode: "clock" },
};

/** Ohne startedAt gibt es nur Dauern, der Toggle entfällt */
export const OhneStartzeitpunkt: Story = {
  args: { id: "log-card-no-start", startedAt: undefined },
};

/** Gröbere Schritte: der Slider rastet alle 60 Sekunden ein */
export const MinutenSchritte: Story = {
  args: { id: "log-card-step-60", step: 60 },
};

/** Alle Töne einer Log-Zeile: default, muted, success, warning und danger */
export const Tonfarben: Story = {
  args: {
    id: "log-card-tones",
    title: "Tonfarben",
    description: "Die Farbe einer Zeile wird über tone gewählt",
    sections: [
      {
        title: "Töne",
        entries: [
          { time: "00:01", message: "default: normale Nachricht", tone: "default" },
          { time: "00:02", message: "muted: Status oder Nebensächliches", tone: "muted" },
          { time: "00:03", message: "success: Treffer oder Erfolg", tone: "success" },
          { time: "00:04", message: "warning: Warnung oder Besonderheit", tone: "warning" },
          { time: "00:05", message: "danger: Schaden oder Gefahr", tone: "danger" },
        ],
      },
      {
        title: "Später",
        entries: [{ time: "01:00", message: "Zweite Section, nur zum Umschalten des Sliders." }],
      },
    ],
  },
};
