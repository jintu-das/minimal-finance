import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { getRouteApi } from "@tanstack/react-router";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { CreateCategory } from "./create-category";

const route = getRouteApi("/categories");

export function CategoriesFilter() {
  const { search } = route.useSearch();
  const navigate = route.useNavigate();
  const [input, setInput] = useState(search ?? "");
  const [createOpen, setCreateOpen] = useState(false);

  const updateSearch = useDebouncedCallback((value: string) => {
    navigate({
      search: (prev) => ({ ...prev, search: value.trim() || undefined }),
      replace: true,
    });
  }, 300);

  return (
    <section
      aria-label="Category filters"
      className="flex items-center justify-between gap-4"
    >
      <InputGroup className="max-w-xs">
        <InputGroupInput
          type="search"
          placeholder="Search by name..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            updateSearch(e.target.value);
          }}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
      <Button size="icon" onClick={() => setCreateOpen(true)}>
        <PlusIcon />
      </Button>
      <CreateCategory open={createOpen} onOpenChange={setCreateOpen} />
    </section>
  );
}
