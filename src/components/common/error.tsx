import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import {
  Link,
  useRouter,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { HomeIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "../ui/button";

function getMessage(error: unknown) {
  if (isAxiosError(error)) {
    if (!error.response) {
      return "We could not reach the server. Check your connection and try again.";
    }
    const message = error.response.data?.message;
    if (typeof message === "string") return message;
    if (Array.isArray(message)) return message.join(", ");
  }
  return "An unexpected error occurred while loading this page.";
}

export function ErrorComponent({ error, reset }: ErrorComponentProps) {
  const router = useRouter();
  const queryErrorResetBoundary = useQueryErrorResetBoundary();

  const retry = () => {
    queryErrorResetBoundary.reset();
    reset();
    void router.invalidate();
  };

  return (
    <main
      role="alert"
      className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center"
    >
      <p className="text-sm font-medium tracking-widest text-muted-foreground">
        Error
      </p>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Something went wrong
        </h1>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          {getMessage(error)}
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={retry}>
          <RefreshCwIcon data-icon="inline-start" />
          Try again
        </Button>
        <Button variant="outline" render={<Link to="/" />}>
          <HomeIcon data-icon="inline-start" />
          Go to transactions
        </Button>
      </div>
    </main>
  );
}
