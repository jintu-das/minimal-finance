import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils";
import { transactions } from "../mock-data";
import { transactionColumns } from "./transactions-columns";
import { DataTable } from "./data-table";

const netTotal = transactions.reduce(
  (total, transaction) => total + transaction.amount,
  0,
);

export function TransactionsTable() {
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
