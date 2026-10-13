import { SparklesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";

export function ChatButton() {
  return (
    <Button
      size="lg"
      className="fixed right-6 bottom-6 z-50  shadow-lg"
      aria-label="Open chat assistant"
    >
      <SparklesIcon /> Ask AI
    </Button>
  );
}
