import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { AddCategoryForm } from "./add-category-form";

export function AddCategory() {
  return (
    <Dialog>
      <form>
        <DialogTrigger
          render={
            <Button variant="outline">
              <Plus /> Category
            </Button>
          }
        />
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
            <DialogDescription>
              Create a category to organize your transactions and track your budget.
            </DialogDescription>
          </DialogHeader>

          <AddCategoryForm />
        </DialogContent>
      </form>
    </Dialog>
  );
}
