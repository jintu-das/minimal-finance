import { SparklesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ChatButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      size="lg"
      className="fixed right-6 bottom-6 z-50 shadow-lg"
      aria-label="Open chat assistant"
      onClick={onClick}
    >
      <SparklesIcon /> Ask AI
    </Button>
  );
}
