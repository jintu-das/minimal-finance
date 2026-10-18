import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils";
import type { Transaction } from "../types";
import { transactionColumns } from "./transactions-columns";
import { DataTable } from "./data-table";

export function TransactionsTable({
  transactions,
}: {
  transactions: Array<Transaction>;
}) {
  const netTotal = transactions.reduce(
    (total, transaction) =>
      total + (transaction.type === "income" ? 1 : -1) * transaction.amount,
    0,
  );

  return (
    <DataTable
      columns={transactionColumns}
      data={transactions}
      caption="Recent account transactions."
      footer={
        <TableRow>
          <TableCell colSpan={3}>Net total</TableCell>
          <TableCell className="text-right">
            {netTotal > 0 ? "+" : ""}
            {formatCurrency(netTotal)}
          </TableCell>
        </TableRow>
      }
    />
  );
}
