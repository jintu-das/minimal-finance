import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/utils";
import { createColumnHelper, type Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import type { Transaction } from "../types";
import { TransactionRowActions } from "./transaction-row-actions";
import { transactionTableFeatures } from "./transactions-table-features";

const columnHelper = createColumnHelper<
  typeof transactionTableFeatures,
  Transaction
>();

// eslint-disable-next-line react-refresh/only-export-components
function SortableHeader<TValue>({
  column,
  label,
}: {
  column: Column<typeof transactionTableFeatures, Transaction, TValue>;
  label: string;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      aria-label={`Sort by ${label}`}
    >
      {label}
      <ArrowUpDown data-icon="inline-end" />
    </Button>
  );
}

export const transactionColumns = columnHelper.columns([
  columnHelper.accessor("date", {
    header: ({ column }) => <SortableHeader column={column} label="Date" />,
    cell: ({ row }) => (
      <time dateTime={row.original.date} className="text-muted-foreground">
        {formatDate(row.original.date)}
      </time>
    ),
    sortFn: "text",
  }),
  columnHelper.accessor("title", {
    header: ({ column }) => <SortableHeader column={column} label="Title" />,
    sortFn: "text",
  }),
  columnHelper.accessor("category.label", {
    header: ({ column }) => <SortableHeader column={column} label="Category" />,
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue()}</span>
    ),
    sortFn: "text",
  }),
  columnHelper.accessor("amount", {
    header: ({ column }) => (
      <div className="flex justify-end">
        <SortableHeader column={column} label="Amount" />
      </div>
    ),
    cell: ({ row }) => (
      <div
        className={cn(
          "text-right",
          row.original.type === "income"
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-muted-foreground",
        )}
      >
        {row.original.type === "income" ? "+" : "-"}
        {formatCurrency(row.original.amount)}
      </div>
    ),
    sortFn: "basic",
  }),
  columnHelper.display({
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <TransactionRowActions transaction={row.original} />
      </div>
    ),
  }),
]);
