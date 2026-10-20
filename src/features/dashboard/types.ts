export type MonthlyCashFlow = {
  month: string;
  income: number;
  expense: number;
};

export type CategorySpending = {
  id: string;
  label: string;
  spent: number;
  budget: number;
};

export type InsightTone = "warning" | "positive" | "tip";

export type DashboardInsight = {
  id: string;
  tone: InsightTone;
  title: string;
  description: string;
};

export type RecentTransaction = {
  id: string;
  title: string;
  category: string;
  date: string;
  amount: number;
  type: "income" | "expense";
};
