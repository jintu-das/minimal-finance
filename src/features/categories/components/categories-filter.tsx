import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { getRouteApi } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

const route = getRouteApi("/categories");

export function CategoriesFilter() {
  const { search } = route.useSearch();
  const navigate = route.useNavigate();
  const [input, setInput] = useState(search ?? "");

  useEffect(() => {
    const next = input.trim() || undefined;
    if (next === search) return;
    const timeout = setTimeout(
      () =>
        navigate({
          search: (prev) => ({ ...prev, search: next }),
          replace: true,
        }),
      300,
    );
    return () => clearTimeout(timeout);
  }, [input, search, navigate]);

  return (
    <section aria-label="Category filters">
      <InputGroup className="max-w-xs">
        <InputGroupInput
          type="search"
          placeholder="Search by name..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
    </section>
  );
}
