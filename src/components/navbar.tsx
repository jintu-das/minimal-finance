import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";

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
      <nav className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
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

        {/* Right: Action button */}
        <Button
          variant="secondary"
          render={
            <Link to="/categories">
              <PlusIcon />
              Add transaction
            </Link>
          }
        />
      </nav>
    </header>
  );
}
