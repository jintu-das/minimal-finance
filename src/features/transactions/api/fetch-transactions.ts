import api from "@/lib/api";
import { queryOptions } from "@tanstack/react-query";
import { transactionKeys } from "../query-keys";
import type { Transaction, TransactionFilters } from "../types";

function fetchTransactions({ type }: TransactionFilters) {
  return api.get<Array<Transaction>>("/transactions", {
    params: type ? { type } : undefined,
  });
}

export const transactionsQueryOptions = (filters: TransactionFilters = {}) =>
  queryOptions({
    queryKey: transactionKeys.list(filters),
    queryFn: () => fetchTransactions(filters),
    select: (data) => data.data,
  });
