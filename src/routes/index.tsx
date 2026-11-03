import { PageHeader } from "@/components/common/page-header";
import { Separator } from "@/components/ui/separator";
import { transactionsQueryOptions } from "@/features/transactions/api/fetch-transactions";
import { AiInsight } from "@/features/transactions/components/ai-insight";
import { MonthNavigator } from "@/features/transactions/components/month-navigator";
import { TransactionFilter } from "@/features/transactions/components/transaction-filter";
import { TransactionsTable } from "@/features/transactions/components/transactions-table";
import {
  currentMonth,
  filterByMonth,
  formatMonth,
  isValidMonth,
} from "@/features/transactions/month";
import type { TransactionFilters } from "@/features/transactions/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

type TransactionsSearch = TransactionFilters & { month?: string };

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): TransactionsSearch => ({
    type:
      search.type === "income" || search.type === "expense"
        ? search.type
        : undefined,
    search:
      typeof search.search === "string" && search.search
        ? search.search
        : undefined,
    month: isValidMonth(search.month) ? search.month : undefined,
  }),
  // The API has no date filter, so the month is applied client-side and
  // switching months reuses the cached list.
  loaderDeps: ({ search: { type, search } }) => ({ type, search }),
  loader: ({ context: { queryClient }, deps }) =>
    queryClient.ensureQueryData(transactionsQueryOptions(deps)),
  component: Index,
});

// eslint-disable-next-line react-refresh/only-export-components
function Index() {
  const { type, search, month: monthParam } = Route.useSearch();
  const month = monthParam ?? currentMonth();
  const { data: transactions } = useSuspenseQuery({
    ...transactionsQueryOptions({ type, search }),
    select: (rows) => filterByMonth(rows, month),
  });

  return (
    <main className="container mx-auto space-y-8 pt-8">
      <PageHeader
        title="Transactions"
        description="Track and manage your income and expenses."
      />
      <AiInsight />
      <Separator />
      <MonthNavigator month={month} transactions={transactions} />
      <TransactionFilter />
      <TransactionsTable
        transactions={transactions}
        caption={`Transactions for ${formatMonth(month)}.`}
      />
    </main>
  );
}
