import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import type { Button } from "../button";

/** Upload-Zustand des Attachments (steuert Styling und Shimmer) */
export type AttachmentState = "idle" | "uploading" | "processing" | "error" | "done";

/** Größe des Attachments */
export type AttachmentSize = "default" | "sm" | "xs";

/** Anordnung von Media und Content */
export type AttachmentOrientation = "horizontal" | "vertical";

/** Art des Media-Bereichs: Icon oder Bild (`<img>`) */
export type AttachmentMediaVariant = "icon" | "image";

/** Gemeinsame Args aller einfachen Teilkomponenten */
export interface AttachmentPartArgs {
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben, nur `data-slot` ersetzt den Standardwert) */
  attributes?: HtmlAttributes;
  /** Inhalt (HTML) */
  children?: Children;
}

export interface AttachmentArgs extends AttachmentPartArgs {
  /** Upload-Zustand (Standard: "done") */
  state?: AttachmentState;
  /** Größe (Standard: "default") */
  size?: AttachmentSize;
  /** Media neben (horizontal) oder über (vertical) dem Content (Standard: "horizontal") */
  orientation?: AttachmentOrientation;
}

export interface AttachmentMediaArgs extends AttachmentPartArgs {
  /** "icon" für ein Icon, "image" für ein `<img>` im Media-Bereich (Standard: "icon") */
  variant?: AttachmentMediaVariant;
}

export type AttachmentContentArgs = AttachmentPartArgs;
export type AttachmentTitleArgs = AttachmentPartArgs;
export type AttachmentDescriptionArgs = AttachmentPartArgs;
export type AttachmentActionsArgs = AttachmentPartArgs;
export type AttachmentGroupArgs = AttachmentPartArgs;

/**
 * Args einer Aktion. AttachmentAction rendert einen Button und akzeptiert dessen Args.
 * Standardwerte: variant "ghost", size "icon-xs".
 * Jede Aktion braucht meist ein `aria-label` (über `attributes`), z. B. "Remove datei.pdf".
 */
export type AttachmentActionArgs = NonNullable<Parameters<typeof Button>[0]>;

export interface AttachmentTriggerArgs extends AttachmentPartArgs {
  /**
   * Wenn gesetzt, wird der Trigger als Link (`<a>`) statt als `<button>` gerendert
   * (Ersatz für `asChild` bzw. `render` der Vorlage).
   */
  href?: string;
}
