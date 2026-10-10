import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SparklesIcon } from "lucide-react";

export function AiInsight() {
  return (
    <Alert>
      <SparklesIcon />
      <AlertTitle>AI INSIGHT</AlertTitle>
      <AlertDescription>
        Your dining out expenses are 40% higher this week.
      </AlertDescription>
    </Alert>
  );
}
