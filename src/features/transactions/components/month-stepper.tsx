import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { ReactNode } from "react";
import { formatMonth, shiftMonth } from "../month";

function PeriodHeading({ children }: { children: ReactNode }) {
  return (
    <h2
      className="truncate text-center text-base font-semibold tracking-tight sm:min-w-36 sm:text-lg"
      aria-live="polite"
    >
      {children}
    </h2>
  );
}

// Previous/next month controls around the month heading, with a shortcut back
// to the current month. Shared by the transactions and analytics pages.
// `thisMonth` comes from the caller so it matches the month its data was
// loaded for, and `max` (if set) is the last month Next can reach.
// Renders its own labelled section, so pages place it directly.
export function MonthStepper({
  month,
  thisMonth,
  max,
  onChange,
}: {
  month: string;
  thisMonth: string;
  max?: string;
  onChange: (month: string) => void;
}) {
  // "yyyy-MM" strings compare in calendar order.
  const atMax = max !== undefined && month >= max;

  return (
    <section
      aria-label="Period"
      className="flex min-w-0 items-center gap-1 sm:gap-2"
    >
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => onChange(shiftMonth(month, -1))}
        aria-label="Previous month"
      >
        <ChevronLeftIcon />
      </Button>
      <PeriodHeading>{formatMonth(month)}</PeriodHeading>
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => onChange(shiftMonth(month, 1))}
        disabled={atMax}
        aria-label="Next month"
      >
        <ChevronRightIcon />
      </Button>
      {month !== thisMonth && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onChange(thisMonth)}
        >
          This month
        </Button>
      )}
    </section>
  );
}
