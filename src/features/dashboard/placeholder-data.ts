import type {
  CategorySpending,
  DashboardInsight,
  MonthlyCashFlow,
  RecentTransaction,
} from "./types";

// Static data shown until the dashboard API exists.
export const dashboardSummary = {
  balance: 184250,
  income: 92000,
  expense: 61840,
  savingsRate: 32.8,
  change: {
    balance: 8.4,
    income: 2.1,
    expense: 12.3,
    savingsRate: -4.6,
  },
};

export const monthlyCashFlow: Array<MonthlyCashFlow> = [
  { month: "May", income: 88000, expense: 54200 },
  { month: "Jun", income: 88000, expense: 58900 },
  { month: "Jul", income: 90500, expense: 51300 },
  { month: "Aug", income: 90500, expense: 63700 },
  { month: "Sep", income: 90100, expense: 55050 },
  { month: "Oct", income: 92000, expense: 61840 },
];

export const categorySpending: Array<CategorySpending> = [
  { id: "1", label: "Rent", spent: 25000, budget: 25000 },
  { id: "2", label: "Dining", spent: 9200, budget: 10000 },
  { id: "3", label: "Groceries", spent: 7450, budget: 12000 },
  { id: "4", label: "Shopping", spent: 8500, budget: 10000 },
  { id: "5", label: "Transport", spent: 3900, budget: 6000 },
];

export const dashboardInsights: Array<DashboardInsight> = [
  {
    id: "1",
    tone: "warning",
    title: "Dining is up 40% this week",
    description:
      "Weekend orders pushed dining to 92% of budget with 11 days left.",
  },
  {
    id: "2",
    tone: "positive",
    title: "Groceries are well under budget",
    description: "62% used so far, ₹1,800 less than this time last month.",
  },
  {
    id: "3",
    tone: "tip",
    title: "Move ₹5,000 to savings",
    description:
      "You're on pace to end October ₹30,000 under. Saving ₹5,000 now still leaves a buffer.",
  },
];

export const recentTransactions: Array<RecentTransaction> = [
  {
    id: "1",
    title: "Salary",
    category: "Income",
    date: "2026-10-18",
    amount: 92000,
    type: "income",
  },
  {
    id: "2",
    title: "Weekend dinner",
    category: "Dining",
    date: "2026-10-18",
    amount: 2400,
    type: "expense",
  },
  {
    id: "3",
    title: "Weekly groceries",
    category: "Groceries",
    date: "2026-10-17",
    amount: 3150,
    type: "expense",
  },
  {
    id: "4",
    title: "Metro card top-up",
    category: "Transport",
    date: "2026-10-16",
    amount: 1000,
    type: "expense",
  },
  {
    id: "5",
    title: "Running shoes",
    category: "Shopping",
    date: "2026-10-15",
    amount: 4800,
    type: "expense",
  },
];
