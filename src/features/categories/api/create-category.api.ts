import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CreateCategoryFormValues } from "../schema";
import api from "@/lib/api";
import { categoriesKeys } from "../query-keys";

function createCategory(values: CreateCategoryFormValues) {
  return api.post("/categories", values);
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    meta: { errorMessage: "Error creating category. Please try again." },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
      toast.success("Category created successfully.");
    },
  });
}
