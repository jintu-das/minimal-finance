import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import { categoriesKeys } from "@/features/categories/query-keys";
import { analyticsKeys } from "@/features/analytics/query-keys";
import { transactionKeys } from "../query-keys";

function deleteTransaction(id: string) {
  return api.delete(`/transactions/${id}`);
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTransaction,
    meta: { errorMessage: "Error deleting transaction. Please try again." },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      // Categories carry server-computed spent and transactionCount.
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
      queryClient.invalidateQueries({ queryKey: analyticsKeys.all });
      toast.success("Transaction deleted successfully.");
    },
  });
}
