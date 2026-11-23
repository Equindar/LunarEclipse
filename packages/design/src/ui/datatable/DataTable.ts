import { cn } from "../../utils/cn";
import { escapeHtml } from "../../utils/escapeHtml";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import { Button } from "../button";
import { Input } from "../input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table";
import {
    buildCanNextCondition,
    buildCanPreviousCondition,
    buildColumnVisibleCondition,
    buildCountReference,
    buildDataTableEffect,
    buildFilterHandler,
    buildFirstPageHandler,
    buildHideColumnHandler,
    buildInitialSignals,
    buildLastPageHandler,
    buildMenuTriggerAttributes,
    buildNextPageHandler,
    buildPageNumberReference,
    buildPageSizeHandler,
    buildPreviousPageHandler,
    buildSelectionChangeHandler,
    buildSortHandler,
    buildSortStateConditions,
    buildToggleColumnHandler,
    buildToggleSortHandler,
    columnIdOf,
    columnLabelOf,
    dataTableIcon,
    dataTableSignals,
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZE_OPTIONS,
    isColumnHideable,
    nativeSelectIconTw,
    nativeSelectTw,
    nativeSelectWrapperTw,
    randomId,
    renderConditionalIcon,
    renderCounter,
    renderMenu,
    renderMenuCheckboxItem,
    renderMenuItem,
    renderMenuLabel,
    renderMenuSeparator,
    renderSelectCheckbox,
    renderTemplate,
    resolveLabels,
    toSafeToken,
    toSortValue,
    valueAttribute,
} from "./DataTable.expressions";
import type {
    DataTableAlign,
    DataTableArgs,
    DataTableColumn,
    DataTableColumnHeaderArgs,
    DataTablePaginationArgs,
    DataTableRow,
    DataTableRowActionsArgs,
    DataTableSortType,
    DataTableViewOptionsArgs,
} from "./DataTable.types";

/** Container um die Tabelle (Docs: "overflow-hidden rounded-md border") */
const tableContainerTw = tw`overflow-hidden rounded-md border`;

/** Klassen für die Ausrichtung von Kopf- und Datenzellen */
const alignTw: Record<DataTableAlign, string> = {
  left: "",
  center: "text-center",
  right: "text-right",
};

/** Nutzer-Attribute zuerst, danach die Standard-Attribute der Komponente */
const withDefaults = (userAttributes: HtmlAttributes | undefined, defaults: HtmlAttributes): HtmlAttributes => ({
  ...userAttributes,
  ...defaults,
});

// ---------------------------------------------------------------------------
// Spaltenkopf
// ---------------------------------------------------------------------------

/**
 * Sortierbarer Spaltenkopf (Reusable Component "Column header").
 * Ohne `menu` schaltet ein Klick die Sortierung um (aufsteigend, absteigend, aufsteigend ...),
 * mit `menu` öffnet sich ein Menü mit Asc, Desc und Hide.
 */
export function DataTableColumnHeader(args: DataTableColumnHeaderArgs): string {
  const labels = resolveLabels(args.labels);
  const columnId = toSafeToken(args.columnId);
  const wrapperClass = cn(args.class);

  if (args.sortable === false) {
    return `<div${renderAttributes(withDefaults(args.attributes, { class: wrapperClass || undefined }))}>${escapeHtml(args.title)}</div>`;
  }

  const states = buildSortStateConditions(args.id, columnId);
  const icons =
    renderConditionalIcon("chevrons-up-down", states.none, true) +
    renderConditionalIcon("arrow-up", states.asc, false) +
    renderConditionalIcon("arrow-down", states.desc, false);

  const content = `<span>${escapeHtml(args.title)}</span>${icons}`;
  const buttonClass = "-ml-3 h-8";

  if (!args.menu) {
    const button = Button({
      variant: "ghost",
      size: "sm",
      class: buttonClass,
      attributes: { "data-on:click": buildToggleSortHandler(args.id, columnId) },
      children: content,
    });

    return `<div${renderAttributes(withDefaults(args.attributes, { class: cn("flex items-center gap-2", args.class) }))}>${button}</div>`;
  }

  const menuId = `${args.id}-header-${columnId}`;

  const items = [
    renderMenuItem({ label: labels.sortAsc, icon: "arrow-up", onClick: buildSortHandler(args.id, columnId, false) }),
    renderMenuItem({ label: labels.sortDesc, icon: "arrow-down", onClick: buildSortHandler(args.id, columnId, true) }),
  ];

  if (args.hideable !== false) {
    items.push(
      renderMenuSeparator(),
      renderMenuItem({ label: labels.hide, icon: "eye-off", onClick: buildHideColumnHandler(args.id, columnId) })
    );
  }

  const trigger = Button({
    variant: "ghost",
    size: "sm",
    class: buttonClass,
    attributes: buildMenuTriggerAttributes(menuId),
    children: content,
  });

  return `<div${renderAttributes(withDefaults(args.attributes, { class: cn("flex items-center gap-2", args.class) }))}>${trigger}${renderMenu({ id: menuId, align: "start", children: items.join("") })}</div>`;
}

// ---------------------------------------------------------------------------
// Spaltenauswahl
// ---------------------------------------------------------------------------

/**
 * Button mit Menü zum Ein- und Ausblenden von Spalten (Reusable Component "Column toggle").
 * Liefert Trigger und Menü-Panel; das Panel ist ein Popover und kann an beliebiger Stelle im Wrapper stehen.
 */
export function DataTableViewOptions(args: DataTableViewOptionsArgs): string {
  const labels = resolveLabels(args.labels);
  const menuId = `${args.id}-view-options`;
  const hiddenSet = new Set((args.hiddenColumns ?? []).map(toSafeToken));

  const items = args.columns
    .filter(isColumnHideable)
    .map((column) => {
      const columnId = columnIdOf(column);

      return renderMenuCheckboxItem({
        label: columnLabelOf(column),
        class: "capitalize",
        checkedCondition: buildColumnVisibleCondition(args.id, columnId),
        checked: !hiddenSet.has(columnId),
        onClick: buildToggleColumnHandler(args.id, columnId),
      });
    });

  const trigger = Button({
    variant: "outline",
    size: "sm",
    class: args.class ?? "ml-auto hidden h-8 lg:flex",
    attributes: withDefaults(args.attributes, buildMenuTriggerAttributes(menuId)),
    children: dataTableIcon("settings-2") + escapeHtml(labels.viewOptions),
  });

  const content = renderMenuLabel(labels.toggleColumns) + renderMenuSeparator() + items.join("");

  return trigger + renderMenu({ id: menuId, align: "end", class: "w-[150px]", children: content });
}

// ---------------------------------------------------------------------------
// Zeilen-Menü
// ---------------------------------------------------------------------------

/** Menü-Button einer Zeile ("Open menu" mit Ellipsis) und Menü mit Einträgen (Abschnitt "Row Actions") */
export function DataTableRowActions(args: DataTableRowActionsArgs): string {
  const labels = resolveLabels(args.labels);

  const items = args.items
    .map((item) => {
      if (item.type === "separator") return renderMenuSeparator();
      if (item.type === "label") return renderMenuLabel(item.label);

      return renderMenuItem({ label: item.label, onClick: item.onClick, variant: item.variant });
    })
    .join("");

  const trigger = Button({
    variant: "ghost",
    class: cn("h-8 w-8 p-0", args.class),
    attributes: withDefaults(args.attributes, buildMenuTriggerAttributes(args.id)),
    children: [
      `<span class="sr-only">${escapeHtml(labels.openMenu)}</span>`,
      ...(args.children === undefined ? [dataTableIcon("ellipsis", "h-4 w-4")] : [args.children].flat()),
    ],
  });

  return trigger + renderMenu({ id: args.id, align: "end", children: items });
}

// ---------------------------------------------------------------------------
// Seitensteuerung
// ---------------------------------------------------------------------------

/** Auswahlzähler: "{selected} of {total} row(s) selected." mit Live-Zählern */
function renderSelectionSummary(args: DataTablePaginationArgs, selectedInitial: number): string {
  const labels = resolveLabels(args.labels);
  const text = renderTemplate(labels.rowsSelected, {
    selected: renderCounter(buildCountReference(args.id, "selectedCount"), selectedInitial),
    total: renderCounter(buildCountReference(args.id, "filteredCount"), args.filteredCount ?? 0),
  });

  return `<div class="flex-1 text-sm text-muted-foreground">${text}</div>`;
}

/** Button der Seitensteuerung mit Handler und deaktiviertem Zustand (zuerst serverseitig, dann per Datastar) */
function pageButton(options: {
  handler: string;
  disabledCondition: string;
  disabled: boolean;
  children: string;
  class?: string;
  icon?: boolean;
}): string {
  return Button({
    variant: "outline",
    size: options.icon ? "icon" : "sm",
    class: options.class,
    attributes: {
      "data-on:click": options.handler,
      "data-attr:disabled": options.disabledCondition,
      disabled: options.disabled,
    },
    children: options.children,
  });
}

/**
 * Seitensteuerung der Tabelle.
 * - "simple": Previous und Next
 * - "full" (Standard): Auswahlzähler, Zeilen pro Seite, Seitenzähler und Buttons für erste, vorige, nächste und letzte Seite
 */
export function DataTablePagination(args: DataTablePaginationArgs): string {
  const labels = resolveLabels(args.labels);
  const variant = args.variant ?? "full";
  const pageCount = args.pageCount ?? 1;
  const pageSize = args.pageSize ?? DEFAULT_PAGE_SIZE;

  const summary = args.selectable ? renderSelectionSummary(args, 0) : "";
  const canNextInitially = pageCount > 1;

  if (variant === "simple") {
    const buttons =
      pageButton({
        handler: buildPreviousPageHandler(args.id),
        disabledCondition: buildCanPreviousCondition(args.id),
        disabled: true,
        children: escapeHtml(labels.previous),
      }) +
      pageButton({
        handler: buildNextPageHandler(args.id),
        disabledCondition: buildCanNextCondition(args.id),
        disabled: !canNextInitially,
        children: escapeHtml(labels.next),
      });

    // Der Auswahlzähler (flex-1) schiebt die Buttons nach rechts, ohne Zähler sorgt justify-end dafür
    return `<div${renderAttributes(withDefaults(args.attributes, { "data-slot": "data-table-pagination", class: cn("flex items-center justify-end space-x-2 py-4", args.class) }))}>${summary}${buttons}</div>`;
  }

  const options = [...new Set([...(args.pageSizeOptions ?? DEFAULT_PAGE_SIZE_OPTIONS), pageSize])].sort((a, b) => a - b);

  const optionHtml = options
    .map(
      (option) =>
        `<option value="${option}" data-slot="native-select-option" class="bg-[Canvas] text-[CanvasText]"${option === pageSize ? " selected" : ""}>${option}</option>`
    )
    .join("");

  const select = `<div data-slot="native-select-wrapper" data-size="sm" class="${escapeHtml(cn(nativeSelectWrapperTw, "w-17.5"))}"><select data-slot="native-select" data-size="sm" aria-label="${escapeHtml(labels.rowsPerPage)}" class="${escapeHtml(nativeSelectTw)}" data-on:change="${escapeHtml(buildPageSizeHandler(args.id))}">${optionHtml}</select>${dataTableIcon("chevron-down", cn(nativeSelectIconTw))}</div>`;

  const pageText = renderTemplate(labels.page, {
    page: renderCounter(buildPageNumberReference(args.id), 1),
    pages: renderCounter(buildCountReference(args.id, "pageCount"), pageCount),
  });

  const buttons = [
    pageButton({
      handler: buildFirstPageHandler(args.id),
      disabledCondition: buildCanPreviousCondition(args.id),
      disabled: true,
      icon: true,
      class: "hidden size-8 lg:flex",
      children: `<span class="sr-only">${escapeHtml(labels.goToFirstPage)}</span>${dataTableIcon("chevrons-left")}`,
    }),
    pageButton({
      handler: buildPreviousPageHandler(args.id),
      disabledCondition: buildCanPreviousCondition(args.id),
      disabled: true,
      icon: true,
      class: "size-8",
      children: `<span class="sr-only">${escapeHtml(labels.goToPreviousPage)}</span>${dataTableIcon("chevron-left")}`,
    }),
    pageButton({
      handler: buildNextPageHandler(args.id),
      disabledCondition: buildCanNextCondition(args.id),
      disabled: !canNextInitially,
      icon: true,
      class: "size-8",
      children: `<span class="sr-only">${escapeHtml(labels.goToNextPage)}</span>${dataTableIcon("chevron-right")}`,
    }),
    pageButton({
      handler: buildLastPageHandler(args.id),
      disabledCondition: buildCanNextCondition(args.id),
      disabled: !canNextInitially,
      icon: true,
      class: "hidden size-8 lg:flex",
      children: `<span class="sr-only">${escapeHtml(labels.goToLastPage)}</span>${dataTableIcon("chevrons-right")}`,
    }),
  ].join("");

  const controls = `<div class="flex items-center space-x-6 lg:space-x-8"><div class="flex items-center space-x-2"><p class="text-sm font-medium">${escapeHtml(labels.rowsPerPage)}</p>${select}</div><div class="flex w-25 items-center justify-center text-sm font-medium">${pageText}</div><div class="flex items-center space-x-2">${buttons}</div></div>`;

  // Ohne Auswahlzähler stehen die Steuerelemente rechts (justify-end), sonst verteilt justify-between
  const layout = args.selectable ? "justify-between" : "justify-end";

  return `<div${renderAttributes(withDefaults(args.attributes, { "data-slot": "data-table-pagination", class: cn("flex items-center px-2", layout, args.class) }))}>${summary}${controls}</div>`;
}

// ---------------------------------------------------------------------------
// Data Table
// ---------------------------------------------------------------------------

/**
 * Kopfzelle einer Spalte: eigene header-Funktion, sonst Sortier-Button (bei `sortable`) oder Text.
 */
function renderHeaderContent<TData extends DataTableRow>(
  tableId: string,
  column: DataTableColumn<TData>,
  columnId: string,
  labels: DataTableArgs<TData>["labels"]
): string {
  if (typeof column.header === "function") {
    return column.header({ tableId, columnId });
  }

  const title = column.header ?? columnLabelOf(column);

  if (column.sortable) {
    return DataTableColumnHeader({
      id: tableId,
      columnId,
      title,
      menu: column.headerMenu,
      hideable: isColumnHideable(column),
      labels,
    });
  }

  return escapeHtml(title);
}

/**
 * Data Table: Tabelle mit Filter, Sortierung, Seiten, Spaltenauswahl und Zeilenauswahl.
 *
 * Port des Guides "Data Table" von shadcn/ui (Base). Dort ist die Data Table keine Komponente, sondern ein
 * Rezept auf Basis von TanStack Table. Dieser Port ersetzt TanStack Table durch einen Datastar-Effekt: Alle
 * Zeilen stehen im HTML, Filter, Sortierung und Seiten werden im Browser angewendet (funktioniert nur mit
 * geladenem Datastar). Der Zustand liegt in den Signalen der Tabelle (siehe `DataTableSignals`).
 */
export function DataTable<TData extends DataTableRow = DataTableRow>(args: DataTableArgs<TData>): string {
  const id = args.id ?? randomId("data_table");
  const labels = resolveLabels(args.labels);
  const pagination = args.pagination ?? "none";
  const selectable = args.selectable ?? false;
  const columns = args.columns;
  const columnIds = columns.map(columnIdOf);
  const hiddenSet = new Set((args.hiddenColumns ?? []).map(toSafeToken));

  const total = args.data.length;
  // Ohne Seitensteuerung gibt es nur eine Seite mit allen Zeilen
  const pageSize = pagination === "none" ? Math.max(1, total) : Math.max(1, args.pageSize ?? DEFAULT_PAGE_SIZE);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const filterColumnId = args.filterColumn ? toSafeToken(args.filterColumn) : undefined;

  const sortTypes: Record<string, DataTableSortType> = Object.fromEntries(
    columns.map((column, index) => [columnIds[index], column.sortType ?? "text"])
  );

  const signals = dataTableSignals(
    id,
    buildInitialSignals({
      columnIds,
      hiddenColumns: args.hiddenColumns,
      pageSize,
      pageCount,
      filteredCount: total,
    })
  );

  // Toolbar: Filter und Spaltenauswahl
  const filter = filterColumnId
    ? Input({
        class: "max-w-sm",
        attributes: {
          placeholder: args.filterPlaceholder ?? "Filter...",
          "aria-label": args.filterPlaceholder ?? "Filter...",
          "data-on:input": buildFilterHandler(id),
        },
      })
    : "";

  const viewOptions = args.viewOptions
    ? DataTableViewOptions({
        id,
        columns: columns,
        hiddenColumns: args.hiddenColumns,
        labels: args.labels,
      })
    : "";

  const toolbar =
    filter || viewOptions
      ? `<div data-slot="data-table-toolbar" class="flex items-center py-4">${filter}${viewOptions}</div>`
      : "";

  // Kopfzeile
  const headerCells: string[] = [];

  if (selectable) {
    headerCells.push(
      TableHead({ class: "pr-0", children: renderSelectCheckbox("all", labels.selectAll) })
    );
  }

  columns.forEach((column, index) => {
    const columnId = columnIds[index];

    if(columnId)
      headerCells.push(
        TableHead({
          class: cn(alignTw[column.align ?? "left"], column.headerClass),
          attributes: { "data-dt-col": columnId, hidden: hiddenSet.has(columnId) },
          children: renderHeaderContent(id, column, columnId, args.labels),
        })
      );
  });

  // Datenzeilen: Seiten nach der ersten sind schon im ersten Render ausgeblendet (kein Flackern vor Datastar)
  const rows = args.data.map((row, index) => {
    const rowId = args.rowId ? String(row[args.rowId]) : String(index);

    const rowAttributes: HtmlAttributes = {
      "data-dt-row": true,
      "data-dt-index": index,
      "data-row-id": rowId,
      hidden: pagination !== "none" && index >= pageSize,
    };

    columns.forEach((column, columnIndex) => {
      if (column.accessorKey) {
        rowAttributes[valueAttribute(columnIds[columnIndex]!)] = toSortValue(row[column.accessorKey]);
      }
    });

    const cells: string[] = [];

    if (selectable) {
      cells.push(TableCell({ class: "pr-0", children: renderSelectCheckbox("row", labels.selectRow) }));
    }

    columns.forEach((column, columnIndex) => {
      const columnId = columnIds[columnIndex]!;
      const value = column.accessorKey ? row[column.accessorKey] : undefined;

      const content = column.cell
        ? column.cell({ row, value, rowId, tableId: id })
        : escapeHtml(toSortValue(value));

      cells.push(
        TableCell({
          class: cn(alignTw[column.align ?? "left"], column.cellClass),
          attributes: { "data-dt-col": columnId, hidden: hiddenSet.has(columnId) },
          children: content,
        })
      );
    });

    return TableRow({ attributes: rowAttributes, children: cells });
  });

  // Leere Zeile: sichtbar, wenn keine Zeile übrig ist
  const emptyRow = TableRow({
    attributes: { "data-dt-empty": true, hidden: total > 0 },
    children: TableCell({
      class: "h-24 text-center",
      attributes: { colspan: columns.length + (selectable ? 1 : 0) },
      children: escapeHtml(labels.noResults),
    }),
  });

  const table = Table({
    children: [
      TableHeader({ children: TableRow({ children: headerCells }) }),
      TableBody({ attributes: { "data-dt-body": true }, children: [...rows, emptyRow] }),
    ],
  });

  // Fuß: Seitensteuerung oder nur der Auswahlzähler
  let footer = "";

  if (pagination !== "none") {
    footer = DataTablePagination({
      id,
      variant: pagination,
      pageSize,
      pageCount,
      filteredCount: total,
      selectable,
      pageSizeOptions: args.pageSizeOptions,
      labels: args.labels,
    });
  } else if (selectable) {
    footer = `<div data-slot="data-table-pagination" class="flex items-center justify-end space-x-2 py-4">${renderSelectionSummary(
      { id, filteredCount: total, labels: args.labels },
      0
    )}</div>`;
  }

  const attributes: HtmlAttributes = withDefaults(args.attributes, {
    id,
    "data-slot": "data-table",
    "data-signals": signals.dataSignals,
    "data-effect": buildDataTableEffect(id, { columnIds, sortTypes, filterColumnId }),
    class: cn("w-full", args.class),
  });

  // Nur setzen, wenn es gebraucht wird (ein undefined-Standardwert würde Nutzer-Attribute überschreiben)
  if (selectable) attributes["data-on:change"] = buildSelectionChangeHandler(id);

  return `<div${renderAttributes(attributes)}>${toolbar}<div data-slot="data-table-container" class="${escapeHtml(tableContainerTw)}">${table}</div>${footer}</div>`;
}
