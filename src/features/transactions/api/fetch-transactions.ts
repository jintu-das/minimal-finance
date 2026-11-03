import api from "@/lib/api";
import { queryOptions } from "@tanstack/react-query";
import { transactionKeys } from "../query-keys";
import type {
  Transaction,
  TransactionFilters,
  TransactionList,
  TransactionListSummary,
} from "../types";

// The API rejects unknown and empty params, so only keys with values are sent.
export function buildTransactionParams(filters: TransactionFilters) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }
  return params;
}

const SUMMARY_KEYS = ["count", "inflow", "outflow", "net"] as const;

function isListSummary(meta: unknown): meta is TransactionListSummary {
  return (
    typeof meta === "object" &&
    meta !== null &&
    SUMMARY_KEYS.every((key) => Number.isFinite((meta as never)[key]))
  );
}

async function fetchTransactions(
  filters: TransactionFilters,
): Promise<TransactionList> {
  const { data, meta } = await api.get<Array<Transaction>>("/transactions", {
    params: buildTransactionParams(filters),
  });
  // The list envelope's meta carries totals for the same filters as the rows.
  // Reject a body without them rather than show wrong totals.
  if (!isListSummary(meta)) {
    throw new Error("Received an unexpected response from the server.");
  }
  const { count, inflow, outflow, net } = meta;
  return { transactions: data, summary: { count, inflow, outflow, net } };
}

export const transactionsQueryOptions = (filters: TransactionFilters = {}) =>
  queryOptions({
    queryKey: transactionKeys.list(filters),
    queryFn: () => fetchTransactions(filters),
  });
