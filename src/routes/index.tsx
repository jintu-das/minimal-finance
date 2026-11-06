import { PageHeader } from "@/components/common/page-header";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { transactionsQueryOptions } from "@/features/transactions/api/fetch-transactions";
import { MonthStepper } from "@/features/transactions/components/month-stepper";
import { MonthSummary } from "@/features/transactions/components/month-summary";
import { TransactionFilter } from "@/features/transactions/components/transaction-filter";
import { TransactionsTable } from "@/features/transactions/components/transactions-table";
import {
  currentMonth,
  isValidMonth,
  monthFromLegacyRange,
  monthSearchParam,
  periodPhrase,
  resolveTransactionFilters,
} from "@/features/transactions/month";
import { SEARCH_MAX_LENGTH } from "@/features/transactions/schema";
import type { TransactionFilters } from "@/features/transactions/types";
import { getApiErrorMessage } from "@/lib/api-types";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouterState } from "@tanstack/react-router";
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
    month: isValidMonth(search.month)
      ? search.month
      : monthFromLegacyRange(search.from, search.to),
  }),
  // Filtering happens on the server, so the resolved filters are the query
  // key. The current IST month is read once here and passed down, so the page
  // and its data agree on it even if the month rolls over while it is open.
  loaderDeps: ({ search }) => {
    const thisMonth = currentMonth();
    return { filters: resolveTransactionFilters(search, thisMonth), thisMonth };
  },
  // A failed fetch is swallowed here and shown inline by Index from the query
  // cache, instead of going to the route error boundary.
  loader: async ({ context: { queryClient }, deps: { filters } }) => {
    await queryClient
      .query(transactionsQueryOptions(filters))
      .catch(() => undefined);
  },
  component: Index,
});

// eslint-disable-next-line react-refresh/only-export-components
function Index() {
  const { filters, thisMonth } = Route.useLoaderDeps();
  const navigate = Route.useNavigate();
  // Not useSuspenseQuery: its errors go to the route error boundary, which
  // swaps the page and remounts the filters (losing the search input's state).
  // The loader already fetched, so a failure is not refetched on mount.
  const query = useQuery({
    ...transactionsQueryOptions(filters),
    retryOnMount: false,
  });
  // The loader fetches before the new filters render, so the current results
  // are dimmed meanwhile to show the change is in progress.
  const isUpdating = useRouterState({ select: (state) => state.isLoading });
  const resultsClassName = cn(
    "transition-opacity",
    isUpdating && "pointer-events-none opacity-50",
  );

  // Other filters are kept when the month changes.
  const goToMonth = (next: string) =>
    navigate({
      search: (prev) => ({ ...prev, month: monthSearchParam(next, thisMonth) }),
    });

  return (
    <main className="container mx-auto space-y-8 pt-8">
      <PageHeader
        title="Transactions"
        description="Track and manage your income and expenses."
      />
      <MonthStepper
        month={filters.month}
        thisMonth={thisMonth}
        onChange={goToMonth}
      />
      {query.data && !query.isError && (
        <div className={resultsClassName} aria-busy={isUpdating}>
          <MonthSummary
            transactions={query.data.transactions}
            summary={query.data.summary}
          />
        </div>
      )}
      <TransactionFilter />
      {query.isError ? (
        <Alert variant="destructive">
          <CircleAlertIcon />
          <AlertTitle>Could not load transactions</AlertTitle>
          <AlertDescription>
            {getApiErrorMessage(
              query.error,
              "An unexpected error occurred while loading transactions.",
            )}
          </AlertDescription>
          <AlertAction>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void query.refetch()}
              disabled={query.isFetching}
            >
              <RefreshCwIcon
                data-icon="inline-start"
                className={cn(query.isFetching && "animate-spin")}
              />
              <span className="sr-only sm:not-sr-only">Try again</span>
            </Button>
          </AlertAction>
        </Alert>
      ) : query.data ? (
        <div className={resultsClassName} aria-busy={isUpdating}>
          <TransactionsTable
            transactions={query.data.transactions}
            caption={`Transactions ${periodPhrase(filters.month)}.`}
            emptyTitle={`No transactions ${periodPhrase(filters.month)}`}
          />
        </div>
      ) : (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      )}
    </main>
  );
}
