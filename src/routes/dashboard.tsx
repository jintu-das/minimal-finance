import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/page-header";
import { AiInsights } from "@/features/dashboard/components/ai-insights";
import { BudgetOverview } from "@/features/dashboard/components/budget-overview";
import { CashFlowChart } from "@/features/dashboard/components/cash-flow-chart";
import { RecentTransactions } from "@/features/dashboard/components/recent-transactions";
import { SummaryCards } from "@/features/dashboard/components/summary-cards";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

// eslint-disable-next-line react-refresh/only-export-components
function RouteComponent() {
  return (
    <main className="container mx-auto space-y-6 px-4 py-8">
      <PageHeader
        title="Dashboard"
        description="Your finances for October 2026."
      />

      <SummaryCards />

      <AiInsights />

      <div className="grid gap-6 lg:grid-cols-2">
        <CashFlowChart />
        <RecentTransactions />
      </div>

      <BudgetOverview />
    </main>
  );
}
