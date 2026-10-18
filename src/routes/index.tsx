import { Separator } from "@/components/ui/separator";
import { transactionsQueryOptions } from "@/features/transactions/api/fetch-transactions";
import { AiInsight } from "@/features/transactions/components/ai-insight";
import { TransactionFilter } from "@/features/transactions/components/transaction-filter";
import { TransactionHeader } from "@/features/transactions/components/transaction-header";
import { TransactionsTable } from "@/features/transactions/components/transactions-table";
import type { TransactionFilters } from "@/features/transactions/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): TransactionFilters => ({
    type:
      search.type === "income" || search.type === "expense"
        ? search.type
        : undefined,
    search:
      typeof search.search === "string" && search.search
        ? search.search
        : undefined,
  }),
  loaderDeps: ({ search: { type, search } }) => ({ type, search }),
  loader: ({ context: { queryClient }, deps }) =>
    queryClient.ensureQueryData(transactionsQueryOptions(deps)),
  component: Index,
});

// eslint-disable-next-line react-refresh/only-export-components
function Index() {
  const { type, search } = Route.useSearch();
  const { data: transactions } = useSuspenseQuery(
    transactionsQueryOptions({ type, search }),
  );

  return (
    <main className="container mx-auto space-y-8 pt-8">
      <AiInsight />
      <TransactionHeader transactions={transactions} />
      <Separator />
      <TransactionFilter />
      <TransactionsTable transactions={transactions} />
    </main>
  );
}
