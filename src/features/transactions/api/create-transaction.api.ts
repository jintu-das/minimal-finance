import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CreateTransactionFormValues } from "../schema";
import api from "@/lib/api";
import { categoriesKeys } from "@/features/categories/query-keys";
import { analyticsKeys } from "@/features/analytics/query-keys";
import { transactionKeys } from "../query-keys";

function createTransaction(values: CreateTransactionFormValues) {
  return api.post("/transactions", values);
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTransaction,
    meta: { errorMessage: "Error creating transaction. Please try again." },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      // Categories carry server-computed spent and transactionCount.
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
      queryClient.invalidateQueries({ queryKey: analyticsKeys.all });
      toast.success("Transaction created successfully.");
    },
  });
}
