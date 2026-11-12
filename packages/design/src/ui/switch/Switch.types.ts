import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Größe des Switches (data-size) */
export type SwitchSize = "default" | "sm";

/** Signal-State eines Switches */
export interface SwitchSignals {
  /** Ob der Switch eingeschaltet ist */
  checked: boolean;
}

export interface SwitchArgs {
  /**
   * ID des Buttons. Wird für `<label for="...">` und als Basis des Signal-Namens benötigt
   * ("-" wird im Signal-Namen zu "_"). Ohne Angabe wird eine Zufalls-ID erzeugt.
   */
  id?: string;
  /** Initialer Zustand (Standard: false) */
  checked?: boolean;
  /** Deaktiviert den Switch (setzt `disabled` und `data-disabled`) */
  disabled?: boolean;
  /** Markiert den Switch als ungültig (`aria-invalid="true"`) */
  invalid?: boolean;
  /**
   * Name für die Formular-Übermittlung. Wenn gesetzt, wird zusätzlich eine verborgene Checkbox
   * gerendert, die den Zustand mitsendet (eingeschaltet: `value`, ausgeschaltet: nichts).
   */
  name?: string;
  /** Wert, der bei eingeschaltetem Switch übermittelt wird (Standard des Browsers: "on"); nur mit `name` relevant */
  value?: string;
  /** Größe (Standard: "default") */
  size?: SwitchSize;
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /**
   * Datastar-Expression, die nach jedem Umschalten ausgeführt wird, z. B. `@post('/settings', {contentType: 'json'})`.
   * Das Signal ist dann bereits aktualisiert.
   */
  onCheckedChange?: string;
  /**
   * Zusätzliche HTML-Attribute des Buttons (werden von den Standard-Attributen überschrieben,
   * z. B. `data-slot`, `role`, `data-signals`, `data-attr`, `data-on:click`)
   */
  attributes?: HtmlAttributes;
}
