import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createFileRoute } from "@tanstack/react-router";
import { SparklesIcon } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

// eslint-disable-next-line react-refresh/only-export-components
function Index() {
  return (
    <main className="container mx-auto space-y-2 pt-4">
      <Alert>
        <SparklesIcon />
        <AlertTitle>AI INSIGHT</AlertTitle>
        <AlertDescription>
          Your dining out expenses are 40% higher this week.
        </AlertDescription>
      </Alert>
    </main>
  );
}
