import { Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
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
        <CardDescription>Your latest activity</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm" render={<Link to="/" />}>
            View all
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No transactions yet.</p>
        ) : (
          <ul className="divide-y">
            {transactions.map((transaction) => {
              const isIncome = transaction.type === "income";
              const Icon = isIncome ? ArrowUpRight : ArrowDownRight;

              return (
                <li
                  key={transaction.id}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center bg-muted text-muted-foreground">
                    <Icon aria-hidden="true" className="size-4" />
                  </span>
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
