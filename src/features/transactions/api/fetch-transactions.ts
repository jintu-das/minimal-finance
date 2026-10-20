import api from "@/lib/api";
import { queryOptions } from "@tanstack/react-query";
import { transactionKeys } from "../query-keys";
import type { Transaction, TransactionFilters } from "../types";

async function fetchTransactions({ type, search }: TransactionFilters) {
  const { data } = await api.get<Array<Transaction>>("/transactions", {
    params: { type, search },
  });
  return data;
}

export const transactionsQueryOptions = (filters: TransactionFilters = {}) =>
  queryOptions({
    queryKey: transactionKeys.list(filters),
    queryFn: () => fetchTransactions(filters),
  });
