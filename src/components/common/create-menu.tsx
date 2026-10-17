import { useState } from "react";
import { ArrowLeftRight, FolderPlus, PlusIcon } from "lucide-react";
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
            <DropdownMenuItem>
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
      <CreateCategory open={categoryOpen} onOpenChange={setCategoryOpen} />
    </>
  );
}
