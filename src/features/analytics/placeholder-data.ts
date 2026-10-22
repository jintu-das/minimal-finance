import type {
  CategorySpending,
  AnalyticsInsight,
  MonthlyCashFlow,
} from "./types";

// Static data shown until the analytics API exists.
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

export const analyticsInsights: Array<AnalyticsInsight> = [
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
