import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { transactionsQueryOptions } from "@/features/transactions/api/fetch-transactions";
import { MonthStepper } from "@/features/transactions/components/month-stepper";
import { MonthSummary } from "@/features/transactions/components/month-summary";
import { TransactionFilter } from "@/features/transactions/components/transaction-filter";
import { TransactionsPageHeader } from "@/features/transactions/components/transactions-page-header";
import {
  TransactionsPageSkeleton,
  TransactionsTableSkeleton,
} from "@/features/transactions/components/transactions-skeleton";
import { TransactionsTable } from "@/features/transactions/components/transactions-table";
import {
  currentMonth,
  monthSearchParam,
  periodPhrase,
  resolveTransactionFilters,
} from "@/features/transactions/month";
import { transactionFiltersSchema } from "@/features/transactions/schema";
import { getApiErrorMessage } from "@/lib/api-types";
import { cn } from "@/lib/utils";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CircleAlertIcon, RefreshCwIcon } from "lucide-react";

export const Route = createFileRoute("/")({
  validateSearch: transactionFiltersSchema,
  // Filtering happens on the server, so the resolved filters are the query
  // key. The current IST month is read once here and passed down, so the page
  // and its data agree on it even if the month rolls over while it is open.
  loaderDeps: ({ search }) => {
    const thisMonth = currentMonth();
    return { filters: resolveTransactionFilters(search, thisMonth), thisMonth };
  },
  // A failed fetch is swallowed here and shown inline by Index from the query
  // cache, instead of going to the route error boundary.
  // Only entering the page waits for the fetch (and shows the skeleton if it
  // is slow). A filter change on the page must not wait: the router would
  // swap in the skeleton after pendingMs and remount the filters, losing the
  // search input's state, so Index keeps the previous results meanwhile.
  loader: async ({ context: { queryClient }, deps: { filters }, cause }) => {
    const fetching = queryClient
      .query(transactionsQueryOptions(filters))
      .catch(() => undefined);
    if (cause !== "stay") await fetching;
  },
  pendingComponent: TransactionsPageSkeleton,
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
    placeholderData: keepPreviousData,
  });

  // While new filters load, the previous results stay on screen, dimmed to
  // show the change is in progress.
  const isUpdating = query.isPlaceholderData;
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
      <TransactionsPageHeader />
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
        <div aria-busy="true">
          <span className="sr-only" role="status">
            Loading transactions
          </span>
          <TransactionsTableSkeleton />
        </div>
      )}
    </main>
  );
}
