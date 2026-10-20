import { useEffect, useState, type FormEvent, type KeyboardEvent } from "react";
import { ArrowUpIcon, SparklesIcon, SquarePenIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { placeholderMessages, suggestedPrompts } from "../placeholder-data";
import type { ChatMessage } from "../types";

function MessageItem({ message }: { message: ChatMessage }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] bg-muted px-3 py-2 text-sm">
          {message.content}
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <div className="flex size-7 shrink-0 items-center justify-center bg-primary text-primary-foreground">
        <SparklesIcon className="size-4" />
      </div>
      <p className="pt-1 text-sm leading-relaxed">{message.content}</p>
    </div>
  );
}

export function ChatPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!input.trim()) return;
    // TODO: send to chat API
    setInput("");
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    // Stays mounted so it can animate out. Phones slide it over the page;
    // desktop grows its width so the page column narrows smoothly.
    <aside
      aria-label="AI assistant"
      inert={!open}
      className={cn(
        "fixed inset-0 z-50 bg-background transition-transform duration-300 ease-out motion-reduce:transition-none",
        "lg:sticky lg:top-0 lg:z-auto lg:h-dvh lg:shrink-0 lg:translate-x-0 lg:overflow-hidden lg:transition-[width]",
        open ? "translate-x-0 lg:w-100 lg:border-l" : "translate-x-full lg:w-0",
      )}
    >
      {/* Fixed inner width keeps the content from reflowing while the panel resizes. */}
      <div className="flex h-full flex-col lg:w-100">
        <header className="flex h-16 shrink-0 items-center gap-2  px-4">
          <SparklesIcon className="size-4" />
          <h2 className="flex-1 text-sm font-semibold">Ask AI</h2>
          <Button variant="ghost" size="icon-sm" aria-label="New chat">
            <SquarePenIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Close chat assistant"
            onClick={onClose}
          >
            <XIcon />
          </Button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto p-4">
          {placeholderMessages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
        </div>

        <div className="shrink-0 space-y-3 border-t p-4">
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt) => (
              <Button
                key={prompt}
                variant="outline"
                size="sm"
                onClick={() => setInput(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Ask about your spending..."
              aria-label="Message"
              className="max-h-40 min-h-10 py-2"
              rows={1}
            />
            <Button
              type="submit"
              size="icon"
              aria-label="Send message"
              disabled={!input.trim()}
            >
              <ArrowUpIcon />
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground">
            AI responses are placeholders.
          </p>
        </div>
      </div>
    </aside>
  );
}
