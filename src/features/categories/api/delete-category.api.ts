import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import { categoriesKeys } from "../query-keys";

function deleteCategory(id: string) {
  return api.delete(`/categories/${id}`);
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    meta: { errorMessage: "Error deleting category. Please try again." },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
      toast.success("Category deleted successfully.");
    },
  });
}
