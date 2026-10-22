import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CreateTransactionFormValues } from "../schema";
import api from "@/lib/api";
import { categoriesKeys } from "@/features/categories/query-keys";
import { analyticsKeys } from "@/features/analytics/query-keys";
import { transactionKeys } from "../query-keys";

type UpdateTransactionVariables = {
  id: string;
  values: CreateTransactionFormValues;
};

function updateTransaction({ id, values }: UpdateTransactionVariables) {
  return api.patch(`/transactions/${id}`, values);
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTransaction,
    meta: { errorMessage: "Error updating transaction. Please try again." },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      // Categories carry server-computed spent and transactionCount.
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
      queryClient.invalidateQueries({ queryKey: analyticsKeys.all });
      toast.success("Transaction updated successfully.");
    },
  });
}
