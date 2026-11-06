export type Transaction = {
  amount: number;
  categoryId: string;
  createdAt: string;
  date: string;
  id: string;
  title: string;
  type: "expense" | "income";
  updatedAt: string;
  category: {
    id: string;
    label: string;
  };
};

export type TransactionSummary = {
  from: string;
  to: string;
  totalEarned: number;
  totalSpent: number;
  netPosition: number;
};

export type TransactionSummaryParams = {
  from?: string;
  to?: string;
};

export type TransactionType = Transaction["type"];

// Totals the API returns in the list envelope `meta`, for the same filters.
export type TransactionListSummary = {
  count: number;
  inflow: number;
  outflow: number;
  net: number;
};

export type TransactionList = {
  transactions: Array<Transaction>;
  summary: TransactionListSummary;
};

// `month` is a yyyy-MM calendar month, bucketed by the API in IST.
export type TransactionFilters = {
  type?: TransactionType;
  search?: string;
  month?: string;
};
