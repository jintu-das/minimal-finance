import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { PageHeader } from "@/components/common/page-header";
import { AiInsights } from "@/features/analytics/components/ai-insights";
import { BudgetOverview } from "@/features/analytics/components/budget-overview";
import { CashFlowChart } from "@/features/analytics/components/cash-flow-chart";
import { RecentTransactions } from "@/features/analytics/components/recent-transactions";
import { SummaryCards } from "@/features/analytics/components/summary-cards";
import { analyticsSummaryQueryOptions } from "@/features/analytics/api/fetch-analytics-summary.api";
import { monthToDateRanges } from "@/features/analytics/date-range";
import { transactionsQueryOptions } from "@/features/transactions/api/fetch-transactions";
import { SpendByCategoryChart } from "@/features/analytics/components/spend-by-category-chart";

export const Route = createFileRoute("/analytics")({
  loader: async ({ context: { queryClient } }) => {
    const ranges = monthToDateRanges();
    await Promise.all([
      queryClient.ensureQueryData(analyticsSummaryQueryOptions(ranges.current)),
      queryClient.ensureQueryData(
        analyticsSummaryQueryOptions(ranges.previous),
      ),
      // Shares the cache with the unfiltered transactions page.
      queryClient.ensureQueryData(transactionsQueryOptions()),
    ]);
    return ranges;
  },
  component: RouteComponent,
});

// eslint-disable-next-line react-refresh/only-export-components
function RouteComponent() {
  const ranges = Route.useLoaderData();
  const { data: current } = useSuspenseQuery(
    analyticsSummaryQueryOptions(ranges.current),
  );
  const { data: previous } = useSuspenseQuery(
    analyticsSummaryQueryOptions(ranges.previous),
  );
  // The API returns transactions newest first.
  const { data: recentTransactions } = useSuspenseQuery({
    ...transactionsQueryOptions(),
    select: (transactions) => transactions.slice(0, 5),
  });

  return (
    <main className="container mx-auto space-y-6 px-4 py-8">
      <PageHeader
        title="Analytics"
        description={`Your finances for ${format(new Date(ranges.current.from), "MMMM yyyy")}.`}
      />

      <SummaryCards current={current} previous={previous} />

      <AiInsights />

      <div className="grid gap-6 lg:grid-cols-2">
        <CashFlowChart />
        <SpendByCategoryChart />
        <RecentTransactions transactions={recentTransactions} />
        <BudgetOverview />
      </div>

      {/* <div className="grid gap-6 lg:grid-cols-2">
      </div> */}
    </main>
  );
}
