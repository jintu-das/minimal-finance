import { AlertTriangleIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/utils";
import { categorySpending } from "../placeholder-data";

// Share of budget at which a category is flagged.
const WARNING_THRESHOLD = 90;

export function BudgetOverview() {
  return (
    <Card className="border-0 shadow-none ring-1 ring-border">
      <CardHeader>
        <CardTitle>Budgets</CardTitle>
        <CardDescription>Spending against this month's budgets</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-x-10 gap-y-5 md:grid-cols-1">
          {categorySpending.map((category) => {
            const percent = Math.round(
              (category.spent / category.budget) * 100,
            );
            const isNearLimit = percent >= WARNING_THRESHOLD;

            return (
              <li key={category.id} className="space-y-2">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-1.5 font-medium">
                    {category.label}
                    {isNearLimit && (
                      <span className="inline-flex items-center gap-1 text-xs font-normal text-destructive">
                        <AlertTriangleIcon
                          aria-hidden="true"
                          className="size-3.5"
                        />
                        {percent >= 100 ? "At limit" : "Near limit"}
                      </span>
                    )}
                  </span>
                  <span className="text-muted-foreground tabular-nums">
                    {formatCurrency(category.spent)} /{" "}
                    {formatCurrency(category.budget)}
                  </span>
                </div>
                <Progress
                  value={Math.min(percent, 100)}
                  aria-label={`${category.label} budget used`}
                  className="*:data-[slot=progress-track]:h-1.5"
                />
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
