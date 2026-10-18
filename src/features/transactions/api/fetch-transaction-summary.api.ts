import api from "@/lib/api";
import { queryOptions } from "@tanstack/react-query";
import { transactionKeys } from "../query-keys";
import type { TransactionSummary, TransactionSummaryParams } from "../types";

function fetchTransactionSummary({ from, to }: TransactionSummaryParams) {
  return api.get<TransactionSummary>("/transactions/summary", {
    params: { from, to },
  });
}

export const transactionSummaryQueryOptions = (
  params: TransactionSummaryParams = {},
) =>
  queryOptions({
    queryKey: transactionKeys.summary(params),
    queryFn: () => fetchTransactionSummary(params),
    select: (data) => data.data,
  });
