import { Link } from "@tanstack/react-router";
import { TypeIcon } from "@/components/common/type-icon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/utils";
import type { Transaction } from "@/features/transactions/types";

export function RecentTransactions({
  transactions,
}: {
  transactions: Array<Transaction>;
}) {
  return (
    <Card className="border-0 shadow-none ring-1 ring-border">
      <CardHeader>
        <CardTitle>Recent transactions</CardTitle>
        <CardDescription>Your latest activity this month</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm" render={<Link to="/" />}>
            View all
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No transactions this month yet.</p>
        ) : (
          <ul className="divide-y">
            {transactions.map((transaction) => {
              const isIncome = transaction.type === "income";

              return (
                <li
                  key={transaction.id}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <TypeIcon type={transaction.type} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {transaction.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.category.label} ·{" "}
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium tabular-nums",
                      isIncome
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-muted-foreground",
                    )}
                  >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
