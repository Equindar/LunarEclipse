import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Art des Toasts; bestimmt das Status-Icon (ohne Angabe wird kein Icon gerendert) */
export type ToastType = "success" | "info" | "warning" | "error" | "loading";

/** Container (Viewport), in den die Toasts eingefügt werden */
export interface ToasterArgs {
  /** ID des Containers (Standard: "toaster"); die Handler zum Hinzufügen von Toasts verweisen darauf */
  id?: string;
  class?: string;
  attributes?: HtmlAttributes;
  /** Bereits vorhandene Toasts (z. B. serverseitig gerendert) */
  children?: Children;
}

/** Wurzelelement eines einzelnen Toasts (Auto-Dismiss, Pausieren, Escape) */
export interface ToastRootArgs {
  /** Optionale ID, um den Toast gezielt anzusprechen (z. B. für ein Server-Update) */
  id?: string;
  /** Setzt data-type und die ARIA-Rolle (error: alert, sonst status) */
  type?: ToastType;
  /**
   * Dauer in Millisekunden bis der Toast von selbst verschwindet (Standard: 5000).
   * 0 deaktiviert das Auto-Dismiss. Bei type "loading" ist der Standard 0.
   */
  timeout?: number;
  class?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}

export interface ToastContentArgs {
  class?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}

export interface ToastTitleArgs {
  class?: string;
  attributes?: HtmlAttributes;
  /** Inhalt als fertiges HTML (bei Daten aus Nutzereingaben vorher mit escapeHtml behandeln) */
  children?: Children;
}

export interface ToastDescriptionArgs {
  class?: string;
  attributes?: HtmlAttributes;
  /** Inhalt als fertiges HTML (bei Daten aus Nutzereingaben vorher mit escapeHtml behandeln) */
  children?: Children;
}

/** Aktions-Button des Toasts (entspricht actionProps in shadcn) */
export interface ToastActionArgs {
  /** Datastar-Expression für data-on:click, z. B. buildCloseToastHandler() oder "@post('/undo')" */
  onClick?: string;
  class?: string;
  attributes?: HtmlAttributes;
  /** Beschriftung des Buttons */
  children?: Children;
}

export interface ToastCloseArgs {
  class?: string;
  attributes?: HtmlAttributes;
  /** Eigenes Icon; ohne Angabe wird das X-Icon gerendert */
  children?: Children;
}

export interface ToastIconArgs {
  type?: ToastType;
}

/** Vollständiger Toast: Icon, Titel, Beschreibung, Aktion und Schließen-Button */
export interface ToastArgs {
  id?: string;
  type?: ToastType;
  /** Titel als Text (wird escaped) */
  title?: string;
  /** Beschreibung als Text (wird escaped) */
  description?: string;
  /** Aktions-Button (entspricht actionProps) */
  action?: ToastActionArgs;
  /** Schließen-Button anzeigen (Standard: true) */
  closable?: boolean;
  /** Siehe ToastRootArgs.timeout */
  timeout?: number;
  class?: string;
  attributes?: HtmlAttributes;
}

/** Zustände eines Promise-Toasts (entspricht toast.promise) */
export interface ToastPromiseArgs {
  /** JavaScript-Expression, die ein Promise liefert, z. B. "fetch('/api/save')" */
  promise: string;
  loading: ToastArgs;
  success: ToastArgs;
  error: ToastArgs;
}
