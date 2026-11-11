import { buildConditional } from "../../utils/buildConditional";
import { createSignals } from "../../utils/SignalManager";
import type { DialogSignals } from "./Dialog.types";

/**
 * Datastar-Expressions und Attribut-Bausteine des Dialogs.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 *
 * Der Dialog nutzt das native dialog-Element (showModal/close). Das Signal "open"
 * wird in beide Richtungen synchron gehalten: Der Effect öffnet oder schließt das Element,
 * das close-Event (Escape, Backdrop-Klick, Schließen-Button) setzt das Signal zurück.
 */

/** Signal-Manager eines Dialogs (Signal-Name = ID mit "-" zu "_") */
export const dialogSignals = (dialogId: string, open = false) =>
  createSignals<DialogSignals>(dialogId, { open });

/** ID des Titels (Ziel von aria-labelledby am Content) */
export const dialogTitleId = (dialogId: string): string => `${dialogId}-title`;

/** ID der Beschreibung (Ziel von aria-describedby am Content) */
export const dialogDescriptionId = (dialogId: string): string => `${dialogId}-description`;

/** Trigger: Dialog über das Signal öffnen */
export function buildOpenHandler(dialogId: string): string {
  return dialogSignals(dialogId).set("open", "true");
}

/** Effect am dialog-Element: Signal -> showModal()/close() */
export function buildSyncEffect(dialogId: string): string {
  const open = dialogSignals(dialogId).signal("open");

  return buildConditional(open, "(el.open ? null : el.showModal())", "(el.open ? el.close() : null)");
}

/** close-Event am dialog-Element: Signal zurücksetzen (Escape, Backdrop, Buttons) */
export function buildCloseSyncHandler(dialogId: string): string {
  return dialogSignals(dialogId).set("open", "false");
}

/** Schließen-Handler für DialogClose und die Buttons: schließt den umgebenden dialog */
export function buildCloseHandler(): string {
  return "el.closest('dialog')?.close()";
}

/**
 * Klick auf den Backdrop schließt den Dialog.
 * Der Klick muss direkt auf dem dialog-Element liegen (nicht auf einem Kind) und ausserhalb
 * seiner Box. Das schließt Tastatur-Klicks auf Buttons (clientX/Y = 0, Ziel = Button) aus.
 */
export function buildBackdropClickHandler(): string {
  const rect = "el.getBoundingClientRect()";
  const outside = [
    `evt.clientX < ${rect}.left`,
    `evt.clientX > ${rect}.right`,
    `evt.clientY < ${rect}.top`,
    `evt.clientY > ${rect}.bottom`,
  ].join(" || ");

  return buildConditional(`evt.target === el && (${outside})`, "el.close()", "null");
}
