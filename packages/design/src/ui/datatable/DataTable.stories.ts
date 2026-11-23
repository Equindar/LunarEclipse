import type { Meta, StoryObj } from "@storybook/html-vite";

import { DataTable, DataTableRowActions } from "./DataTable";
import type { DataTableArgs, DataTableColumn, DataTableLabels } from "./DataTable.types";

type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

type DataTableStoryArgs = DataTableArgs<Payment>;

/** Die fünf Beispielzeilen der Docs-Seite */
const payments: Payment[] = [
  { id: "728ed52f", amount: 316, status: "success", email: "ken99@example.com" },
  { id: "489e1d42", amount: 242, status: "success", email: "Abe45@example.com" },
  { id: "9a1f3c77", amount: 837, status: "processing", email: "Monserrat44@example.com" },
  { id: "b3d02e18", amount: 874, status: "success", email: "Silas22@example.com" },
  { id: "5cc7a9d4", amount: 721, status: "failed", email: "carmella@example.com" },
];

/** Mehr Zeilen für Seiten, Sortierung und Filter (deterministisch, ohne Zufall) */
const manyPayments: Payment[] = Array.from({ length: 35 }, (_, index) => {
  const statuses: Payment["status"][] = ["pending", "processing", "success", "failed"];
  const names = ["ada", "bruno", "carla", "dmitri", "elena", "farid", "greta", "hugo", "ines", "jonas"];
  const name = names[index % names.length];
  const status = statuses[index % statuses.length] ?? "pending";

  return {
    id: `pay${String(index + 1).padStart(3, "0")}`,
    amount: 40 + ((index * 137) % 960),
    status,
    email: `${name}${index + 1}@example.com`,
  };
});

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const statusColumn: DataTableColumn<Payment> = { accessorKey: "status", header: "Status" };
const emailColumn: DataTableColumn<Payment> = { accessorKey: "email", header: "Email" };
const amountColumn: DataTableColumn<Payment> = { accessorKey: "amount", header: "Amount" };

/** Abschnitt "Cell Formatting": Betrag als Dollar, rechtsbündig */
const formattedAmountColumn: DataTableColumn<Payment> = {
  accessorKey: "amount",
  header: "Amount",
  align: "right",
  sortType: "number",
  cell: ({ value }) => `<div class="font-medium">${currency.format(Number(value))}</div>`,
};

/** Abschnitt "Row Actions": Menü pro Zeile */
const actionsColumn: DataTableColumn<Payment> = {
  id: "actions",
  cell: ({ row, rowId, tableId }) =>
    DataTableRowActions({
      id: `${tableId}-actions-${rowId}`,
      items: [
        { type: "label", label: "Actions" },
        { label: "Copy payment ID", onClick: `navigator.clipboard.writeText(${JSON.stringify(row.id)})` },
        { type: "separator" },
        { label: "View customer" },
        { label: "View payment details" },
      ],
    }),
};

const germanLabels: Partial<DataTableLabels> = {
  noResults: "Keine Ergebnisse.",
  viewOptions: "Ansicht",
  toggleColumns: "Spalten umschalten",
  openMenu: "Menü öffnen",
  actions: "Aktionen",
  sortAsc: "Aufsteigend",
  sortDesc: "Absteigend",
  hide: "Ausblenden",
  selectAll: "Alle auswählen",
  selectRow: "Zeile auswählen",
  previous: "Zurück",
  next: "Weiter",
  rowsPerPage: "Zeilen pro Seite",
  page: "Seite {page} von {pages}",
  rowsSelected: "{selected} von {total} Zeile(n) ausgewählt.",
  goToFirstPage: "Zur ersten Seite",
  goToPreviousPage: "Zur vorherigen Seite",
  goToNextPage: "Zur nächsten Seite",
  goToLastPage: "Zur letzten Seite",
};

const meta: Meta<DataTableStoryArgs> = {
  title: "UI-Library/DataTable",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Tabelle mit Filter, Sortierung, Seiten, Spaltenauswahl und Zeilenauswahl. Port des Guides \"Data Table\" von shadcn/ui (Base); dort ist die Data Table keine fertige Komponente, sondern ein Rezept auf Basis von TanStack Table. Hier ersetzt ein Datastar-Effekt TanStack Table: Alle Zeilen stehen im HTML, Filter, Sortierung und Seiten wirken im Browser. Das funktioniert nur mit geladenem Datastar, ohne Datastar bleibt die Tabelle statisch (die erste Seite ist sichtbar).",
      },
    },
  },
  argTypes: {
    columns: { control: false },
    data: { control: false },
    pagination: { control: "select", options: ["none", "simple", "full"] },
    pageSize: { control: "number" },
    filterColumn: { control: "text" },
    filterPlaceholder: { control: "text" },
    viewOptions: { control: "boolean" },
    selectable: { control: "boolean" },
    class: { control: "text" },
  },
  args: {
    id: "data-table-default",
    columns: [statusColumn, emailColumn, formattedAmountColumn],
    data: payments,
    rowId: "id",
  },
  render: (args) => `<div class="w-full max-w-3xl">${DataTable(args)}</div>`,
};

export default meta;
type Story = StoryObj<DataTableStoryArgs>;

/** Die Tabelle der Docs-Seite: Auswahl, Aktionen, Previous und Next */
export const Default: Story = {
  args: {
    id: "data-table-default",
    columns: [statusColumn, emailColumn, formattedAmountColumn, actionsColumn],
    selectable: true,
    pagination: "simple",
  },
};

/** Abschnitt "Basic Table": nur Spalten, keine Formatierung */
export const BasicTable: Story = {
  args: {
    id: "data-table-basic",
    columns: [statusColumn, emailColumn, amountColumn],
  },
};

/** Abschnitt "Cell Formatting": Betrag als Dollar, rechtsbündig */
export const CellFormatting: Story = {
  args: {
    id: "data-table-formatting",
    columns: [statusColumn, emailColumn, formattedAmountColumn],
  },
};

/** Abschnitt "Row Actions": Menü pro Zeile (native Popover API, wie Popover und Tooltip) */
export const RowActions: Story = {
  args: {
    id: "data-table-actions",
    columns: [statusColumn, emailColumn, formattedAmountColumn, actionsColumn],
  },
};

/** Abschnitt "Pagination": Seiten mit Previous und Next (hier 5 Zeilen pro Seite) */
export const Pagination: Story = {
  args: {
    id: "data-table-pagination",
    columns: [statusColumn, emailColumn, formattedAmountColumn],
    data: manyPayments,
    pagination: "simple",
    pageSize: 5,
  },
};

/** Abschnitt "Sorting": Die Spalten Email und Amount lassen sich über den Kopf sortieren */
export const Sorting: Story = {
  args: {
    id: "data-table-sorting",
    columns: [statusColumn, { ...emailColumn, sortable: true }, { ...formattedAmountColumn, sortable: true }],
    data: manyPayments,
    pagination: "simple",
    pageSize: 5,
  },
};

/** Abschnitt "Filtering": Eingabe filtert die Spalte Email */
export const Filtering: Story = {
  args: {
    id: "data-table-filtering",
    columns: [statusColumn, emailColumn, formattedAmountColumn],
    data: manyPayments,
    filterColumn: "email",
    filterPlaceholder: "Filter emails...",
    pagination: "simple",
    pageSize: 5,
  },
};

/** Abschnitt "Visibility": Spalten lassen sich über das Menü ein- und ausblenden (Status ist anfangs ausgeblendet) */
export const Visibility: Story = {
  args: {
    id: "data-table-visibility",
    columns: [statusColumn, emailColumn, formattedAmountColumn],
    viewOptions: true,
    hiddenColumns: ["status"],
  },
};

/** Abschnitt "Row Selection": Checkboxen pro Zeile und in der Kopfzeile, Zähler unter der Tabelle */
export const RowSelection: Story = {
  args: {
    id: "data-table-selection",
    columns: [statusColumn, emailColumn, formattedAmountColumn],
    selectable: true,
  },
};

/**
 * Abschnitt "Reusable Components": Spaltenkopf mit Menü (Asc, Desc, Hide), Spaltenauswahl und
 * vollständige Seitensteuerung mit Zeilen pro Seite
 */
export const ReusableComponents: Story = {
  args: {
    id: "data-table-reusable",
    columns: [
      { ...statusColumn, sortable: true, headerMenu: true },
      { ...emailColumn, sortable: true, headerMenu: true },
      { ...formattedAmountColumn, sortable: true, headerMenu: true },
    ],
    data: manyPayments,
    filterColumn: "email",
    filterPlaceholder: "Filter emails...",
    viewOptions: true,
    selectable: true,
    pagination: "full",
    pageSize: 10,
  },
};

/** Alle Texte lassen sich über `labels` ersetzen */
export const German: Story = {
  args: {
    id: "data-table-german",
    columns: [
      { ...statusColumn, header: "Status", sortable: true },
      { ...emailColumn, header: "E-Mail", sortable: true },
      { ...formattedAmountColumn, header: "Betrag" },
    ],
    data: manyPayments,
    filterColumn: "email",
    filterPlaceholder: "E-Mails filtern...",
    viewOptions: true,
    selectable: true,
    pagination: "full",
    pageSize: 5,
    labels: germanLabels,
  },
};

/** Ohne Daten erscheint die Zeile "No results." */
export const Empty: Story = {
  args: {
    id: "data-table-empty",
    data: [],
  },
};