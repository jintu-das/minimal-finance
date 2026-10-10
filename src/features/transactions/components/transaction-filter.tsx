import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchIcon } from "lucide-react";

export function TransactionFilter() {
  return (
    <section
      aria-label="Transaction filters"
      className="flex flex-col gap-4 sm:flex-row sm:items-center"
    >
      <Tabs defaultValue="overview" className="min-w-0 flex-1">
        <TabsList variant="line">
          <TabsTrigger value="overview">All</TabsTrigger>
          <TabsTrigger value="analytics">Inflow</TabsTrigger>
          <TabsTrigger value="reports">Outflow</TabsTrigger>
        </TabsList>
      </Tabs>

      <InputGroup className="max-w-xs">
        <InputGroupInput type="search" placeholder="Search..." />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
    </section>
  );
}
