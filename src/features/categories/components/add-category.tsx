import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddCategoryForm } from "./add-category-form";

type AddCategoryProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddCategory({ open, onOpenChange }: AddCategoryProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
          <DialogDescription>
            Create a category to organize your transactions and track your
            budget.
          </DialogDescription>
        </DialogHeader>

        <AddCategoryForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
