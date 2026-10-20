import api from "@/lib/api";
import { queryOptions } from "@tanstack/react-query";
import { transactionKeys } from "../query-keys";
import type { TransactionSummary, TransactionSummaryParams } from "../types";

async function fetchTransactionSummary({ from, to }: TransactionSummaryParams) {
  const { data } = await api.get<TransactionSummary>("/transactions/summary", {
    params: { from, to },
  });
  return data;
}

export const transactionSummaryQueryOptions = (
  params: TransactionSummaryParams = {},
) =>
  queryOptions({
    queryKey: transactionKeys.summary(params),
    queryFn: () => fetchTransactionSummary(params),
  });
