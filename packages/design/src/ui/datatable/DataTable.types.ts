import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Eine Datenzeile; Werte werden über `accessorKey` gelesen */
export type DataTableRow = Record<string, unknown>;

/** Ausrichtung des Spalteninhalts */
export type DataTableAlign = "left" | "center" | "right";

/** Vergleichsart beim Sortieren: "text" (alphanumerisch, ohne Groß-/Kleinschreibung) oder "number" */
export type DataTableSortType = "text" | "number";

/**
 * Darstellung der Seitensteuerung:
 * - "none": keine Seiten, alle Zeilen werden angezeigt
 * - "simple": Previous und Next (Schritt "Pagination" der Docs)
 * - "full": Zeilen pro Seite, Seitenzähler und vier Buttons (Reusable Component "Pagination")
 */
export type DataTablePaginationMode = "none" | "simple" | "full";

/**
 * Signal-State einer Data Table (Signal-Name = ID mit "-" zu "_").
 * Die Felder "pageCount", "filteredCount" und "selectedCount" werden vom Effekt der Tabelle berechnet.
 */
export interface DataTableSignals {
  /** Filtertext (gilt für die Filter-Spalte) */
  filter: string;
  /** ID der sortierten Spalte, leer bedeutet unsortiert */
  sortKey: string;
  /** Absteigend sortieren */
  sortDesc: boolean;
  /** Aktuelle Seite (beginnt bei 0) */
  pageIndex: number;
  /** Zeilen pro Seite */
  pageSize: number;
  /** Berechnet: Anzahl der Seiten nach dem Filtern */
  pageCount: number;
  /** Berechnet: Anzahl der Zeilen nach dem Filtern */
  filteredCount: number;
  /** Berechnet: Anzahl der ausgewählten Zeilen (nach dem Filtern) */
  selectedCount: number;
  /** Ausgeblendete Spalten (Spalten-ID zu true) */
  hidden: Record<string, boolean>;
  /** Zähler, der bei Änderungen der Auswahl erhöht wird, damit der Effekt neu läuft */
  tick: number;
}

/** Texte der Data Table (Standard: englisch wie in den shadcn-Docs) */
export interface DataTableLabels {
  /** Hinweis bei leerer Tabelle */
  noResults: string;
  /** Text des Buttons für die Spaltenauswahl */
  viewOptions: string;
  /** Überschrift im Menü der Spaltenauswahl */
  toggleColumns: string;
  /** Aria-Label des Menü-Buttons einer Zeile */
  openMenu: string;
  /** Überschrift im Zeilen-Menü ("Actions") */
  actions: string;
  /** Spaltenmenü: aufsteigend */
  sortAsc: string;
  /** Spaltenmenü: absteigend */
  sortDesc: string;
  /** Spaltenmenü: Spalte ausblenden */
  hide: string;
  selectAll: string;
  selectRow: string;
  previous: string;
  next: string;
  rowsPerPage: string;
  /** Seitenzähler mit den Platzhaltern {page} und {pages} */
  page: string;
  /** Auswahlzähler mit den Platzhaltern {selected} und {total} */
  rowsSelected: string;
  goToFirstPage: string;
  goToPreviousPage: string;
  goToNextPage: string;
  goToLastPage: string;
}

/** Kontext für `header`-Funktionen */
export interface DataTableHeaderContext {
  /** ID der Tabelle */
  tableId: string;
  /** ID der Spalte (bereinigt: nur Buchstaben, Ziffern, "_" und "-") */
  columnId: string;
}

/** Kontext für `cell`-Funktionen */
export interface DataTableCellContext<TData extends DataTableRow = DataTableRow> {
  /** Die komplette Zeile (entspricht `row.original` in TanStack Table) */
  row: TData;
  /** Wert aus `accessorKey` (undefined bei Display-Spalten) */
  value: unknown;
  /** ID der Zeile */
  rowId: string;
  /** ID der Tabelle */
  tableId: string;
}

/** Spaltenangaben, die auch die Teilkomponenten brauchen (ohne Generics, damit sie sich frei übergeben lassen) */
export interface DataTableColumnMeta {
  /** Eindeutige Spalten-ID; ohne Angabe gilt `accessorKey` */
  id?: string;
  /** Schlüssel in der Datenzeile; ohne Schlüssel ist die Spalte eine Display-Spalte (z. B. Aktionen) */
  accessorKey?: string;
  /** Text für Menüs (Standard: Text von `header`, sonst die ID) */
  label?: string;
  /** Kopfzelle: Text (wird escaped) oder Funktion, die fertiges HTML liefert */
  header?: string | ((context: DataTableHeaderContext) => string);
  /** Spalte lässt sich ausblenden (Standard: true bei Spalten mit `accessorKey`) */
  hideable?: boolean;
}

export interface DataTableColumn<TData extends DataTableRow = DataTableRow>
  extends Omit<DataTableColumnMeta, "accessorKey"> {
  accessorKey?: keyof TData & string;
  /**
   * Zelle: Funktion, die fertiges HTML liefert (Werte darin selbst escapen).
   * Standard: der Wert aus `accessorKey` als escaped Text.
   */
  cell?: (context: DataTableCellContext<TData>) => string;
  /** Kopfzelle als Sortier-Button rendern (Standard: false) */
  sortable?: boolean;
  /** Mit `sortable`: Sortier-Menü (Asc, Desc, Hide) statt Umschalt-Button */
  headerMenu?: boolean;
  /** Vergleichsart beim Sortieren (Standard: "text") */
  sortType?: DataTableSortType;
  /** Ausrichtung von Kopf- und Datenzellen (Standard: links) */
  align?: DataTableAlign;
  /** Zusätzliche Klassen der Kopfzelle */
  headerClass?: string;
  /** Zusätzliche Klassen der Datenzellen */
  cellClass?: string;
}

export interface DataTableArgs<TData extends DataTableRow = DataTableRow> {
  /** ID der Tabelle; sie bestimmt den Signal-Namen (Standard: zufällig, "data_table_<8 hex>") */
  id?: string;
  columns: DataTableColumn<TData>[];
  data: TData[];
  /** Schlüssel für die Zeilen-ID (Standard: Index der Zeile) */
  rowId?: keyof TData & string;
  /** Spalte, die der Filter durchsucht; ohne Angabe gibt es keine Filter-Eingabe */
  filterColumn?: string;
  /** Platzhalter der Filter-Eingabe (Standard: "Filter...") */
  filterPlaceholder?: string;
  /** Button zum Ein- und Ausblenden von Spalten anzeigen (Standard: false) */
  viewOptions?: boolean;
  /** Spalten, die anfangs ausgeblendet sind (Spalten-IDs) */
  hiddenColumns?: string[];
  /** Spalte mit Checkboxen zur Zeilenauswahl und Auswahlzähler anzeigen (Standard: false) */
  selectable?: boolean;
  /** Seitensteuerung (Standard: "none") */
  pagination?: DataTablePaginationMode;
  /** Zeilen pro Seite (Standard: 10) */
  pageSize?: number;
  /** Auswahl im Dropdown "Rows per page" (Standard: 10, 20, 25, 30, 40, 50) */
  pageSizeOptions?: number[];
  /** Eigene Texte (z. B. deutsch); fehlende Einträge bleiben englisch */
  labels?: Partial<DataTableLabels>;
  /** Zusätzliche CSS-Klassen für den Wrapper */
  class?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
}

export interface DataTableColumnHeaderArgs {
  /** ID der Tabelle */
  id: string;
  /** ID der Spalte */
  columnId: string;
  /** Titel der Spalte (wird escaped) */
  title: string;
  /** Sortier-Menü (Asc, Desc, Hide) statt Umschalt-Button */
  menu?: boolean;
  /** Spalte lässt sich sortieren (Standard: true); sonst wird nur der Titel gerendert */
  sortable?: boolean;
  /** Mit `menu`: Eintrag "Hide" anzeigen (Standard: true) */
  hideable?: boolean;
  labels?: Partial<DataTableLabels>;
  class?: string;
  attributes?: HtmlAttributes;
}

export interface DataTablePaginationArgs {
  /** ID der Tabelle */
  id: string;
  /** "simple" (Previous und Next) oder "full" (Standard) */
  variant?: Exclude<DataTablePaginationMode, "none">;
  /** Anfangswert der Zeilen pro Seite, für den ersten Render (Standard: 10) */
  pageSize?: number;
  /** Anfangswert der Seitenanzahl, für den ersten Render (Standard: 1) */
  pageCount?: number;
  /** Anfangswert der gefilterten Zeilen, für den ersten Render (Standard: 0) */
  filteredCount?: number;
  /** Auswahlzähler anzeigen */
  selectable?: boolean;
  /** Mit "full": Auswahl im Dropdown "Rows per page" */
  pageSizeOptions?: number[];
  labels?: Partial<DataTableLabels>;
  class?: string;
  attributes?: HtmlAttributes;
}

export interface DataTableViewOptionsArgs {
  /** ID der Tabelle */
  id: string;
  columns: DataTableColumnMeta[];
  /** Anfangszustand: ausgeblendete Spalten (Spalten-IDs), für den ersten Render */
  hiddenColumns?: string[];
  labels?: Partial<DataTableLabels>;
  /** Zusätzliche Klassen des Buttons (Standard: "ml-auto hidden h-8 lg:flex") */
  class?: string;
  attributes?: HtmlAttributes;
}

/** Eintrag im Zeilen-Menü */
export type DataTableRowActionItem =
  | {
      type?: "item";
      label: string;
      /** Datastar-Expression, die beim Klick läuft (ein Ausdruck oder Statements mit ";") */
      onClick?: string;
      variant?: "default" | "destructive";
    }
  | { type: "label"; label: string }
  | { type: "separator" };

export interface DataTableRowActionsArgs {
  /** Eindeutige ID des Menüs (z. B. "<tabelle>-actions-<zeile>") */
  id: string;
  items: DataTableRowActionItem[];
  labels?: Partial<DataTableLabels>;
  class?: string;
  attributes?: HtmlAttributes;
  /** Zusätzliches Markup im Button (Standard: Icon "ellipsis") */
  children?: Children;
}
