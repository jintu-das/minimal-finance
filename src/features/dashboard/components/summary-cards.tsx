import {
  ArrowDownRight,
  ArrowUpRight,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils";
import { dashboardSummary } from "../placeholder-data";

const { change } = dashboardSummary;

const summaries = [
  {
    label: "Balance",
    value: formatCurrency(dashboardSummary.balance),
    change: change.balance,
    icon: Wallet,
    // Whether an increase is good news for this metric.
    upIsGood: true,
  },
  {
    label: "Income",
    value: formatCurrency(dashboardSummary.income),
    change: change.income,
    icon: ArrowUpRight,
    upIsGood: true,
  },
  {
    label: "Expenses",
    value: formatCurrency(dashboardSummary.expense),
    change: change.expense,
    icon: ArrowDownRight,
    upIsGood: false,
  },
  {
    label: "Savings rate",
    value: `${dashboardSummary.savingsRate}%`,
    change: change.savingsRate,
    icon: PiggyBank,
    upIsGood: true,
  },
];

export function SummaryCards() {
  return (
    <section
      aria-label="Monthly summary"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {summaries.map(({ label, value, change, icon: Icon, upIsGood }) => {
        const isUp = change >= 0;
        const isGood = isUp === upIsGood;
        const TrendIcon = isUp ? TrendingUp : TrendingDown;

        return (
          <Card
            key={label}
            size="sm"
            className="border-0 shadow-none ring-1 ring-border"
          >
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <span className="flex size-8 items-center justify-center bg-muted text-muted-foreground">
                <Icon aria-hidden="true" className="size-4" />
              </span>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              <p className="text-2xl font-semibold tracking-tight tabular-nums">
                {value}
              </p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 font-medium tabular-nums",
                    isGood
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-destructive",
                  )}
                >
                  <TrendIcon aria-hidden="true" className="size-3.5" />
                  {isUp ? "+" : ""}
                  {change}%
                </span>
                vs last month
              </p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
