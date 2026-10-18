import type { TransactionFilters } from "./types";

// const todoKeys = {
//   all: ["todos"] as const,
//   lists: () => [...todoKeys.all, "list"] as const,
//   list: (filters: string) => [...todoKeys.lists(), { filters }] as const,
//   details: () => [...todoKeys.all, "detail"] as const,
//   detail: (id: number) => [...todoKeys.details(), id] as const,
// };

export const transactionKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionKeys.all, "list"] as const,
  list: (filters: TransactionFilters) =>
    [...transactionKeys.lists(), filters] as const,
  details: () => [...transactionKeys.all, "detail"] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
};
