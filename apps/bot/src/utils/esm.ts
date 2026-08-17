import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

/**
 * Ersatz für __dirname in ESM.
 * Aufruf: dirnameFromMeta(import.meta.url)
 */
export function dirnameFromMeta(metaUrl: string): string {
  return path.dirname(fileURLToPath(metaUrl));
}

/**
 * Ersatz für __filename in ESM.
 * Aufruf: filenameFromMeta(import.meta.url)
 */
export function filenameFromMeta(metaUrl: string): string {
  return fileURLToPath(metaUrl);
}

/**
 * Sicherer dynamischer Import für absolute Dateisystempfade.
 * Verhindert ERR_UNSUPPORTED_ESM_URL_SCHEME auf Windows, wo
 * Node import() eine echte file:// URL statt eines rohen
 * Dateisystempfads (z.B. "C:\...") erwartet.
 */
export async function importModule<T = unknown>(filePath: string): Promise<T> {
  return import(pathToFileURL(filePath).href) as Promise<T>;
}
