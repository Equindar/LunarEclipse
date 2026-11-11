/**
 * Erzeugt src/icons/icons.generated.ts aus den SVG-Dateien in src/svg.
 *
 * Verwendung (im Paketordner):
 *   tsx scripts/generate-icons.ts           schreibt die Datei neu
 *   tsx scripts/generate-icons.ts --check   bricht mit Fehler ab, wenn die Datei veraltet ist (für CI)
 *
 * Regeln für SVG-Dateien:
 *   - Dateiname in kebab-case (z. B. app-window.svg), er wird zum Icon-Namen
 *   - viewBox="0 0 24 24"; Größe, Linienstil und Farbe setzt renderIcon (stroke="currentColor")
 *   - keine Skripte, Styles, Bilder, Event-Handler und keine href-Verweise (der Inhalt wird ungeprüft ins HTML geschrieben)
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";

const root = resolve(dirname(process.argv[1] ?? "."), "..");
const svgDir = join(root, "src/svgs");
const outFile = join(root, "src/ui/icon/Icons.generated.ts");
const checkOnly = process.argv.includes("--check");

const NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const FORBIDDEN: Array<[RegExp, string]> = [
  [/<script/i, "<script>"],
  [/<style/i, "<style>"],
  [/<foreignObject/i, "<foreignObject>"],
  [/<image/i, "<image>"],
  [/\son[a-z]+\s*=/i, "Event-Handler (on...=)"],
  [/javascript:/i, "javascript:"],
  [/href\s*=/i, "href-Verweis"],
];

function fail(message: string): never {
  console.error(`Fehler: ${message}`);
  process.exit(1);
}

function readBody(file: string): string {
  const source = readFileSync(join(svgDir, file), "utf8")
    .replace(/<\?xml[\s\S]*?\?>/, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();

  const match = /^<svg\b([^>]*)>([\s\S]*)<\/svg>$/.exec(source);
  if (!match) fail(`${file}: erwartet genau ein <svg>-Element`);

  const [, attributes = "", inner = ""] = match;
  if (!/viewBox\s*=\s*"0 0 24 24"/.test(attributes)) fail(`${file}: viewBox muss "0 0 24 24" sein`);

  for (const [pattern, label] of FORBIDDEN) {
    if (pattern.test(inner)) fail(`${file}: enthält ${label}, das ist nicht erlaubt`);
  }

  const body = inner.replace(/>\s+</g, "><").trim();
  if (body === "") fail(`${file}: leeres Icon`);

  return body;
}

const escapeTemplateLiteral = (value: string): string =>
  value.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");

if (!existsSync(svgDir)) fail(`Ordner nicht gefunden: ${svgDir}`);

const files = readdirSync(svgDir)
  .filter((file) => file.endsWith(".svg"))
  .sort();

if (files.length === 0) fail(`keine SVG-Dateien in ${svgDir}`);

const entries = files.map((file) => {
  const name = basename(file, ".svg");
  if (!NAME_PATTERN.test(name)) fail(`${file}: Dateiname muss kebab-case sein (a-z, 0-9, Bindestriche)`);

  return `  ${JSON.stringify(name)}: \`${escapeTemplateLiteral(readBody(file))}\`,`;
});

const output = `// Automatisch erzeugt von scripts/generateIcons.ts aus src/svgs/*.svg.
// Nicht von Hand ändern: SVG-Datei anpassen oder hinzufügen und das Skript erneut ausführen.

export const iconBodies = {
${entries.join("\n")}
} as const;

export type IconName = keyof typeof iconBodies;
`;

const current = existsSync(outFile) ? readFileSync(outFile, "utf8") : "";

if (checkOnly) {
  if (current !== output) fail("src/icons/icons.generated.ts ist veraltet, bitte \"tsx scripts/generateIcons.ts\" ausführen");
  console.log(`icons.generated.ts ist aktuell (${files.length} Icons).`);
} else if (current === output) {
  console.log(`Keine Änderung (${files.length} Icons).`);
} else {
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, output);
  console.log(`icons.generated.ts geschrieben (${files.length} Icons).`);
}
