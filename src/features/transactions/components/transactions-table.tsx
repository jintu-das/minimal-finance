import type { Transaction } from "../types";
import { DataTable } from "./data-table";
import { transactionColumns } from "./transactions-columns";

export function TransactionsTable({
  transactions,
  caption = "Recent account transactions.",
}: {
  transactions: Array<Transaction>;
  caption?: string;
}) {
  return (
    <DataTable
      columns={transactionColumns}
      data={transactions}
      caption={caption}
    />
  );
}
