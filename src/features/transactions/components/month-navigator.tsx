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
  XIcon,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { currentMonth, describePeriod, shiftMonth } from "../month";
import type {
  Transaction,
  TransactionFilters,
  TransactionListSummary,
} from "../types";
import { DateRangePicker } from "./date-range-picker";

const route = getRouteApi("/");

const pluralize = (count: number) =>
  `${count} ${count === 1 ? "transaction" : "transactions"}`;

// `filters` are the resolved filters, so exactly one of `month` or a range is set.
export function MonthNavigator({ filters }: { filters: TransactionFilters }) {
  const navigate = route.useNavigate();
  const thisMonth = currentMonth();
  const { month, from, to } = filters;

  // Each mode clears the other's params, since the API rejects both together.
  // The current month is the default, so it is kept out of the URL.
  const goToMonth = (next: string) =>
    navigate({
      search: (prev) => ({
        ...prev,
        month: next === thisMonth ? undefined : next,
        from: undefined,
        to: undefined,
      }),
    });

  const applyRange = (range: { from: string; to: string }) =>
    navigate({ search: (prev) => ({ ...prev, month: undefined, ...range }) });

  const heading = (
    <h2
      className="min-w-36 text-center text-lg font-semibold tracking-tight"
      aria-live="polite"
    >
      {describePeriod(filters)}
    </h2>
  );

  return (
    <section
      aria-label="Period"
      className="flex flex-wrap items-center justify-between gap-2"
    >
      {month ? (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => goToMonth(shiftMonth(month, -1))}
            aria-label="Previous month"
          >
            <ChevronLeftIcon />
          </Button>
          {heading}
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => goToMonth(shiftMonth(month, 1))}
            aria-label="Next month"
          >
            <ChevronRightIcon />
          </Button>
          {month !== thisMonth && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToMonth(thisMonth)}
            >
              This month
            </Button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {heading}
          <Button
            variant="ghost"
            size="sm"
            // Return to the month the range started in.
            onClick={() =>
              goToMonth((from ?? to)?.slice(0, 7) ?? thisMonth)
            }
          >
            <XIcon data-icon="inline-start" />
            Back to months
          </Button>
        </div>
      )}
      <DateRangePicker
        month={month}
        from={from}
        to={to}
        onApply={applyRange}
      />
    </section>
  );
}

export function MonthSummary({
  transactions,
  summary,
}: {
  transactions: Array<Transaction>;
  summary: TransactionListSummary;
}) {
  const { inflow, outflow, net } = summary;
  // The API totals amounts but not rows per type, so both counts come from
  // the rows on screen.
  const inflowCount = transactions.filter(
    (transaction) => transaction.type === "income",
  ).length;
  const outflowCount = transactions.length - inflowCount;
  const overspent = net < 0;
  // Share of inflow already spent; capped so the bar stays in bounds.
  const spentShare = inflow > 0 ? Math.min((outflow / inflow) * 100, 100) : 0;

  return (
    <section aria-label="Summary">
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
            ? "No inflow in this period"
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
