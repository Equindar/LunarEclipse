import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Ausrichtung der Panel-Gruppe: "horizontal" ordnet die Panels nebeneinander an, "vertical" untereinander */
export type ResizableOrientation = "horizontal" | "vertical";

/**
 * Grösse eines Panels in Prozent, als Zahl (50) oder als String ("50%").
 * Pixel-Angaben werden nicht unterstützt. Anders als bei react-resizable-panels v4 bedeutet eine Zahl hier Prozent.
 */
export type ResizableSize = number | `${number}%`;

/** Signal-State eines Handles (nur der Drag-Zustand, die Grössen selbst liegen im DOM) */
export interface ResizableHandleSignals {
  /** Ob der Handle gerade gezogen wird */
  dragging: boolean;
  /** Zeigerposition (clientX bzw. clientY) beim Start des Ziehens */
  startPos: number;
  /** Grösse des Panels vor dem Handle beim Start des Ziehens (Pixel) */
  startA: number;
  /** Grösse des Panels nach dem Handle beim Start des Ziehens (Pixel) */
  startB: number;
}

export interface ResizablePanelGroupArgs {
  /** Ausrichtung der Gruppe (Standard: "horizontal") */
  orientation?: ResizableOrientation;
  /** Optional: ID des Gruppen-Elements */
  id?: string;
  /** Zusätzliche CSS-Klassen, z. B. "max-w-md rounded-lg border" */
  class?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben, `data-slot` darf sie ersetzen) */
  attributes?: HtmlAttributes;
  /** Panels und Handles im Wechsel: Panel, Handle, Panel, ... */
  children?: Children;
}

export interface ResizablePanelArgs {
  /** Optional: ID des Panel-Elements */
  id?: string;
  /**
   * Startgrösse in Prozent. Panels ohne Angabe teilen sich den Rest der Gruppe zu gleichen Teilen
   * (wird beim Laden von Datastar berechnet, davor gilt flex-grow 1).
   */
  defaultSize?: ResizableSize;
  /** Mindestgrösse in Prozent des Gruppenplatzes (Standard: 0) */
  minSize?: ResizableSize;
  /** Maximalgrösse in Prozent des Gruppenplatzes (Standard: 100) */
  maxSize?: ResizableSize;
  class?: string;
  attributes?: HtmlAttributes;
  /** Inhalt des Panels */
  children?: Children;
}

export interface ResizableHandleArgs {
  /**
   * Optional: ID des Handles. Sie dient auch als Basis für den Signal-Namen ("-" wird zu "_").
   * Ohne Angabe wird bei jedem Rendern eine Zufalls-ID erzeugt (resizable_<8 hex>).
   */
  id?: string;
  /**
   * Ausrichtung der umgebenden Gruppe (Standard: "horizontal"). Muss zur ResizablePanelGroup passen,
   * weil es hier keinen React-Context gibt. Der Handle selbst steht senkrecht dazu (aria-orientation).
   */
  orientation?: ResizableOrientation;
  /** Zeigt einen sichtbaren Griff in der Mitte des Handles */
  withHandle?: boolean;
  class?: string;
  attributes?: HtmlAttributes;
}
