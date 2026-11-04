import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

// Shared income/expense tints, so every page uses the same soft colors.
const typeTone = {
  income: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  expense: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
} as const;

export function TypeIcon({
  type,
  className,
}: {
  type: "income" | "expense";
  className?: string;
}) {
  const Icon = type === "income" ? ArrowUpRight : ArrowDownRight;

  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center",
        typeTone[type],
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-4" />
    </span>
  );
}
