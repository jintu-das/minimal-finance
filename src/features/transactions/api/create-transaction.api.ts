import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CreateTransactionFormValues } from "../schema";
import api from "@/lib/api";

function createTransaction(values: CreateTransactionFormValues) {
  return api.post("/transactions", values);
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTransaction,
    onError: (error) => {
      toast.error("Error creating transaction. Please try again.");
      console.error("Error creating transaction:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction created successfully.");
    },
  });
}
