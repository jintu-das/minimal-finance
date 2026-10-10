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
import { formatCurrency, formatDate } from "@/utils";
import { transactions } from "../mock-data";

const netTotal = transactions.reduce(
  (total, transaction) => total + transaction.amount,
  0,
);

export function TransactionsTable() {
  return (
    <Table>
      <TableCaption>Recent account transactions.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead scope="col" className="uppercase text-muted-foreground">
            Date
          </TableHead>
          <TableHead scope="col" className="uppercase text-muted-foreground">
            Counterparty
          </TableHead>
          <TableHead scope="col" className="uppercase text-muted-foreground">
            Category
          </TableHead>
          <TableHead
            scope="col"
            className="uppercase text-muted-foreground text-right"
          >
            Amount
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={`${transaction.date}-${transaction.counterparty}`}>
            <TableCell className="text-muted-foreground">
              <time dateTime={transaction.date}>
                {formatDate(transaction.date)}
              </time>
            </TableCell>
            <TableCell>{transaction.counterparty}</TableCell>
            <TableCell className="text-muted-foreground">
              {transaction.category}
            </TableCell>
            <TableCell
              className={`text-right text-muted-foreground ${transaction.amount > 0 ? "text-emerald-600 dark:text-emerald-400" : ""}`}
            >
              {transaction.amount > 0 ? "+" : ""}
              {formatCurrency(transaction.amount)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Net total</TableCell>
          <TableCell className="text-right">
            {netTotal < 0 ? "-" : "+"}
            {formatCurrency(Math.abs(netTotal))}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
