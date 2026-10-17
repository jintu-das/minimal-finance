import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AddCategoryFormValues } from "../schema";
import api from "@/lib/api";

function createCategory(values: AddCategoryFormValues) {
  return api.post("/categories", values);
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onError: (error) => {
      toast.error("Error creating category. Please try again.");
      console.error("Error creating category:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully.");
    },
  });
}
