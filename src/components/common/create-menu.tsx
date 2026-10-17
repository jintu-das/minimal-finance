import { useState } from "react";
import { ArrowLeftRight, FolderPlus, PlusIcon } from "lucide-react";
import { CreateTransaction } from "@/features/transactions/components/create-transaction";
import { CreateCategory } from "@/features/categories/components/create-category";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function CreateMenu() {
  const [transactionOpen, setTransactionOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button aria-label="Create new" variant="default">
              <PlusIcon aria-hidden="true" />
              Create
            </Button>
          }
        />
        <DropdownMenuContent className="w-52" align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Create new</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setTransactionOpen(true)}>
              <ArrowLeftRight />
              Transaction
              <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCategoryOpen(true)}>
              <FolderPlus />
              Category
              <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateTransaction
        open={transactionOpen}
        onOpenChange={setTransactionOpen}
      />
      <CreateCategory open={categoryOpen} onOpenChange={setCategoryOpen} />
    </>
  );
}
