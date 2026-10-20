import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Transaction } from "../types";

export function TransactionRowActions({
  transaction,
}: {
  transaction: Transaction;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Actions for ${transaction.title}`}
          >
            <MoreVertical />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {/* TODO: wire up edit transaction */}
        <DropdownMenuItem>
          <Pencil />
          Edit
        </DropdownMenuItem>
        {/* TODO: wire up delete transaction */}
        <DropdownMenuItem variant="destructive">
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
