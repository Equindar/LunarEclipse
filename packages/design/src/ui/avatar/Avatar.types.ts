import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Größe des Avatars (data-size am Root; steuert auch Badge, Fallback-Text und GroupCount) */
export type AvatarSize = "default" | "sm" | "lg";

/** Ladezustand des Bildes (data-status am Root); ohne Attribut gilt: Bild lädt noch */
export type AvatarImageStatus = "loaded" | "error";

export interface AvatarArgs {
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
  /** Größe (Standard: "default" = 32 px, "sm" = 24 px, "lg" = 40 px) */
  size?: AvatarSize;
  /** Hintergrundfarbe des Default-Avatars (z. B. "#3b82f6" oder "hsl(210, 100%, 50%)") */
  backgroundColor?: string;
  /** Textfarbe des Default-Avatars (Standard: weiß) */
  textColor?: string;
  /**
   * Kurzform für ein Bild (URL, Pfad oder Data-URI, vorgesehen für .webp oder .png).
   * Ist sie gesetzt, wird ein AvatarImage anstelle von children, backgroundColor und textColor angezeigt.
   * Für Bild mit Fallback stattdessen AvatarImage und AvatarFallback als children verwenden.
   */
  source?: string;
  /** Alternativtext des Bildes (nur mit source; Standard: leer = dekorativ) */
  alt?: string;
  /**
   * Inhalt des Avatars: Text (Default-Avatar, z. B. Initialen) oder Teilkomponenten
   * (AvatarImage, AvatarFallback, AvatarBadge). Wird bei gesetztem source nicht gerendert.
   */
  children?: Children;
}

/** Gemeinsame Args der Teilkomponenten */
export interface AvatarPartArgs {
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
  /** Inhalt (Text, Icon als SVG-String usw.) */
  children?: Children;
}

export interface AvatarImageArgs {
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
  /** Bildquelle (URL, Pfad oder Data-URI); entspricht `src` in shadcn */
  source: string;
  /** Alternativtext des Bildes (Standard: leer = dekorativ) */
  alt?: string;
}

/**
 * Fallback (Initialen oder Icon), sichtbar solange das Bild lädt oder fehlschlägt.
 * Das Umschalten bei geladenem Bild und bei Fehler braucht Datastar.
 */
export type AvatarFallbackArgs = AvatarPartArgs;

/** Statusanzeige unten rechts im Avatar; Farben über `class`, ein Icon (SVG-String) als children */
export type AvatarBadgeArgs = AvatarPartArgs;

/** Überlappende Gruppe von Avataren */
export type AvatarGroupArgs = AvatarPartArgs;

/** Zähler am Ende einer AvatarGroup (z. B. "+3") oder ein Icon */
export type AvatarGroupCountArgs = AvatarPartArgs;
