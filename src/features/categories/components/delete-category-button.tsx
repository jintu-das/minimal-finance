import { useState } from "react";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDeleteCategory } from "../api/delete-category.api";
import type { Category } from "../types";

export function DeleteCategoryButton({ category }: { category: Category }) {
  const [open, setOpen] = useState(false);
  const deleteCategory = useDeleteCategory();
  // The backend foreign key blocks deleting a category that has transactions.
  const hasTransactions = category.transactionCount > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Delete ${category.label}`}
            title={
              hasTransactions
                ? "Categories with transactions cannot be deleted"
                : undefined
            }
            disabled={hasTransactions}
          />
        }
      >
        <Trash2Icon />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {category.label}?</DialogTitle>
          <DialogDescription>
            This permanently removes the category and cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <Button
            variant="destructive"
            disabled={deleteCategory.isPending}
            onClick={() =>
              deleteCategory.mutate(category.id, {
                onSuccess: () => setOpen(false),
              })
            }
          >
            {deleteCategory.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
