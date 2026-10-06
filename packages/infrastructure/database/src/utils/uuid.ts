import { randomUUID } from "node:crypto";

/**
 * Wandelt einen UUID-String (Standardformat mit Bindestrichen, 36 Zeichen)
 * in einen 16-Byte-Buffer um – passend für binary(16)-Spalten.
 */
export const uuidToBuffer = (uuid: string): Buffer => {
  const hex = uuid.replace(/-/g, "");
  if (hex.length !== 32) {
    throw new Error(`Ungültige UUID: "${uuid}"`);
  }
  return Buffer.from(hex, "hex");
};

/**
 * Rückrichtung: 16-Byte-Buffer -> lesbarer UUID-String im Standardformat.
 */
export const bufferToUuid = (buffer: Buffer): string => {
  if (buffer.length !== 16) {
    throw new Error(`Ungültige Buffer-Länge: erwartet 16, erhalten ${buffer.length}`);
  }
  const hex = buffer.toString("hex");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
};

export const generateUuidBuffer = (): Buffer => uuidToBuffer(randomUUID());
