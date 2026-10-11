import { Link } from "@tanstack/react-router";
import { ArrowLeftRight, FolderPlus, PlusIcon } from "lucide-react";
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

const menuItems = [
  {
    id: 1,
    title: "Transactions",
    to: "/",
  },
  {
    id: 2,
    title: "Categories",
    to: "/categories",
  },
];

export function AppNavbar() {
  return (
    <header className="border-b">
      <nav className="container mx-auto flex h-16 items-center justify-start gap-2">
        <div className="flex items-center gap-4 flex-1">
          {menuItems.map((menu) => (
            <Link
              key={menu.id}
              to={menu.to}
              className="text-sm text-muted-foreground transition-colors hover:text-primary [&.active]:font-medium [&.active]:text-black [&.active]:border-b-2 border-black pb-2"
            >
              {menu.title}
            </Link>
          ))}
        </div>

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
              <DropdownMenuItem>
                <FolderPlus />
                Category
                <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* <Button size="icon" variant="secondary">
          <MoonIcon />
        </Button> */}
        {/* <Button size="icon" variant="default">
          <User2 />
        </Button> */}
      </nav>
    </header>
  );
}
