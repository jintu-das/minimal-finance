import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateCategoryForm } from "./create-category-form";

type CreateCategoryProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateCategory({ open, onOpenChange }: CreateCategoryProps) {
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

        <CreateCategoryForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
