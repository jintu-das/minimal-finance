import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/utils";
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { transactionSummaryQueryOptions } from "../api/fetch-transaction-summary.api";

export function TransactionHeader() {
  const { data } = useSuspenseQuery(transactionSummaryQueryOptions());

  const summaries = [
    {
      label: "Net position",
      amount: data.netPosition,
      detail: "Income minus expenses this month",
      icon: Wallet,
      showSign: true,
    },
    {
      label: "Total spent",
      amount: data.totalSpent,
      detail: "Outgoing this month",
      icon: ArrowDownRight,
      showSign: false,
    },
    {
      label: "Total earned",
      amount: data.totalEarned,
      detail: "Incoming this month",
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
