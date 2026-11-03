import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { endOfMonth } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { istToday, parseDay, parseMonth, toDay } from "../month";

// The calendar works in local dates; only the picked calendar day matters,
// so it is converted to and from plain yyyy-MM-dd strings for the API.
// An open-ended range is filled in from its one end, and month mode starts
// from the whole month being viewed, so Apply works straight away.
function initialDraft(month?: string, from?: string, to?: string): DateRange {
  const start = from ?? to;
  const end = to ?? from;
  if (start && end) return { from: parseDay(start), to: parseDay(end) };
  if (month) {
    const first = parseMonth(month);
    return { from: first, to: endOfMonth(first) };
  }
  return { from: undefined };
}

export function DateRangePicker({
  month,
  from,
  to,
  onApply,
}: {
  /** The month being viewed, so the calendar opens there in month mode. */
  month?: string;
  from?: string;
  to?: string;
  onApply: (range: { from: string; to: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange | undefined>();

  const apply = () => {
    if (!draft?.from) return;
    // A single click selects one day, which the API accepts as from = to.
    onApply({ from: toDay(draft.from), to: toDay(draft.to ?? draft.from) });
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (next) setDraft(initialDraft(month, from, to));
        setOpen(next);
      }}
    >
      <PopoverTrigger
        render={<Button variant="outline" size="sm" className="shrink-0" />}
      >
        <CalendarIcon data-icon="inline-start" />
        <span className="sr-only sm:not-sr-only">Custom range</span>
      </PopoverTrigger>
      <PopoverContent className="w-auto gap-0 p-0" align="end">
        <Calendar
          mode="range"
          selected={draft}
          onSelect={setDraft}
          defaultMonth={draft?.from}
          today={istToday()}
        />
        <div className="flex justify-end gap-2 border-t p-3">
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={apply} disabled={!draft?.from}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
