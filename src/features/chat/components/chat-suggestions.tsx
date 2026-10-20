import { Button } from "@/components/ui/button";
import { suggestedPrompts } from "../placeholder-data";

export function ChatSuggestions() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {suggestedPrompts.map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            className="shrink-0"
            // onClick={() => send(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}
