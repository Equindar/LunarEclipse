const dateFormat =
  "{day:'2-digit',month:'2-digit',year:'numeric'," +
  "hour:'2-digit',minute:'2-digit',second:'2-digit'}";

/** "countdown-ab12" -> "countdown_ab12" (gleiche Regel wie in Toggle) */
export const toSignalName = (id: string) => id.replaceAll("-", "_");

export function countdownExpressions(id: string) {
  const key = toSignalName(id);
  const local = `$_${key}`; // lokaler Namespace: _<key>.now / _<key>.target
  const remaining = `$_${key}_remaining`; // data-computed

  return {
    // Lokale Signale (Prefix "_"): werden nie zum Server gesendet
    signals: (targetMs: number) => `{_${key}: {now: Date.now(), target: ${targetMs}}}`,
    remainingName: `_${key}_remaining`,
    remaining: `Math.max(0, ${local}.target - ${local}.now)`,
    tick: `${local}.now = Date.now()`,

    // Toggle-Signal der Komponente: $<id mit _>.pressed
    showTimestamp: `!$${key}.pressed`,
    showRemaining: `$${key}.pressed`,

    timestampText: `new Date(${local}.now).toLocaleString('de-DE', ${dateFormat}).replace(',', '')`,
    remainingText:
      `Math.floor(${remaining} / 3600000).toString().padStart(2, '0')` +
      ` + new Date(${remaining}).toISOString().slice(13, 19)`,
  };
}
