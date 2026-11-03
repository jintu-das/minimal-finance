import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils";
import { getRouteApi } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronLeftIcon,
  ChevronRightIcon,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  currentMonth,
  formatMonth,
  shiftMonth,
  summarizeTransactions,
} from "../month";
import type { Transaction } from "../types";

const route = getRouteApi("/");

const pluralize = (count: number) =>
  `${count} ${count === 1 ? "transaction" : "transactions"}`;

export function MonthNavigator({
  month,
  transactions,
}: {
  month: string;
  transactions: Array<Transaction>;
}) {
  const navigate = route.useNavigate();
  const thisMonth = currentMonth();
  const { inflow, outflow, net, inflowCount, outflowCount } =
    summarizeTransactions(transactions);
  const overspent = net < 0;
  // Share of inflow already spent; capped so the bar stays in bounds.
  const spentShare = inflow > 0 ? Math.min((outflow / inflow) * 100, 100) : 0;

  // The current month is the default, so it is kept out of the URL.
  const goTo = (next: string) =>
    navigate({
      search: (prev) => ({
        ...prev,
        month: next === thisMonth ? undefined : next,
      }),
    });

  return (
    <section aria-label="Month" className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => goTo(shiftMonth(month, -1))}
          aria-label="Previous month"
        >
          <ChevronLeftIcon />
        </Button>
        <h2
          className="min-w-36 text-center text-lg font-semibold tracking-tight"
          aria-live="polite"
        >
          {formatMonth(month)}
        </h2>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => goTo(shiftMonth(month, 1))}
          aria-label="Next month"
        >
          <ChevronRightIcon />
        </Button>
        {month !== thisMonth && (
          <Button variant="ghost" size="sm" onClick={() => goTo(thisMonth)}>
            This month
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Inflow"
          value={inflow}
          icon={ArrowUpRight}
          tone="text-emerald-600 bg-emerald-500/10 dark:text-emerald-400"
        >
          {pluralize(inflowCount)}
        </SummaryCard>
        <SummaryCard
          label="Outflow"
          value={outflow}
          icon={ArrowDownRight}
          tone="text-destructive bg-destructive/10"
        >
          {pluralize(outflowCount)}
        </SummaryCard>
        <SummaryCard
          label="Net"
          value={net}
          icon={Wallet}
          tone={
            overspent
              ? "text-destructive bg-destructive/10"
              : "text-foreground bg-muted"
          }
          valueClassName={overspent ? "text-destructive" : undefined}
        >
          <Progress
            value={spentShare}
            aria-label="Share of inflow spent"
            className={cn(
              "mb-1.5 [&_[data-slot=progress-track]]:h-1.5",
              overspent && "[&_[data-slot=progress-indicator]]:bg-destructive",
            )}
          />
          {inflow === 0
            ? "No inflow this month"
            : overspent
              ? `Overspent by ${formatCurrency(-net)}`
              : `Spent ${Math.round(spentShare)}% of inflow`}
        </SummaryCard>
      </div>
    </section>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  tone,
  valueClassName,
  children,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: string;
  valueClassName?: string;
  children: ReactNode;
}) {
  return (
    <Card size="sm" className="border-0 shadow-none ring-1 ring-border">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-full",
            tone,
          )}
        >
          <Icon aria-hidden="true" className="size-4" />
        </span>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <p
          className={cn(
            "text-3xl font-semibold tracking-tight tabular-nums",
            valueClassName,
          )}
        >
          {formatCurrency(value)}
        </p>
        <div className="text-xs text-muted-foreground">{children}</div>
      </CardContent>
    </Card>
  );
}
