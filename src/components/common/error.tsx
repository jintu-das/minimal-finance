import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import {
  Link,
  useRouter,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { HomeIcon, RefreshCwIcon } from "lucide-react";
import { getApiErrorMessage } from "@/lib/api-types";
import { Button } from "../ui/button";

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
          {getApiErrorMessage(
            error,
            "An unexpected error occurred while loading this page.",
          )}
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
