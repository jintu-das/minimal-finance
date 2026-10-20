import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TransactionType } from "../types";
import { useEffect, useState } from "react";
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
        <TabsList variant="line">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="income">Inflow</TabsTrigger>
          <TabsTrigger value="expense">Outflow</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-2">
        <InputGroup className="max-w-xs">
          <InputGroupInput
            type="search"
            placeholder="Search by title..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
        <Button onClick={() => setCreateOpen(true)} size="icon">
          <PlusIcon />
        </Button>
      </div>
      <CreateTransaction open={createOpen} onOpenChange={setCreateOpen} />
    </section>
  );
}
