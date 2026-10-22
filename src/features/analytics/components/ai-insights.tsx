import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  LightbulbIcon,
  SparklesIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { analyticsInsights } from "../placeholder-data";
import type { InsightTone } from "../types";

const toneStyles: Record<
  InsightTone,
  { icon: typeof SparklesIcon; label: string; className: string }
> = {
  warning: {
    icon: AlertTriangleIcon,
    label: "Heads up",
    className: "text-destructive",
  },
  positive: {
    icon: CheckCircle2Icon,
    label: "On track",
    className: "text-emerald-600 dark:text-emerald-400",
  },
  tip: {
    icon: LightbulbIcon,
    label: "Suggestion",
    className: "text-amber-600 dark:text-amber-400",
  },
};

export function AiInsights() {
  return (
    <Card className="border-0 shadow-none ring-1 ring-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SparklesIcon aria-hidden="true" className="size-4" />
          AI insights
        </CardTitle>
        <CardDescription>Generated from your recent activity</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-4 md:grid-cols-3">
          {analyticsInsights.map((insight) => {
            const tone = toneStyles[insight.tone];
            const Icon = tone.icon;

            return (
              <li
                key={insight.id}
                className="flex flex-col gap-3 border bg-muted/30 p-4"
              >
                <span
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-medium",
                    tone.className,
                  )}
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {tone.label}
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{insight.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {insight.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
