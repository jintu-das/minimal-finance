import { apiGet } from "@/lib/api-get";
import { queryOptions } from "@tanstack/react-query";
import { transactionKeys } from "../query-keys";
import type { TransactionSummary, TransactionSummaryParams } from "../types";

function fetchTransactionSummary({ from, to }: TransactionSummaryParams) {
  return apiGet<TransactionSummary>("/transactions/summary", {
    params: { from, to },
  });
}

export const transactionSummaryQueryOptions = (
  params: TransactionSummaryParams = {},
) =>
  queryOptions({
    queryKey: transactionKeys.summary(params),
    queryFn: () => fetchTransactionSummary(params),
  });
