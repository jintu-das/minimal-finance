import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/common/page-header";
import { AiInsights } from "@/features/analytics/components/ai-insights";
import { BudgetOverview } from "@/features/analytics/components/budget-overview";
import { CashFlowChart } from "@/features/analytics/components/cash-flow-chart";
import { RecentTransactions } from "@/features/analytics/components/recent-transactions";
import { SummaryCards } from "@/features/analytics/components/summary-cards";
import { analyticsSummaryQueryOptions } from "@/features/analytics/api/fetch-analytics-summary.api";
import { monthRanges } from "@/features/analytics/date-range";
import { transactionsQueryOptions } from "@/features/transactions/api/fetch-transactions";
import { MonthStepper } from "@/features/transactions/components/month-stepper";
import {
  currentMonth,
  formatMonth,
  isValidMonth,
  monthSearchParam,
  resolveTransactionFilters,
} from "@/features/transactions/month";
import { SpendByCategoryChart } from "@/features/analytics/components/spend-by-category-chart";

export const Route = createFileRoute("/analytics")({
  validateSearch: (search: Record<string, unknown>): { month?: string } => ({
    month: isValidMonth(search.month) ? search.month : undefined,
  }),
  // The current IST month is read once here and passed down, so the page and
  // its data agree on it even if the month rolls over while it is open.
  // Future months have no data yet, so they fall back to the current month.
  loaderDeps: ({ search }) => {
    const thisMonth = currentMonth();
    const month =
      search.month && search.month < thisMonth ? search.month : thisMonth;
    return { month, thisMonth };
  },
  loader: async ({ context: { queryClient }, deps: { month, thisMonth } }) => {
    const ranges = monthRanges(month, thisMonth);
    await Promise.all([
      queryClient.ensureQueryData(analyticsSummaryQueryOptions(ranges.current)),
      queryClient.ensureQueryData(
        analyticsSummaryQueryOptions(ranges.previous),
      ),
      // The selected month's list, shared with the transactions page's view
      // of that month, instead of the whole history just to show five rows.
      queryClient.ensureQueryData(
        transactionsQueryOptions(resolveTransactionFilters({ month })),
      ),
    ]);
    return ranges;
  },
  component: RouteComponent,
});

// eslint-disable-next-line react-refresh/only-export-components
function RouteComponent() {
  const { month, thisMonth } = Route.useLoaderDeps();
  const isThisMonth = month === thisMonth;
  const ranges = Route.useLoaderData();
  const navigate = Route.useNavigate();
  const { data: current } = useSuspenseQuery(
    analyticsSummaryQueryOptions(ranges.current),
  );
  const { data: previous } = useSuspenseQuery(
    analyticsSummaryQueryOptions(ranges.previous),
  );
  // The API returns transactions newest first.
  const { data: recentTransactions } = useSuspenseQuery({
    ...transactionsQueryOptions(resolveTransactionFilters({ month })),
    select: ({ transactions }) => transactions.slice(0, 5),
  });

  const goToMonth = (next: string) =>
    navigate({ search: { month: monthSearchParam(next, thisMonth) } });

  return (
    <main className="container mx-auto space-y-8 pt-8">
      <PageHeader
        title="Analytics"
        description={`Your finances for ${formatMonth(month)}.`}
      />

      <MonthStepper
        month={month}
        thisMonth={thisMonth}
        max={thisMonth}
        onChange={goToMonth}
      />

      <SummaryCards current={current} previous={previous} />

      {/* These sections still show fixed placeholder data for the current
          month, so they are hidden for past months rather than shown under
          the wrong period. */}
      {isThisMonth && <AiInsights />}

      <div className="grid gap-6 lg:grid-cols-2">
        {isThisMonth && <CashFlowChart />}
        {isThisMonth && <SpendByCategoryChart />}
        <RecentTransactions
          month={month}
          thisMonth={thisMonth}
          transactions={recentTransactions}
          className={cn(!isThisMonth && "lg:col-span-2")}
        />
        {isThisMonth && <BudgetOverview />}
      </div>
    </main>
  );
}
