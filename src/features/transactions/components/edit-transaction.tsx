import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Transaction } from "../types";
import { TransactionForm } from "./transaction-form";

type EditTransactionProps = {
  transaction: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditTransaction({
  transaction,
  open,
  onOpenChange,
}: EditTransactionProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>
            Update the details of {transaction.title}.
          </DialogDescription>
        </DialogHeader>

        <TransactionForm
          transaction={transaction}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
