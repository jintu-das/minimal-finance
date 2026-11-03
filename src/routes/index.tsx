import { PageHeader } from "@/components/common/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { transactionsQueryOptions } from "@/features/transactions/api/fetch-transactions";
import { AiInsight } from "@/features/transactions/components/ai-insight";
import {
  MonthNavigator,
  MonthSummary,
} from "@/features/transactions/components/month-navigator";
import { TransactionFilter } from "@/features/transactions/components/transaction-filter";
import { TransactionsTable } from "@/features/transactions/components/transactions-table";
import {
  isValidDay,
  isValidMonth,
  periodPhrase,
  resolveTransactionFilters,
} from "@/features/transactions/month";
import { SEARCH_MAX_LENGTH } from "@/features/transactions/schema";
import type { TransactionFilters } from "@/features/transactions/types";
import { getApiErrorMessage } from "@/lib/api-types";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CircleAlertIcon, RefreshCwIcon } from "lucide-react";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): TransactionFilters => ({
    type:
      search.type === "income" || search.type === "expense"
        ? search.type
        : undefined,
    // Trimmed and capped like the search input, so a long or blank value from
    // a shared URL never reaches the API.
    search:
      typeof search.search === "string"
        ? search.search.trim().slice(0, SEARCH_MAX_LENGTH) || undefined
        : undefined,
    month: isValidMonth(search.month) ? search.month : undefined,
    from: isValidDay(search.from) ? search.from : undefined,
    to: isValidDay(search.to) ? search.to : undefined,
  }),
  // Filtering happens on the server, so the resolved filters (with the
  // current IST month filled in) are both the loader deps and the query key.
  loaderDeps: ({ search }) => resolveTransactionFilters(search),
  // A failed fetch is swallowed here and shown inline by Index from the query
  // cache, instead of going to the route error boundary.
  loader: async ({ context: { queryClient }, deps }) => {
    await queryClient
      .query(transactionsQueryOptions(deps))
      .catch(() => undefined);
  },
  component: Index,
});

// eslint-disable-next-line react-refresh/only-export-components
function Index() {
  const filters = Route.useLoaderDeps();
  // Not useSuspenseQuery: its errors go to the route error boundary, which
  // swaps the page and remounts the filters (losing the search input's state).
  // The loader already fetched, so a failure is not refetched on mount.
  const query = useQuery({
    ...transactionsQueryOptions(filters),
    retryOnMount: false,
  });

  return (
    <main className="container mx-auto space-y-8 pt-8">
      <PageHeader
        title="Transactions"
        description="Track and manage your income and expenses."
      />
      <AiInsight />
      <Separator />
      <MonthNavigator filters={filters} />
      {query.data && !query.isError && (
        <MonthSummary
          transactions={query.data.transactions}
          summary={query.data.summary}
        />
      )}
      <TransactionFilter />
      {query.isError ? (
        <>
          <Alert variant="destructive">
            <CircleAlertIcon />
            <AlertTitle>Could not load transactions</AlertTitle>
            <AlertDescription>
              {getApiErrorMessage(
                query.error,
                "An unexpected error occurred while loading transactions.",
              )}
            </AlertDescription>
          </Alert>
          <Button
            variant="outline"
            onClick={() => void query.refetch()}
            disabled={query.isFetching}
          >
            <RefreshCwIcon data-icon="inline-start" />
            Try again
          </Button>
        </>
      ) : query.data ? (
        <TransactionsTable
          transactions={query.data.transactions}
          caption={`Transactions ${periodPhrase(filters)}.`}
          emptyTitle={`No transactions ${periodPhrase(filters)}`}
        />
      ) : (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      )}
    </main>
  );
}
