// Automatisch erzeugt von scripts/generateIcons.ts aus src/svgs/*.svg.
// Nicht von Hand ändern: SVG-Datei anpassen oder hinzufügen und das Skript erneut ausführen.

export const iconBodies = {
  "app-window": `<rect x="2" y="4" width="20" height="16" rx="2" /><path d="M10 4v4" /><path d="M2 8h20" /><path d="M6 4v4" />`,
  "close": `<path d="M18 6 6 18" /><path d="m6 6 12 12" />`,
  "code": `<path d="m16 18 6-6-6-6" /><path d="m8 6-6 6 6 6" />`,
} as const;

export type IconName = keyof typeof iconBodies;
