import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TransactionForm } from "./transaction-form";

type CreateTransactionProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateTransaction({
  open,
  onOpenChange,
}: CreateTransactionProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Transaction</DialogTitle>
          <DialogDescription>
            Record an income or expense against one of your categories.
          </DialogDescription>
        </DialogHeader>

        <TransactionForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
