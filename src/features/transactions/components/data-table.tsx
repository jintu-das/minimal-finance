import {
  useTable,
  type ColumnDef,
  type RowData,
  type SortingState,
} from "@tanstack/react-table";
import { ReceiptText } from "lucide-react";
import { useState, type ReactNode } from "react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { transactionTableFeatures } from "./transactions-table-features";

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<typeof transactionTableFeatures, TData>[];
  data: TData[];
  caption?: string;
  footer?: ReactNode;
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  caption,
  footer,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useTable({
    features: transactionTableFeatures,
    data,
    columns,
    onSortingChange: setSorting,
    state: { sorting },
  });

  return (
    <Table>
      {caption && <TableCaption>{caption}</TableCaption>}
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder ? null : (
                  <table.FlexRender header={header} />
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getAllCells().map((cell) => (
                <TableCell key={cell.id}>
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="whitespace-normal">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <ReceiptText />
                  </EmptyMedia>
                  <EmptyTitle>No Transactions Found</EmptyTitle>
                  <EmptyDescription>
                    Try a different search or filter, or create a new
                    transaction.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      {footer && <TableFooter>{footer}</TableFooter>}
    </Table>
  );
}
