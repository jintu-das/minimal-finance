import type { Transaction } from "../types";
import { DataTable } from "./data-table";
import { transactionColumns } from "./transactions-columns";

export function TransactionsTable({
  transactions,
}: {
  transactions: Array<Transaction>;
}) {
  return (
    <DataTable
      columns={transactionColumns}
      data={transactions}
      caption="Recent account transactions."
    />
  );
}
