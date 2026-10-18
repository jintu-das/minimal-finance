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

export type TransactionType = Transaction["type"];

export type TransactionFilters = {
  type?: TransactionType;
  search?: string;
};
