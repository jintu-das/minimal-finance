import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

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
import { categorySpending } from "../placeholder-data";

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const chartData = categorySpending.map((category) => ({
  category: `category-${category.id}`,
  spent: category.spent,
  fill: `var(--color-category-${category.id})`,
}));

const chartConfig = {
  spent: {
    label: "Spent",
  },
  ...Object.fromEntries(
    categorySpending.map((category, index) => [
      `category-${category.id}`,
      {
        label: category.label,
        color: chartColors[index % chartColors.length],
      },
    ]),
  ),
} satisfies ChartConfig;

const totalSpent = categorySpending.reduce(
  (sum, category) => sum + category.spent,
  0,
);
const topCategory = categorySpending.reduce((top, category) =>
  category.spent > top.spent ? category : top,
);

export function SpendByCategoryChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Spend by category</CardTitle>
        <CardDescription>This month</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="spent"
              nameKey="category"
              stroke="0"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {topCategory.label} is your top expense{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Total spent this month: {formatCurrency(totalSpent)}
        </div>
      </CardFooter>
    </Card>
  );
}
