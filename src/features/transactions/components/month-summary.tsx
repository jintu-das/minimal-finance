import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils";
import {
  ArrowDownRight,
  ArrowUpRight,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import type { Transaction, TransactionListSummary } from "../types";

const pluralize = (count: number) =>
  `${count} ${count === 1 ? "transaction" : "transactions"}`;

export function MonthSummary({
  transactions,
  summary,
}: {
  transactions: Array<Transaction>;
  summary: TransactionListSummary;
}) {
  const { count, inflow, outflow, net } = summary;
  // The API counts rows in total but not per type, so the income count comes
  // from the rows on screen and the rest of the API total is outflow.
  const inflowCount = transactions.filter(
    (transaction) => transaction.type === "income",
  ).length;
  const outflowCount = Math.max(count - inflowCount, 0);
  const overspent = net < 0;
  const spentShare = inflow > 0 ? (outflow / inflow) * 100 : 0;

  return (
    <section aria-label="Summary">
      {/* Net position spans the row on mobile, with earned and spent below. */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        <SummaryCard
          label="Net position"
          value={net}
          icon={Wallet}
          tone={overspent ? "text-destructive" : undefined}
          className="col-span-2 sm:col-span-1"
        >
          {inflow === 0
            ? "No inflow in this period"
            : overspent
              ? `Overspent by ${formatCurrency(-net)}`
              : `Spent ${Math.round(spentShare)}% of inflow`}
        </SummaryCard>
        <SummaryCard
          label="Earned"
          value={inflow}
          icon={ArrowUpRight}
          tone="text-emerald-600 dark:text-emerald-400"
        >
          {pluralize(inflowCount)}
        </SummaryCard>
        <SummaryCard
          label="Spent"
          value={outflow}
          icon={ArrowDownRight}
          tone="text-rose-600 dark:text-rose-400"
        >
          {pluralize(outflowCount)}
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
  className,
  children,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  // Text color for the icon. Negative values are always shown as destructive.
  tone?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Card
      size="sm"
      className={cn(
        "min-w-0 border-0 shadow-none ring-1 ring-border",
        className,
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center bg-muted text-muted-foreground",
            tone,
          )}
        >
          <Icon aria-hidden="true" className="size-4" />
        </span>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <p
          className={cn(
            "truncate text-xl font-semibold tracking-tight tabular-nums sm:text-3xl",
            value < 0 && "text-destructive",
          )}
        >
          {formatCurrency(value)}
        </p>
        <div className="text-xs text-muted-foreground">{children}</div>
      </CardContent>
    </Card>
  );
}
