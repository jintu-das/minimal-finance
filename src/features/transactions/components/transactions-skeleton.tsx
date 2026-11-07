import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { TransactionsPageHeader } from "./transactions-page-header";

const ROW_COUNT = 6;

// Mirrors MonthSummary: net position spans the row on mobile.
export function MonthSummarySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
      {["col-span-2 sm:col-span-1", undefined, undefined].map(
        (className, index) => (
          <Card
            key={index}
            size="sm"
            className={cn(
              "min-w-0 border-0 shadow-none ring-1 ring-border",
              className,
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="size-8 shrink-0" />
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Skeleton className="h-7 w-32 sm:h-9" />
              <Skeleton className="h-3 w-28" />
            </CardContent>
          </Card>
        ),
      )}
    </div>
  );
}

// Mirrors transactionColumns: date and category are hidden on mobile.
export function TransactionsTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden sm:table-cell">
            <Skeleton className="h-4 w-12" />
          </TableHead>
          <TableHead className="w-full sm:w-auto">
            <Skeleton className="h-4 w-12" />
          </TableHead>
          <TableHead className="hidden sm:table-cell">
            <Skeleton className="h-4 w-16" />
          </TableHead>
          <TableHead>
            <Skeleton className="ml-auto h-4 w-16" />
          </TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: ROW_COUNT }, (_, index) => (
          <TableRow key={index}>
            <TableCell className="hidden sm:table-cell">
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell className="w-full sm:w-auto">
              <div className="flex items-center gap-3">
                <Skeleton className="size-8 shrink-0" />
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-32 sm:w-40" />
                  <Skeleton className="h-3 w-24 sm:hidden" />
                </div>
              </div>
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              <Skeleton className="h-5 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="ml-auto h-4 w-16" />
            </TableCell>
            <TableCell>
              <Skeleton className="ml-auto size-8" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// Route pending page for "/", shown while the first load of the
// transactions is in flight. Matches the layout of the loaded page.
export function TransactionsPageSkeleton() {
  return (
    <main className="container mx-auto space-y-8 pt-8" aria-busy="true">
      <span className="sr-only" role="status">
        Loading transactions
      </span>
      <TransactionsPageHeader />
      <div className="flex items-center gap-1 sm:gap-2">
        <Skeleton className="size-8" />
        <Skeleton className="h-6 w-32 sm:w-36" />
        <Skeleton className="size-8" />
      </div>
      <MonthSummarySkeleton />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Skeleton className="h-9 w-56 sm:flex-1 sm:max-w-56" />
        <div className="flex w-full items-center gap-2 sm:ml-auto sm:w-auto">
          <Skeleton className="h-9 flex-1 sm:w-64 sm:flex-none" />
          <Skeleton className="h-9 w-9 shrink-0 sm:w-40" />
        </div>
      </div>
      <TransactionsTableSkeleton />
    </main>
  );
}
