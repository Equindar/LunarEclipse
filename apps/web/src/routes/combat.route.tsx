import { LogCard, LogCardSectionArgs } from '@lunareclipse/design';
import createI18n, { toSupportedLanguage } from '@lunareclipse/i18n';
import { Hono } from 'hono';
import { raw } from 'hono/html';
import { AppBar } from '../templates/appBar.js';
import { Layout } from '../templates/layout.js';

type LogSection = Omit<LogCardSectionArgs, "id">;

/** Kampfbericht: Ronan (Schwertkämpfer, 100 LP) gegen einen Werwolf (120 LP) */
const combatSections: LogSection[] = [
  {
    minute: 0,
    entries: [
      { time: "00:03", message: "Ronan betritt die mondbeschienene Lichtung.", tone: "muted" },
      { time: "00:11", message: "Ein tiefes Knurren dringt aus dem Unterholz.", tone: "warning" },
      { time: "00:19", message: "Der Werwolf springt aus dem Dickicht und baut sich vor Ronan auf.", tone: "danger" },
      { time: "00:27", message: "Ronan zieht sein Silberschwert." },
    ],
  },
  {
    minute: 1,
    entries: [
      { time: "01:04", message: "Ronan trifft den Werwolf an der Schulter. 14 Schaden.", tone: "success" },
      { time: "01:12", message: "Der Werwolf kontert mit einem Prankenhieb. Ronan verliert 9 Lebenspunkte.", tone: "danger" },
      { time: "01:25", message: "Ronan weicht dem nächsten Biss aus." },
      { time: "01:41", message: "Das Silber brennt in der Wunde, der Werwolf heult auf.", tone: "warning" },
      { time: "01:53", message: "Status: Ronan 91/100, Werwolf 106/120.", tone: "muted" },
    ],
  },
  {
    minute: 2,
    entries: [
      { time: "02:06", message: "Der Werwolf schnappt nach Ronans Schwertarm, Ronan pariert im letzten Moment." },
      { time: "02:18", message: "Ronan landet einen Stich in die Flanke. 18 Schaden.", tone: "success" },
      { time: "02:30", message: "Der Werwolf reißt Ronan zu Boden. 22 Schaden.", tone: "danger" },
      { time: "02:44", message: "Ronan rollt sich ab und kommt wieder auf die Beine." },
      { time: "02:58", message: "Status: Ronan 69/100, Werwolf 88/120.", tone: "muted" },
    ],
  },
  {
    minute: 3,
    entries: [
      { time: "03:07", message: "Der Werwolf heult den Mond an und regeneriert 10 Lebenspunkte.", tone: "warning" },
      { time: "03:19", message: "Ronan schleudert eine Fackel auf den Werwolf." },
      { time: "03:27", message: "Die Fackel setzt den Pelz in Brand. 12 Schaden.", tone: "success" },
      { time: "03:42", message: "Ronan duckt sich unter einer Pranke weg." },
      { time: "03:55", message: "Status: Ronan 69/100, Werwolf 86/120.", tone: "muted" },
    ],
  },
  {
    minute: 4,
    entries: [
      { time: "04:05", message: "Ronan erkennt eine Lücke in der Deckung des Werwolfs." },
      { time: "04:12", message: "Kritischer Treffer! Das Silberschwert fährt tief in die Brust. 40 Schaden.", tone: "success" },
      { time: "04:20", message: "Der Werwolf taumelt rückwärts.", tone: "warning" },
      { time: "04:33", message: "Im Gegenangriff streifen die Klauen Ronans Hals. 17 Schaden.", tone: "danger" },
      { time: "04:51", message: "Status: Ronan 52/100, Werwolf 46/120.", tone: "muted" },
    ],
  },
  {
    minute: 5,
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

const router = new Hono().get('/', async (c) => {
  const language = toSupportedLanguage(c.get('language'));
  const i18n = await createI18n(language, ['common']);
  const t = i18n.t.bind(i18n);



  return c.html(
    <Layout title="Hello World">
      <AppBar currentLang={language} currentPath={c.req.path} />
      <div class="flex justify-center m-4 gap-4">
        <div class="w-1/3">
          {raw(LogCard(combatCard))}
        </div>
        <div class="w-1/3">
          {raw(LogCard(combatCard))}
        </div>
      </div>
    </Layout>,
  );
});

export default router;
