import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/utils";
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import type { Transaction } from "../types";

export function TransactionHeader({
  transactions,
}: {
  transactions: Array<Transaction>;
}) {
  const expenses = transactions.filter(({ type }) => type === "expense");
  const income = transactions.filter(({ type }) => type === "income");
  const totalSpent = expenses.reduce((total, { amount }) => total + amount, 0);
  const totalEarned = income.reduce((total, { amount }) => total + amount, 0);
  const netTotal = totalEarned - totalSpent;

  const summaries = [
    {
      label: "Net position",
      amount: netTotal,
      detail: "Income minus expenses",
      icon: Wallet,
      showSign: true,
    },
    {
      label: "Total spent",
      amount: totalSpent,
      detail: `${expenses.length} outgoing transactions`,
      icon: ArrowDownRight,
      showSign: false,
    },
    {
      label: "Total earned",
      amount: totalEarned,
      detail: `${income.length} incoming transactions`,
      icon: ArrowUpRight,
      showSign: false,
    },
  ];

  return (
    <section
      aria-label="Transaction summary"
      className="grid gap-4 sm:grid-cols-3"
    >
      {summaries.map(({ label, amount, detail, icon: Icon, showSign }) => (
        <Card
          key={label}
          size="sm"
          className="rounded-xl border-0 shadow-none ring-1 ring-border transition-colors hover:bg-muted/30"
        >
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {label}
            </CardTitle>
            <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Icon aria-hidden="true" className="size-4" />
            </span>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <p className="text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
              {showSign && amount > 0 ? "+" : ""}
              {formatCurrency(amount)}
            </p>
            <CardDescription className="text-xs">{detail}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
