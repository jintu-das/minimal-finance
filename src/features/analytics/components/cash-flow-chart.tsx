import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils";
import { monthlyCashFlow } from "../placeholder-data";

// Series colors come from the theme's predefined chart tokens in index.css.
const series = [
  { key: "income", label: "Income", className: "bg-chart-1" },
  { key: "expense", label: "Expenses", className: "bg-chart-2" },
] as const;

const ticks = [0, 25000, 50000, 75000, 100000];
const max = ticks[ticks.length - 1];

const compact = new Intl.NumberFormat("en-IN", {
  notation: "compact",
  maximumFractionDigits: 0,
});

export function CashFlowChart() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <Card className="border-0 shadow-none ring-1 ring-border">
      <CardHeader>
        <CardTitle>Income vs expenses</CardTitle>
        <CardDescription>Last 6 months</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="flex gap-4 text-xs text-muted-foreground">
          {series.map((item) => (
            <li key={item.key} className="flex items-center gap-1.5">
              <span className={cn("size-2.5", item.className)} />
              {item.label}
            </li>
          ))}
        </ul>

        <div className="flex h-56 gap-2" aria-hidden="true">
          <div className="relative w-10 shrink-0 text-right text-xs text-muted-foreground tabular-nums">
            {ticks.map((tick) => (
              <span
                key={tick}
                className="absolute right-0 translate-y-1/2"
                style={{ bottom: `${(tick / max) * 100}%` }}
              >
                {compact.format(tick)}
              </span>
            ))}
          </div>

          <div className="relative flex flex-1 items-end justify-around border-b border-border">
            {ticks.slice(1).map((tick) => (
              <div
                key={tick}
                className="absolute inset-x-0 border-t border-dashed border-border/60"
                style={{ bottom: `${(tick / max) * 100}%` }}
              />
            ))}

            {monthlyCashFlow.map((month) => (
              <div
                key={month.month}
                className="relative flex h-full flex-1 items-end justify-center gap-0.5 px-1"
                onMouseEnter={() => setActive(month.month)}
                onMouseLeave={() => setActive(null)}
              >
                {active === month.month && (
                  <div className="pointer-events-none absolute bottom-full z-10 mb-2 w-max border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md">
                    <p className="mb-1 font-medium">{month.month}</p>
                    {series.map((item) => (
                      <p
                        key={item.key}
                        className="flex items-center gap-1.5 tabular-nums"
                      >
                        <span className={cn("size-2", item.className)} />
                        {item.label}: {formatCurrency(month[item.key])}
                      </p>
                    ))}
                  </div>
                )}
                {series.map((item) => (
                  <div
                    key={item.key}
                    className={cn(
                      "w-full max-w-5 transition-opacity",
                      item.className,
                      active && active !== month.month && "opacity-40",
                    )}
                    style={{ height: `${(month[item.key] / max) * 100}%` }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pl-12 text-xs text-muted-foreground">
          {monthlyCashFlow.map((month) => (
            <span key={month.month} className="flex-1 text-center">
              {month.month}
            </span>
          ))}
        </div>

        <table className="sr-only">
          <caption>Monthly income and expenses</caption>
          <thead>
            <tr>
              <th scope="col">Month</th>
              <th scope="col">Income</th>
              <th scope="col">Expenses</th>
            </tr>
          </thead>
          <tbody>
            {monthlyCashFlow.map((month) => (
              <tr key={month.month}>
                <th scope="row">{month.month}</th>
                <td>{formatCurrency(month.income)}</td>
                <td>{formatCurrency(month.expense)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
