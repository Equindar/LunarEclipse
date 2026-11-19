import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Schreibrichtung */
export type FileUploadDirection = "ltr" | "rtl";

/** Zustand einer Datei in der Liste */
export type FileUploadStatus = "idle" | "uploading" | "success" | "error";

/** Ausrichtung der Dateiliste */
export type FileUploadListOrientation = "horizontal" | "vertical";

/** Schriftgröße der Metadaten */
export type FileUploadMetadataSize = "default" | "sm";

/** Darstellung des Fortschritts */
export type FileUploadProgressVariant = "linear" | "circular" | "fill";

/**
 * Signal-State eines File-Uploads (Datastar).
 * Die File-Objekte selbst liegen nicht in Signalen (nicht serialisierbar), sondern im Controller am Root-Element.
 */
export interface FileUploadSignals {
  /** Dateien werden gerade über die Dropzone gezogen */
  dragging: boolean;
  /** Letzte Auswahl wurde (teilweise) abgelehnt, wird nach 2 Sekunden zurückgesetzt */
  invalid: boolean;
  /** Anzahl der Dateien in der Liste */
  count: number;
}

/**
 * Render-Funktion für Button-artige Teile (Trigger, Delete, Clear). Ersetzt die `render`-Prop von Base UI:
 * Sie bekommt alle Attribute des Teils (Handler, aria, Marker) und liefert das fertige Element,
 * z. B. `(attributes) => Button({ variant: "outline", attributes, children: "Browse" })`.
 */
export type FileUploadRender = (attributes: HtmlAttributes) => string;

/** Öffentliche API des Controllers (`document.getElementById(id)._fu`) */
export interface FileUploadController {
  addFiles(files: File[]): void;
  removeFile(file: File): void;
  clear(): void;
  getFiles(): File[];
  /** Fortschritt in Prozent (0 bis 100) setzen, Status wird "uploading" */
  setProgress(file: File, progress: number): void;
  setSuccess(file: File): void;
  setError(file: File, message: string): void;
  openDialog(): void;
}

/**
 * Events am Root-Element (bubbling, Daten in `evt.detail`), z. B. `data-on:file-upload-accept="..."`:
 * - `file-upload-change`: `{ files: File[] }`, alle Dateien der Liste (Ersatz für onValueChange)
 * - `file-upload-accept`: `{ files: File[] }`, neu angenommene Dateien (Ersatz für onAccept/onFileAccept)
 * - `file-upload-reject`: `{ file: File, message: string }` (Ersatz für onFileReject)
 */
export interface FileUploadArgs {
  /** Pflicht: ID des Roots. Alle Teile bekommen dieselbe ID (Signal-Name: "-" wird zu "_") */
  id: string;
  class?: string;
  /** Erlaubte Typen wie im accept-Attribut, z. B. "image/*,.pdf" */
  accept?: string;
  /** Maximale Anzahl Dateien in der Liste */
  maxFiles?: number;
  /** Maximale Größe pro Datei in Bytes */
  maxSize?: number;
  multiple?: boolean;
  /** Muss bei Dropzone, Trigger und Clear ebenfalls gesetzt werden (kein React-Context) */
  disabled?: boolean;
  /** Startwert des Signals `invalid` */
  invalid?: boolean;
  required?: boolean;
  /** Feldname des versteckten Inputs (auch Feldname beim Direkt-Upload, Standard dort: "file") */
  name?: string;
  /** Zugänglicher Name des Inputs (Standard: "File upload") */
  label?: string;
  /** Wird nur gesetzt, wenn angegeben (sonst erbt das Element die Richtung) */
  dir?: FileUploadDirection;
  /**
   * Direkt-Upload (Ersatz für onUpload): jede angenommene Datei wird per XMLHttpRequest als multipart/form-data
   * (POST) an diese URL gesendet, der Fortschritt landet automatisch in der Liste.
   * In diesem Modus wird der native Input nicht mit den Dateien befüllt.
   */
  uploadUrl?: string;
  /**
   * Ersatz für onFileValidate: einzeiliger JavaScript-Ausdruck ohne Semikolon mit der Variable `file`,
   * Ergebnis ist eine Fehlermeldung oder null, z. B. `file.name.length > 20 ? "Name too long" : null`.
   */
  validateExpression?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}

export interface FileUploadDropzoneArgs {
  /** Pflicht: ID des Roots */
  id: string;
  class?: string;
  disabled?: boolean;
  attributes?: HtmlAttributes;
  children?: Children;
}

export interface FileUploadTriggerArgs {
  /** Pflicht: ID des Roots */
  id: string;
  class?: string;
  disabled?: boolean;
  /** Ersetzt das Standard-Element (`children` wird dann ignoriert) */
  render?: FileUploadRender;
  attributes?: HtmlAttributes;
  children?: Children;
}

export interface FileUploadListArgs {
  /** Pflicht: ID des Roots */
  id: string;
  class?: string;
  /** Standard: "vertical" */
  orientation?: FileUploadListOrientation;
  /** Liste auch ohne Dateien anzeigen */
  forceMount?: boolean;
  attributes?: HtmlAttributes;
  /** Genau ein `FileUploadItem` (dient als Vorlage für jede Datei) */
  children?: Children;
}

/** Vorlage für ein Listenelement. Der Controller klont sie pro Datei (Ersatz für `value: File`). */
export interface FileUploadItemArgs {
  class?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}

export interface FileUploadItemPreviewArgs {
  class?: string;
  attributes?: HtmlAttributes;
  /** Zusätzlicher Inhalt hinter Bild/Icon, z. B. ein Fortschritt (previewRender entfällt) */
  children?: Children;
}

export interface FileUploadItemMetadataArgs {
  class?: string;
  /** Standard: "default" */
  size?: FileUploadMetadataSize;
  attributes?: HtmlAttributes;
  /**
   * Eigener Inhalt. Der Controller füllt jedes Element mit `data-file-upload-field="name" | "size" | "message"`
   * (message: Fehlertext, wird nur bei Fehlern angezeigt). Ohne `children` kommen Name, Größe und Fehlertext.
   */
  children?: Children;
}

export interface FileUploadItemProgressArgs {
  class?: string;
  /** Standard: "linear" */
  variant?: FileUploadProgressVariant;
  /** Durchmesser in Pixeln, nur für "circular" (Standard: 40) */
  size?: number;
  /** Auch bei 100 Prozent anzeigen */
  forceMount?: boolean;
  attributes?: HtmlAttributes;
}

export interface FileUploadItemDeleteArgs {
  class?: string;
  render?: FileUploadRender;
  attributes?: HtmlAttributes;
  children?: Children;
}

export interface FileUploadClearArgs {
  /** Pflicht: ID des Roots */
  id: string;
  class?: string;
  disabled?: boolean;
  /** Auch ohne Dateien anzeigen */
  forceMount?: boolean;
  render?: FileUploadRender;
  attributes?: HtmlAttributes;
  children?: Children;
}
