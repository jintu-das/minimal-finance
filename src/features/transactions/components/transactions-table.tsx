import type { Transaction } from "../types";
import { DataTable } from "./data-table";
import { transactionColumns } from "./transactions-columns";

export function TransactionsTable({
  transactions,
  caption = "Recent account transactions.",
  emptyTitle,
}: {
  transactions: Array<Transaction>;
  caption?: string;
  emptyTitle?: string;
}) {
  return (
    <DataTable
      columns={transactionColumns}
      data={transactions}
      caption={caption}
      emptyTitle={emptyTitle}
    />
  );
}
