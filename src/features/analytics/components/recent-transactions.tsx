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
import {
  monthSearchParam,
  periodPhrase,
} from "@/features/transactions/month";
import type { Transaction } from "@/features/transactions/types";

export function RecentTransactions({
  month,
  thisMonth,
  transactions,
  className,
}: {
  // The "yyyy-MM" month the transactions belong to, and the current month it
  // was loaded against.
  month: string;
  thisMonth: string;
  transactions: Array<Transaction>;
  className?: string;
}) {
  const isThisMonth = month === thisMonth;
  const period = isThisMonth ? "this month" : periodPhrase({ month });

  return (
    <Card className={cn("border-0 shadow-none ring-1 ring-border", className)}>
      <CardHeader>
        <CardTitle>Recent transactions</CardTitle>
        <CardDescription>Your latest activity {period}</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm" render={
              <Link
                to="/"
                search={{ month: monthSearchParam(month, thisMonth) }}
              />
            }>
            View all
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {isThisMonth
              ? "No transactions this month yet."
              : `No transactions ${period}.`}
          </p>
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
