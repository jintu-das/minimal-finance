import { TrendingDown, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatCurrency } from "@/utils";
import { monthlyCashFlow } from "../placeholder-data";

// Series colors come from the theme's predefined chart tokens in index.css.
const chartConfig = {
  income: {
    label: "Income",
    color: "var(--chart-1)",
  },
  expense: {
    label: "Expenses",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const series = ["income", "expense"] as const;

const compact = new Intl.NumberFormat("en-IN", {
  notation: "compact",
  maximumFractionDigits: 0,
});

const netByMonth = monthlyCashFlow.map((month) => ({
  month: month.month,
  net: month.income - month.expense,
}));
const latest = netByMonth[netByMonth.length - 1];
const previous = netByMonth[netByMonth.length - 2];
const totalSaved = netByMonth.reduce((sum, month) => sum + month.net, 0);
const change =
  previous && previous.net !== 0
    ? Math.round(((latest.net - previous.net) / Math.abs(previous.net)) * 100)
    : null;
const TrendIcon = change !== null && change < 0 ? TrendingDown : TrendingUp;

export function CashFlowChart() {
  return (
    <Card className="border-0 shadow-none ring-1 ring-border">
      <CardHeader>
        <CardTitle>Income vs expenses</CardTitle>
        <CardDescription>Last 6 months</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="flex gap-4 text-xs text-muted-foreground">
          {series.map((key) => (
            <li key={key} className="flex items-center gap-1.5">
              <span
                className="size-2.5"
                style={{ backgroundColor: chartConfig[key].color }}
              />
              {chartConfig[key].label}
            </li>
          ))}
        </ul>

        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-56 w-full"
          aria-hidden="true"
        >
          <BarChart data={monthlyCashFlow} barGap={2}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={40}
              tickFormatter={(value: number) => compact.format(value)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    const key = name as keyof typeof chartConfig;
                    return (
                      <div className="flex w-full items-center gap-1.5">
                        <span
                          className="size-2 shrink-0"
                          style={{ backgroundColor: chartConfig[key].color }}
                        />
                        <span className="text-muted-foreground">
                          {chartConfig[key].label}
                        </span>
                        <span className="ml-auto font-medium text-foreground tabular-nums">
                          {formatCurrency(Number(value))}
                        </span>
                      </div>
                    );
                  }}
                />
              }
            />
            {series.map((key) => (
              <Bar
                key={key}
                dataKey={key}
                fill={`var(--color-${key})`}
                maxBarSize={20}
              />
            ))}
          </BarChart>
        </ChartContainer>

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
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Saved {formatCurrency(latest.net)} in {latest.month}
          {change !== null && (
            <>
              , {change < 0 ? "down" : "up"} {Math.abs(change)}% from{" "}
              {previous.month}
              <TrendIcon aria-hidden="true" className="h-4 w-4" />
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Total saved over the last 6 months: {formatCurrency(totalSaved)}
        </div>
      </CardFooter>
    </Card>
  );
}
