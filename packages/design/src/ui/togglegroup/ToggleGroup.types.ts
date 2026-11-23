import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Visueller Stil der Items (entspricht den Varianten des Toggles) */
export type ToggleGroupVariant = "default" | "outline";

/** Grösse der Items (entspricht den Grössen des Toggles) */
export type ToggleGroupSize = "default" | "sm" | "lg";

/** Ausrichtung der Gruppe */
export type ToggleGroupOrientation = "horizontal" | "vertical";

/** Signal-State einer Toggle Group */
export interface ToggleGroupSignals {
  /** Werte aller gedrückten Items (bei einfacher Auswahl höchstens ein Eintrag) */
  value: string[];
  /** Ob die gesamte Gruppe deaktiviert ist */
  disabled: boolean;
  /** Zuletzt gemeldeter Wert als JSON-String (für onValueChange; mit "_" beginnende Signale gehen nicht an den Server) */
  _last: string;
}

export interface ToggleGroupArgs {
  /**
   * ID der Gruppe. Die Items verweisen mit `groupId` darauf.
   * Ohne Angabe wird eine Zufalls-ID erzeugt (dann lassen sich Items nicht verknüpfen, daher in der Praxis setzen).
   */
  id?: string;
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Visueller Stil der Items. Muss zu den Items passen (siehe ToggleGroupItemArgs) */
  variant?: ToggleGroupVariant;
  /** Grösse der Items. Muss zu den Items passen */
  size?: ToggleGroupSize;
  /** Abstand zwischen den Items in Spacing-Einheiten (Standard: 2; 0 ergibt die verbundene Darstellung) */
  spacing?: number;
  /** Ausrichtung (Standard: "horizontal") */
  orientation?: ToggleGroupOrientation;
  /** Wenn true, können mehrere Items gleichzeitig gedrückt sein (Standard: false, genau ein Item) */
  multiple?: boolean;
  /** Anfangs gedrückte Items (Werte der Items) */
  value?: string[];
  /** Deaktiviert die gesamte Gruppe */
  disabled?: boolean;
  /** Ob der Tastaturfokus am Ende wieder am Anfang beginnt (Standard: true) */
  loop?: boolean;
  /**
   * Datastar-Aktion, die ausgeführt wird, wenn sich die Auswahl ändert,
   * z. B. "@post('/settings', {contentType: 'json'})". Der aktuelle Wert steht in `$<id>.value`.
   */
  onValueChange?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
  /** Inhalt der Gruppe (ToggleGroupItem) */
  children?: Children;
}

export interface ToggleGroupItemArgs {
  /** Pflicht: ID der zugehörigen Gruppe (ToggleGroupArgs.id) */
  groupId: string;
  /** Pflicht: Wert des Items, landet beim Drücken in `$<groupId>.value` */
  value: string;
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /**
   * Visueller Stil. In React kommt er aus dem Kontext der Gruppe, hier muss er (wie `size` und `spacing`)
   * mit den Werten der Gruppe übereinstimmen. Standard: "default"
   */
  variant?: ToggleGroupVariant;
  /** Grösse (muss mit der Gruppe übereinstimmen, Standard: "default") */
  size?: ToggleGroupSize;
  /** Abstand der Gruppe (muss mit der Gruppe übereinstimmen, Standard: 2) */
  spacing?: number;
  /** Deaktiviert dieses Item */
  disabled?: boolean;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben, z. B. aria-label für Icon-Items) */
  attributes?: HtmlAttributes;
  /** Inhalt des Items (Text und/oder Icon) */
  children?: Children;
}
