import { formatCurrency } from "@/utils";
import { transactions } from "../mock-data";

export function TransactionHeader() {
  const netTotal = transactions.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  );
  return (
    <header className="">
      <p className="text-xs text-muted-foreground font-light uppercase font-mono">
        Net Position - Q4
      </p>
      <h1 className="text-3xl font-medium">
        {netTotal > 0 ? "+" : ""}
        {formatCurrency(netTotal)}
      </h1>
    </header>
  );
}
