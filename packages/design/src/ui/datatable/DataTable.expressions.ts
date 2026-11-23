import { buildAnchorStyle, buildPositionAnchorStyle } from "../../utils/AnchorStyle";
import { cn } from "../../utils/cn";
import { newExpression } from "../../utils/DatastarExpression";
import { escapeHtml } from "../../utils/escapeHtml";
import { getAnchorPosition, type AnchorAlign } from "../../utils/getAnchorPosition";
import { createSignals } from "../../utils/SignalManager";
import { tw } from "../../utils/tw";
import { Icon, type IconName } from "../icon";
import type {
    DataTableColumnMeta,
    DataTableLabels,
    DataTableSignals,
    DataTableSortType,
} from "./DataTable.types";

/**
 * Datastar-Expressions und interne Bausteine der Data Table.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 *
 * Wichtig für alle Expressions: Datastar teilt den Ausdruck an ";" und Zeilenumbrüchen in Statements und gibt
 * das letzte zurück. Deshalb steht in jedem Statement höchstens ein vollständiger Ausdruck, ohne ";" in Strings
 * und ohne Blöcke, die über mehrere Statements laufen.
 */

export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 25, 30, 40, 50];

/** Texte der Data Table (englisch, wie in den shadcn-Docs) */
export const defaultDataTableLabels: DataTableLabels = {
  noResults: "No results.",
  viewOptions: "View",
  toggleColumns: "Toggle columns",
  openMenu: "Open menu",
  actions: "Actions",
  sortAsc: "Asc",
  sortDesc: "Desc",
  hide: "Hide",
  selectAll: "Select all",
  selectRow: "Select row",
  previous: "Previous",
  next: "Next",
  rowsPerPage: "Rows per page",
  page: "Page {page} of {pages}",
  rowsSelected: "{selected} of {total} row(s) selected.",
  goToFirstPage: "Go to first page",
  goToPreviousPage: "Go to previous page",
  goToNextPage: "Go to next page",
  goToLastPage: "Go to last page",
};

export function resolveLabels(labels?: Partial<DataTableLabels>): DataTableLabels {
  return { ...defaultDataTableLabels, ...labels };
}

// ---------------------------------------------------------------------------
// IDs und Signale
// ---------------------------------------------------------------------------

/** Zufällige ID: <prefix>_<8 Hex-Zeichen> */
export function randomId(prefix: string): string {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return `${prefix}_${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

/**
 * Bereinigt IDs, die als Teil von Attributnamen (data-v-<id>), Selektoren und Signal-Schlüsseln dienen:
 * erlaubt sind Buchstaben, Ziffern, "_" und "-".
 */
export function toSafeToken(value: string): string {
  return value.replace(/[^A-Za-z0-9_-]/g, "_");
}

/** Bereinigte Spalten-ID (id, sonst accessorKey) */
export function columnIdOf(column: DataTableColumnMeta): string {
  const raw = column.id ?? column.accessorKey;
  if (!raw) throw new Error("DataTable: Jede Spalte braucht eine id oder einen accessorKey.");
  return toSafeToken(raw);
}

/** Text einer Spalte für Menüs: label, sonst Text von header, sonst die ID */
export function columnLabelOf(column: DataTableColumnMeta): string {
  if (column.label) return column.label;
  if (typeof column.header === "string" && column.header) return column.header;
  return columnIdOf(column);
}

/** Spalte lässt sich ausblenden: standardmäßig Spalten mit accessorKey */
export function isColumnHideable(column: DataTableColumnMeta): boolean {
  return column.hideable ?? Boolean(column.accessorKey);
}

/** Wert einer Zelle als Attributwert (für Filter und Sortierung) */
export function toSortValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object") return "";
  return String(value);
}

/** Anfangszustand der Signale; ausgeblendete Spalten und alle Spalten-IDs stehen von Anfang an darin */
export function buildInitialSignals(options: {
  columnIds: string[];
  hiddenColumns?: string[];
  pageSize?: number;
  pageCount?: number;
  filteredCount?: number;
}): DataTableSignals {
  const hiddenSet = new Set((options.hiddenColumns ?? []).map(toSafeToken));

  return {
    filter: "",
    sortKey: "",
    sortDesc: false,
    pageIndex: 0,
    pageSize: options.pageSize ?? DEFAULT_PAGE_SIZE,
    pageCount: options.pageCount ?? 1,
    filteredCount: options.filteredCount ?? 0,
    selectedCount: 0,
    hidden: Object.fromEntries(options.columnIds.map((columnId) => [columnId, hiddenSet.has(columnId)])),
    tick: 0,
  };
}

/** Signal-Manager einer Data Table (Signal-Name = ID mit "-" zu "_") */
export const dataTableSignals = (
  tableId: string,
  initial: DataTableSignals = buildInitialSignals({ columnIds: [] })
) => createSignals<DataTableSignals>(tableId, initial);

// ---------------------------------------------------------------------------
// Marker-Attribute (werden vom Effekt und von den Handlern per Selektor gesucht)
// ---------------------------------------------------------------------------

const SELECT_ROW_SELECTOR = "[data-dt-select-row]";
const SELECT_ALL_SELECTOR = "[data-dt-select-all]";

/** Attributwert für den Wert einer Zelle: data-v-<Spalten-ID> */
export const valueAttribute = (columnId: string): string => `data-v-${columnId}`;

// ---------------------------------------------------------------------------
// Datastar-Expressions
// ---------------------------------------------------------------------------

/**
 * Effekt der Tabelle (data-effect am Wrapper). Er läuft bei jeder Änderung von Filter, Sortierung, Seite,
 * Seitengröße, Spaltensichtbarkeit und Auswahl (tick) und
 * - blendet Spalten aus,
 * - filtert, sortiert (die Zeilen werden im DOM umgehängt) und schneidet die aktuelle Seite aus,
 * - setzt data-state="selected" an gewählten Zeilen und den Zustand der Kopf-Checkbox,
 * - schreibt pageCount, pageIndex (begrenzt), filteredCount und selectedCount in die Signale.
 *
 * Jedes Statement steht auf einer Zeile ohne ";" (siehe Hinweis oben).
 */
export function buildDataTableEffect(
  tableId: string,
  options: {
    columnIds: string[];
    sortTypes: Record<string, DataTableSortType>;
    filterColumnId?: string;
  }
): string {
  const s = dataTableSignals(tableId);
  const expression = newExpression();

  expression.statement("const root = el");
  expression.statement("const body = root.querySelector('[data-dt-body]')");
  expression.statement("const all = Array.from(body.querySelectorAll('[data-dt-row]'))");

  // Spalten ein- und ausblenden: pro Spalte ein Statement, damit die Signale einzeln beobachtet werden
  for (const columnId of options.columnIds) {
    expression.statement(
      `root.querySelectorAll('[data-dt-col="${columnId}"]').forEach(cell => cell.hidden = !!${s.signal("hidden")}["${columnId}"])`
    );
  }

  expression.statement(`const q = String(${s.signal("filter")} || '').toLowerCase()`);
  expression.statement(`const key = ${s.signal("sortKey")}`);
  expression.statement(`const dir = ${s.signal("sortDesc")} ? -1 : 1`);
  expression.statement(`const size = Math.max(1, Number(${s.signal("pageSize")}) || ${DEFAULT_PAGE_SIZE})`);
  expression.statement(`const tick = ${s.signal("tick")}`);
  expression.statement(`const types = ${JSON.stringify(options.sortTypes)}`);
  expression.statement("const val = (r, k) => r.getAttribute('data-v-' + k) || ''");
  expression.statement("const idx = r => Number(r.getAttribute('data-dt-index'))");
  expression.statement(
    "const cmp = (a, b) => (key ? dir * (types[key] === 'number' ? Number(val(a, key)) - Number(val(b, key)) : val(a, key).localeCompare(val(b, key), undefined, {numeric: true, sensitivity: 'base'})) : 0) || idx(a) - idx(b)"
  );
  expression.statement(
    `const hit = all.filter(r => !q || val(r, ${JSON.stringify(options.filterColumnId ?? "")}).toLowerCase().includes(q))`
  );
  expression.statement("const sorted = hit.slice().sort(cmp)");
  expression.statement("const pages = Math.max(1, Math.ceil(sorted.length / size))");
  expression.statement(`const page = Math.min(Math.max(0, Number(${s.signal("pageIndex")}) || 0), pages - 1)`);
  expression.statement("const rows = sorted.slice(page * size, page * size + size)");

  // Reihenfolge im DOM nur ändern, wenn sie abweicht (sonst geht der Fokus einer Checkbox verloren)
  expression.statement("const order = all.slice().sort(cmp)");
  expression.statement("const cur = Array.from(body.children).filter(r => r.hasAttribute('data-dt-row'))");
  expression.statement("order.some((r, i) => r !== cur[i]) && order.forEach(r => body.appendChild(r))");

  // Leere Zeile: sichtbar, wenn nichts übrig bleibt, und immer am Ende
  expression.statement("const empty = body.querySelector('[data-dt-empty]')");
  expression.statement(
    "empty && (empty.hidden = sorted.length > 0, empty !== body.lastElementChild && body.appendChild(empty))"
  );
  expression.statement("all.forEach(r => r.hidden = !rows.includes(r))");

  // Auswahl: Zeilen markieren, Kopf-Checkbox und Zähler aktualisieren
  expression.statement(`const checked = r => !!(r.querySelector('${SELECT_ROW_SELECTOR}') || {}).checked`);
  expression.statement(
    "all.forEach(r => checked(r) ? r.setAttribute('data-state', 'selected') : r.removeAttribute('data-state'))"
  );
  expression.statement(`const head = root.querySelector('${SELECT_ALL_SELECTOR}')`);
  expression.statement("const on = rows.filter(checked).length");
  expression.statement(
    "head && (head.checked = rows.length > 0 && on === rows.length, head.indeterminate = on > 0 && on < rows.length)"
  );

  expression.statement(s.set("pageCount", "pages"));
  expression.statement(s.set("pageIndex", "page"));
  expression.statement(s.set("filteredCount", "sorted.length"));
  expression.statement(s.set("selectedCount", "hit.filter(checked).length"));

  // Das letzte Statement wird von Datastar zurückgegeben
  expression.statement("void 0");

  return expression.build();
}

/**
 * Änderung einer Checkbox (change-Event am Wrapper): Die Kopf-Checkbox setzt alle Zeilen der aktuellen Seite,
 * danach läuft der Effekt über tick neu.
 */
export function buildSelectionChangeHandler(tableId: string): string {
  const s = dataTableSignals(tableId);

  return newExpression()
    .statement(
      `evt.target.matches('${SELECT_ALL_SELECTOR}') && Array.from(el.querySelectorAll('[data-dt-row]:not([hidden]) ${SELECT_ROW_SELECTOR}')).forEach(c => c.checked = evt.target.checked)`
    )
    .statement(
      `evt.target.matches('${SELECT_ALL_SELECTOR}, ${SELECT_ROW_SELECTOR}') && (${s.set("tick", `${s.signal("tick")} + 1`)})`
    )
    .build();
}

/** Eingabe im Filter: Text setzen und auf die erste Seite springen */
export function buildFilterHandler(tableId: string): string {
  const s = dataTableSignals(tableId);

  return newExpression().statement(s.set("filter", "evt.target.value")).statement(s.set("pageIndex", "0")).build();
}

/**
 * Sortier-Button: wie toggleSorting(column.getIsSorted() === "asc") in TanStack Table.
 * Erst aufsteigend, beim zweiten Klick absteigend, beim dritten wieder aufsteigend.
 */
export function buildToggleSortHandler(tableId: string, columnId: string): string {
  const s = dataTableSignals(tableId);
  const column = JSON.stringify(columnId);

  return newExpression()
    .statement(s.set("sortDesc", `(${s.signal("sortKey")} === ${column} && !${s.signal("sortDesc")})`))
    .statement(s.set("sortKey", column))
    .statement(s.set("pageIndex", "0"))
    .build();
}

/** Sortier-Menü: feste Richtung */
export function buildSortHandler(tableId: string, columnId: string, desc: boolean): string {
  const s = dataTableSignals(tableId);

  return newExpression()
    .statement(s.set("sortKey", JSON.stringify(columnId)))
    .statement(s.set("sortDesc", String(desc)))
    .statement(s.set("pageIndex", "0"))
    .build();
}

/** Spalte ausblenden */
export function buildHideColumnHandler(tableId: string, columnId: string): string {
  const s = dataTableSignals(tableId);

  return `${s.signal("hidden")}[${JSON.stringify(columnId)}] = true`;
}

/** Spalte ein- oder ausblenden (Spaltenauswahl) */
export function buildToggleColumnHandler(tableId: string, columnId: string): string {
  const s = dataTableSignals(tableId);
  const ref = `${s.signal("hidden")}[${JSON.stringify(columnId)}]`;

  return `${ref} = !${ref}`;
}

/** Bedingung für ein sichtbares Spalten-Häkchen */
export function buildColumnVisibleCondition(tableId: string, columnId: string): string {
  const s = dataTableSignals(tableId);

  return `!${s.signal("hidden")}[${JSON.stringify(columnId)}]`;
}

/** Zeilen pro Seite ändern und auf die erste Seite springen */
export function buildPageSizeHandler(tableId: string): string {
  const s = dataTableSignals(tableId);

  return newExpression()
    .statement(s.set("pageSize", "Number(evt.target.value)"))
    .statement(s.set("pageIndex", "0"))
    .build();
}

/** Seitenwechsel */
export function buildFirstPageHandler(tableId: string): string {
  return dataTableSignals(tableId).set("pageIndex", "0");
}

export function buildPreviousPageHandler(tableId: string): string {
  const s = dataTableSignals(tableId);

  return s.set("pageIndex", `Math.max(0, ${s.signal("pageIndex")} - 1)`);
}

export function buildNextPageHandler(tableId: string): string {
  const s = dataTableSignals(tableId);

  return s.set("pageIndex", `Math.min(${s.signal("pageCount")} - 1, ${s.signal("pageIndex")} + 1)`);
}

export function buildLastPageHandler(tableId: string): string {
  const s = dataTableSignals(tableId);

  return s.set("pageIndex", `${s.signal("pageCount")} - 1`);
}

/** Bedingungen für deaktivierte Seiten-Buttons (data-attr:disabled) */
export function buildCanPreviousCondition(tableId: string): string {
  return `${dataTableSignals(tableId).signal("pageIndex")} <= 0`;
}

export function buildCanNextCondition(tableId: string): string {
  const s = dataTableSignals(tableId);

  return `${s.signal("pageIndex")} >= ${s.signal("pageCount")} - 1`;
}

/** Bedingungen für das Sortier-Icon: unsortiert, aufsteigend, absteigend */
export function buildSortStateConditions(tableId: string, columnId: string): { none: string; asc: string; desc: string } {
  const s = dataTableSignals(tableId);
  const isColumn = `${s.signal("sortKey")} === ${JSON.stringify(columnId)}`;

  return {
    none: `${s.signal("sortKey")} !== ${JSON.stringify(columnId)}`,
    asc: `${isColumn} && !${s.signal("sortDesc")}`,
    desc: `${isColumn} && ${s.signal("sortDesc")}`,
  };
}

/** Auswahlzähler und Seitenzähler: Signal-Referenzen für data-text */
export function buildCountReference(tableId: string, property: "selectedCount" | "filteredCount" | "pageCount"): string {
  return dataTableSignals(tableId).signal(property);
}

export function buildPageNumberReference(tableId: string): string {
  return `${dataTableSignals(tableId).signal("pageIndex")} + 1`;
}

/** Ersetzt {name}-Platzhalter in einem (bereits escapten) Text durch fertiges HTML */
export function renderTemplate(label: string, replacements: Record<string, string>): string {
  return Object.entries(replacements).reduce(
    (text, [name, html]) => text.replaceAll(`{${name}}`, html),
    escapeHtml(label)
  );
}

/** Zähler als <span data-text>, der Anfangswert steht für den ersten Render schon darin */
export function renderCounter(reference: string, initial: number): string {
  return `<span data-text="${escapeHtml(reference)}">${initial}</span>`;
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

/**
 * Einziger Zugriff auf renderIcon in dieser Komponente: Signatur und Icon-Namen (Lucide) gegen den zentralen
 * Icon-Ordner prüfen. Verwendet werden: arrow-up, arrow-down, chevrons-up-down, eye-off, ellipsis, settings-2,
 * check, chevron-left, chevron-right, chevrons-left, chevrons-right, chevron-down.
 */
export function dataTableIcon(name: IconName, className?: string): string {
  return Icon({ name: name, class: className});
}

/** Icon, das nur bei erfüllter Bedingung sichtbar ist (data-show); Startzustand per display: none */
export function renderConditionalIcon(name: IconName, condition: string, visible: boolean, className?: string): string {
  const style = visible ? "" : ' style="display: none;"';

  return `<span class="contents" data-show="${escapeHtml(condition)}"${style}>${dataTableIcon(name, className)}</span>`;
}

// ---------------------------------------------------------------------------
// Checkboxen (native Inputs; bei einer portierten Checkbox-Komponente hier ersetzen)
// ---------------------------------------------------------------------------

const checkboxTw = tw`size-4 shrink-0 cursor-pointer rounded-sm align-middle accent-primary disabled:cursor-not-allowed disabled:opacity-50`;

export function renderSelectCheckbox(kind: "all" | "row", label: string): string {
  const marker = kind === "all" ? "data-dt-select-all" : "data-dt-select-row";

  return `<input type="checkbox" ${marker} data-slot="checkbox" aria-label="${escapeHtml(label)}" class="${escapeHtml(checkboxTw)}">`;
}

// ---------------------------------------------------------------------------
// Menü auf Basis der nativen Popover API (Ersatz für DropdownMenu)
// ---------------------------------------------------------------------------

/** Name für CSS Anchor Positioning: nur Zeichen, die in einem dashed-ident erlaubt sind */
const anchorNameOf = (menuId: string): string => toSafeToken(menuId);

/** Attribute des Triggers: öffnet das Popover und ist der Anker */
export function buildMenuTriggerAttributes(menuId: string): Record<string, string> {
  return {
    popovertarget: menuId,
    "aria-haspopup": "menu",
    style: buildAnchorStyle(anchorNameOf(menuId)),
  };
}

const menuContentTw = tw`ring-foreground/10 bg-popover text-popover-foreground m-0 inset-auto min-w-32 overflow-x-hidden overflow-y-auto rounded-md p-1 shadow-md ring-1 outline-none`;

const menuItemTw = tw`group/dropdown-menu-item relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10 data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:hover:bg-destructive/20 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:*:[svg]:text-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`;

const menuCheckboxItemTw = tw`relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-left text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`;

const menuLabelTw = tw`text-muted-foreground px-2 py-1.5 text-xs font-medium`;

const menuSeparatorTw = tw`bg-border -mx-1 my-1 h-px`;

/** Statement, das das Menü schließt, in dem das angeklickte Element liegt */
const CLOSE_MENU_STATEMENT = "el.closest('[popover]').hidePopover()";

/** Menü-Panel: Popover, per CSS Anchor Positioning unter dem Trigger ausgerichtet */
export function renderMenu(args: {
  id: string;
  align?: AnchorAlign;
  class?: string;
  children: string;
}): string {
  const style = [
    "position: absolute",
    buildPositionAnchorStyle(anchorNameOf(args.id)),
    "z-index: 50",
    getAnchorPosition("bottom", args.align ?? "start", 4),
  ].join("; ");

  // anchor-positioned: wie bei Popover und Tooltip; die Klasse muss im CSS des Pakets existieren
  const classes = cn(menuContentTw, "anchor-positioned", args.class);

  return `<div id="${escapeHtml(args.id)}" popover="auto" role="menu" data-slot="dropdown-menu-content" class="${escapeHtml(classes)}" style="${escapeHtml(style)}">${args.children}</div>`;
}

/** Menüeintrag: schließt das Menü und führt dann `onClick` aus */
export function renderMenuItem(args: {
  label: string;
  icon?: IconName;
  onClick?: string;
  variant?: "default" | "destructive";
}): string {
  const handler = newExpression().statement(CLOSE_MENU_STATEMENT).statement(args.onClick ?? "").build();
  const icon = args.icon ? dataTableIcon(args.icon) : "";

  return `<button type="button" role="menuitem" data-slot="dropdown-menu-item" data-variant="${args.variant ?? "default"}" class="${escapeHtml(menuItemTw)}" data-on:click="${escapeHtml(handler)}">${icon}${escapeHtml(args.label)}</button>`;
}

/** Menüeintrag mit Häkchen rechts (bleibt beim Klick geöffnet, wie das CheckboxItem von shadcn) */
export function renderMenuCheckboxItem(args: {
  label: string;
  checkedCondition: string;
  checked: boolean;
  onClick: string;
  class?: string;
}): string {
  const classes = cn(menuCheckboxItemTw, args.class);
  const indicatorStyle = args.checked ? "" : ' style="display: none;"';

  // ToDo: Icon "check"
  return `<button type="button" role="menuitemcheckbox" aria-checked="${args.checked}" data-slot="dropdown-menu-checkbox-item" class="${escapeHtml(classes)}" data-attr:aria-checked="${escapeHtml(args.checkedCondition)}" data-on:click="${escapeHtml(args.onClick)}"><span class="pointer-events-none absolute right-2 flex items-center justify-center" data-slot="dropdown-menu-checkbox-item-indicator" data-show="${escapeHtml(args.checkedCondition)}"${indicatorStyle}>${dataTableIcon("check")}</span>${escapeHtml(args.label)}</button>`;
}

export function renderMenuLabel(label: string): string {
  return `<div data-slot="dropdown-menu-label" class="${escapeHtml(menuLabelTw)}">${escapeHtml(label)}</div>`;
}

export function renderMenuSeparator(): string {
  return `<div role="separator" data-slot="dropdown-menu-separator" class="${escapeHtml(menuSeparatorTw)}"></div>`;
}

// ---------------------------------------------------------------------------
// Natives Select für "Rows per page" (Klassen aus native-select, Style vega)
// ---------------------------------------------------------------------------

export const nativeSelectWrapperTw = tw`group/native-select relative w-fit has-[select:disabled]:opacity-50`;

export const nativeSelectTw = tw`border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 h-9 w-full min-w-0 appearance-none rounded-md border bg-transparent py-1 pr-8 pl-2.5 text-sm shadow-xs transition-[color,box-shadow] select-none focus-visible:ring-3 aria-invalid:ring-3 data-[size=sm]:h-8 outline-none disabled:pointer-events-none disabled:cursor-not-allowed`;

export const nativeSelectIconTw = tw`text-muted-foreground top-1/2 right-2.5 size-4 -translate-y-1/2 pointer-events-none absolute select-none`;
