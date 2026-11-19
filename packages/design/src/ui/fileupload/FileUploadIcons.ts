import { renderIcon } from "../../utils/renderIcon";

/**
 * Icon-Körper (Lucide, 24x24) für die Datei-Upload-Komponente.
 * Neue Datei in utils. Gehört langfristig in den zentralen Icon-Ordner des Pakets.
 */
export type FileTypeIconName = "video" | "audio" | "text" | "code" | "archive" | "cog" | "file";

export const fileTypeIconBodies: Record<FileTypeIconName, string> = {
  video: `<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" /><path d="M14 2v5a1 1 0 0 0 1 1h5" /><path d="M15.033 13.44a.647.647 0 0 1 0 1.12l-4.065 2.352a.645.645 0 0 1-.968-.56v-4.704a.645.645 0 0 1 .967-.56z" />`,
  audio: `<path d="M4 6.835V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2h-.343" /><path d="M14 2v5a1 1 0 0 0 1 1h5" /><path d="M2 19a2 2 0 0 1 4 0v1a2 2 0 0 1-4 0v-4a6 6 0 0 1 12 0v4a2 2 0 0 1-4 0v-1a2 2 0 0 1 4 0" />`,
  text: `<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" /><path d="M14 2v5a1 1 0 0 0 1 1h5" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />`,
  code: `<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" /><path d="M14 2v5a1 1 0 0 0 1 1h5" /><path d="M10 12.5 8 15l2 2.5" /><path d="m14 12.5 2 2.5-2 2.5" />`,
  archive: `<path d="M13.659 22H18a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v11.5" /><path d="M14 2v5a1 1 0 0 0 1 1h5" /><path d="M8 12v-1" /><path d="M8 18v-2" /><path d="M8 7V6" /><circle cx="8" cy="20" r="2" />`,
  cog: `<path d="M15 8a1 1 0 0 1-1-1V2a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8z" /><path d="M20 8v12a2 2 0 0 1-2 2h-4.182" /><path d="m3.305 19.53.923-.382" /><path d="M4 10.592V4a2 2 0 0 1 2-2h8" /><path d="m4.228 16.852-.924-.383" /><path d="m5.852 15.228-.383-.923" /><path d="m5.852 20.772-.383.924" /><path d="m8.148 15.228.383-.923" /><path d="m8.53 21.696-.382-.924" /><path d="m9.773 16.852.922-.383" /><path d="m9.773 19.148.922.383" /><circle cx="7" cy="18" r="3" />`,
  file: `<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" /><path d="M14 2v5a1 1 0 0 0 1 1h5" />`,
};

/** Weitere Icons für Stories und Beispiele */
export const uploadIconBody = `<path d="M12 3v12" /><path d="m17 8-5-5-5 5" /><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />`;
export const xIconBody = `<path d="M18 6 6 18" /><path d="m6 6 12 12" />`;
export const paperclipIconBody = `<path d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551" />`;

/** Fertige SVG-Strings der Dateityp-Icons (ohne Klassen, die Größe setzt die Preview über [&>svg]:size-6) */
export function renderFileTypeIcons(): Record<FileTypeIconName, string> {
  const entries = Object.entries(fileTypeIconBodies) as [FileTypeIconName, string][];
  return Object.fromEntries(entries.map(([name, svg]) => [name, renderIcon(svg)])) as Record<FileTypeIconName, string>;
}
