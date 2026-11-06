import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

export type TabsOrientation = "horizontal" | "vertical";

export type TabsListVariant = "default" | "line";

/**
 * Signal-State eines Tabs-Blocks.
 * Das Signal kann auch von aussen gesetzt werden (z. B. `$<id>.value = "analytics"`),
 * das ersetzt das kontrollierte `value`/`onValueChange` der React-Vorlage.
 */
export interface TabsSignals {
  /** Wert des aktiven Tabs (leer: kein Tab aktiv) */
  value: string;
}

export interface TabsArgs {
  /** Pflicht: ID des Tabs-Blocks. Trigger und Content verweisen mit `tabsId` darauf */
  id: string;
  /** Wert des initial aktiven Tabs. Ohne Angabe ist zunächst kein Tab aktiv (Base UI wählt dort den ersten) */
  defaultValue?: string;
  /** Ausrichtung (Standard: "horizontal") */
  orientation?: TabsOrientation;
  class?: string;
  attributes?: HtmlAttributes;
  /** TabsList und TabsContent */
  children?: Children;
}

export interface TabsListArgs {
  /** Darstellung (Standard: "default") */
  variant?: TabsListVariant;
  class?: string;
  attributes?: HtmlAttributes;
  /** TabsTrigger */
  children?: Children;
}

export interface TabsTriggerArgs {
  /** Pflicht: ID des Tabs-Blocks (Wert von TabsArgs.id) */
  tabsId: string;
  /** Pflicht: Wert des Tabs, muss zu einem TabsContent passen */
  value: string;
  /** Ob der Tab deaktiviert ist */
  disabled?: boolean;
  class?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}

export interface TabsContentArgs {
  /** Pflicht: ID des Tabs-Blocks (Wert von TabsArgs.id) */
  tabsId: string;
  /** Pflicht: Wert des zugehörigen Tabs */
  value: string;
  class?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}
