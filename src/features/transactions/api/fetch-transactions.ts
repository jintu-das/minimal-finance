import { apiGet } from "@/lib/api-get";
import { queryOptions } from "@tanstack/react-query";
import { transactionKeys } from "../query-keys";
import type { Transaction, TransactionFilters } from "../types";

function fetchTransactions({ type, search }: TransactionFilters) {
  return apiGet<Array<Transaction>>("/transactions", {
    params: { type, search },
  });
}

export const transactionsQueryOptions = (filters: TransactionFilters = {}) =>
  queryOptions({
    queryKey: transactionKeys.list(filters),
    queryFn: () => fetchTransactions(filters),
  });
