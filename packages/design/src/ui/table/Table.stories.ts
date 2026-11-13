import type { Meta, StoryObj } from "@storybook/html-vite";

import { cn } from "../../utils/cn";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "./Table";
import type { TableArgs } from "./Table.types";

type TableStoryArgs = Pick<TableArgs, "class"> & { caption?: string };

interface Invoice {
  invoice: string;
  status: string;
  method: string;
  amount: number;
}

const invoices: Invoice[] = [
  { invoice: "INV001", status: "Paid", method: "Credit Card", amount: 250 },
  { invoice: "INV002", status: "Pending", method: "PayPal", amount: 150 },
  { invoice: "INV003", status: "Unpaid", method: "Bank Transfer", amount: 350 },
  { invoice: "INV004", status: "Paid", method: "Credit Card", amount: 450 },
  { invoice: "INV005", status: "Paid", method: "PayPal", amount: 550 },
  { invoice: "INV006", status: "Pending", method: "Bank Transfer", amount: 200 },
  { invoice: "INV007", status: "Unpaid", method: "Credit Card", amount: 300 },
];

const formatAmount = (value: number): string =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const sum = (rows: Invoice[]): number => rows.reduce((total, row) => total + row.amount, 0);

/** Rechnungstabelle wie in den Docs; die Summe wird aus den Zeilen berechnet */
function invoiceTable(options: {
  rows?: Invoice[];
  caption?: string;
  footer?: boolean;
  class?: string;
  headClass?: string;
  amountClass?: string;
  labels?: [string, string, string, string];
  totalLabel?: string;
}): string {
  const rows = options.rows ?? invoices;
  const labels = options.labels ?? ["Invoice", "Status", "Method", "Amount"];
  const amountClass = options.amountClass ?? "text-right";

  return Table({
    class: options.class,
    children: [
      options.caption ? TableCaption({ children: options.caption }) : "",
      TableHeader({
        children: TableRow({
          children: [
            TableHead({ class: cn("w-[100px]", options.headClass), children: labels[0] }),
            TableHead({ class: options.headClass, children: labels[1] }),
            TableHead({ class: options.headClass, children: labels[2] }),
            TableHead({ class: cn(options.headClass, amountClass), children: labels[3] }),
          ],
        }),
      }),
      TableBody({
        children: rows.map((row) =>
          TableRow({
            children: [
              TableCell({ class: "font-medium", children: row.invoice }),
              TableCell({ children: row.status }),
              TableCell({ children: row.method }),
              TableCell({ class: amountClass, children: formatAmount(row.amount) }),
            ],
          }),
        ),
      }),
      options.footer
        ? TableFooter({
            children: TableRow({
              children: [
                TableCell({ colSpan: 3, children: options.totalLabel ?? "Total" }),
                TableCell({ class: amountClass, children: formatAmount(sum(rows)) }),
              ],
            }),
          })
        : "",
    ],
  });
}

/** Icon für die Aktionsspalte (nur für die Story; ersetzbar durch renderIcon aus dem Icon-Ordner) */
const moreIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>`;

const meta: Meta<TableStoryArgs> = {
  title: "UI-Library/Table",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Eine responsive Tabelle. Port von shadcn/ui (Base). Bestandteile: Table, TableCaption, TableHeader, TableBody, TableFooter, TableRow, TableHead und TableCell. Die Komponente braucht kein Datastar.",
      },
    },
  },
  argTypes: {
    class: { control: "text" },
    caption: { control: "text" },
  },
  args: {
    caption: "A list of your recent invoices.",
  },
  render: ({ caption, ...args }) => invoiceTable({ ...args, caption }),
};

export default meta;
type Story = StoryObj<TableStoryArgs>;

export const Default: Story = {};

/** Fußzeile mit `TableFooter`; die Zelle "Total" erstreckt sich über drei Spalten (`colSpan: 3`) */
export const Footer: Story = {
  render: ({ caption, ...args }) => invoiceTable({ ...args, caption, rows: invoices.slice(0, 3), footer: true }),
};

/** Aktionen je Zeile. Hier mit einfachem Button; ein Dropdown-Menü lässt sich in die Zelle einsetzen. */
export const Actions: Story = {
  render: () => {
    const products = [
      { name: "Wireless Mouse", price: 29.99 },
      { name: "Mechanical Keyboard", price: 129.99 },
      { name: "USB-C Hub", price: 49.99 },
    ];

    return Table({
      children: [
        TableHeader({
          children: TableRow({
            children: [
              TableHead({ children: "Product" }),
              TableHead({ children: "Price" }),
              TableHead({ class: "text-right", children: "Actions" }),
            ],
          }),
        }),
        TableBody({
          children: products.map((product) =>
            TableRow({
              children: [
                TableCell({ class: "font-medium", children: product.name }),
                TableCell({ children: formatAmount(product.price) }),
                TableCell({
                  class: "text-right",
                  children: `<button type="button" class="inline-flex size-8 items-center justify-center rounded-md hover:bg-muted"><span class="sr-only">Open menu</span>${moreIcon}</button>`,
                }),
              ],
            }),
          ),
        }),
      ],
    });
  },
};

/** Ausgewählte Zeile über `attributes: { "data-state": "selected" }` */
export const SelectedRow: Story = {
  render: () =>
    Table({
      children: [
        TableHeader({
          children: TableRow({
            children: [TableHead({ children: "Invoice" }), TableHead({ children: "Status" })],
          }),
        }),
        TableBody({
          children: invoices.slice(0, 3).map((row, index) =>
            TableRow({
              attributes: index === 1 ? { "data-state": "selected" } : undefined,
              children: [TableCell({ children: row.invoice }), TableCell({ children: row.status })],
            }),
          ),
        }),
      ],
    }),
};

/** Rechts-nach-links-Layout (Arabisch); eigene Näherung, die RTL-Quelltexte der Docs lagen nicht vor */
export const RTL: Story = {
  render: () =>
    `<div dir="rtl">${invoiceTable({
      rows: [
        { invoice: "INV001", status: "مدفوع", method: "بطاقة ائتمانية", amount: 250 },
        { invoice: "INV002", status: "قيد الانتظار", method: "PayPal", amount: 150 },
        { invoice: "INV003", status: "غير مدفوع", method: "تحويل بنكي", amount: 350 },
      ],
      caption: "قائمة بفواتيرك الأخيرة.",
      footer: true,
      labels: ["الفاتورة", "الحالة", "الطريقة", "المبلغ"],
      totalLabel: "المجموع",
      headClass: "text-start",
      amountClass: "text-end",
    })}</div>`,
};
