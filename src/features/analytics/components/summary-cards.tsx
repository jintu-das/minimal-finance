import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils";
import {
  ArrowDownRight,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { percentChange } from "../date-range";
import type { AnalyticsSummary } from "../types";

export function SummaryCards({
  current,
  previous,
}: {
  current: AnalyticsSummary;
  previous: AnalyticsSummary;
}) {
  const summaries = [
    {
      label: "Net position",
      value: current.netPosition,
      change: percentChange(current.netPosition, previous.netPosition),
      icon: Wallet,
      // Whether an increase is good news for this metric.
      upIsGood: true,
    },
    {
      label: "Earned",
      value: current.totalEarned,
      change: percentChange(current.totalEarned, previous.totalEarned),
      icon: ArrowUpRight,
      upIsGood: true,
    },
    {
      label: "Spent",
      value: current.totalSpent,
      change: percentChange(current.totalSpent, previous.totalSpent),
      icon: ArrowDownRight,
      upIsGood: false,
    },
  ];

  return (
    <section
      aria-label="Monthly summary"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {summaries.map(({ label, value, change, icon: Icon, upIsGood }) => {
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
              <p className="text-3xl font-semibold tracking-tight tabular-nums">
                {formatCurrency(value)}
              </p>
              {change === null ? (
                <p className="text-xs text-muted-foreground">
                  No data for last month
                </p>
              ) : (
                <ChangeBadge change={change} upIsGood={upIsGood} />
              )}
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}

function ChangeBadge({
  change,
  upIsGood,
}: {
  change: number;
  upIsGood: boolean;
}) {
  const isUp = change >= 0;
  const isGood = isUp === upIsGood;
  const TrendIcon = isUp ? TrendingUp : TrendingDown;

  return (
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
      vs same period last month
    </p>
  );
}
