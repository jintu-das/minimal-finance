import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEARCH_MAX_LENGTH } from "../schema";
import type { TransactionType } from "../types";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { getRouteApi } from "@tanstack/react-router";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateTransaction } from "./create-transaction";

const route = getRouteApi("/");

export function TransactionFilter() {
  const { type, search } = route.useSearch();
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
      aria-label="Transaction filters"
      className="flex flex-col gap-4 sm:flex-row sm:items-center"
    >
      <Tabs
        value={type ?? "all"}
        onValueChange={(value) =>
          navigate({
            search: (prev) => ({
              ...prev,
              type: value === "all" ? undefined : (value as TransactionType),
            }),
          })
        }
        className="min-w-0 flex-1"
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="income">Inflow</TabsTrigger>
          <TabsTrigger value="expense">Outflow</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex w-full items-center gap-2 sm:w-auto">
        <InputGroup className="flex-1 sm:w-64 sm:flex-none">
          <InputGroupInput
            type="search"
            placeholder="Search by title..."
            maxLength={SEARCH_MAX_LENGTH}
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
        <Button onClick={() => setCreateOpen(true)} className="shrink-0">
          <PlusIcon data-icon="inline-start" />
          <span className="sr-only sm:not-sr-only">Add transaction</span>
        </Button>
      </div>
      <CreateTransaction open={createOpen} onOpenChange={setCreateOpen} />
    </section>
  );
}
