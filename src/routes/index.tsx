import { Separator } from "@/components/ui/separator";
import { AiInsight } from "@/features/transactions/components/ai-insight";
import { TransactionFilter } from "@/features/transactions/components/transaction-filter";
import { TransactionHeader } from "@/features/transactions/components/transaction-header";
import { TransactionsTable } from "@/features/transactions/components/transactions-table";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

// eslint-disable-next-line react-refresh/only-export-components
function Index() {
  return (
    <main className="container mx-auto space-y-8 pt-8">
      <AiInsight />
      <TransactionHeader />
      <Separator />
      <TransactionFilter />
      <TransactionsTable />
    </main>
  );
}
