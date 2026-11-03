import { MutationCache, QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { getApiErrorMessage } from "./api-types";

// A 4xx (e.g. a rejected filter) fails the same way every time, so only
// network and server errors are retried.
function shouldRetry(failureCount: number, error: unknown) {
  const status = isAxiosError(error) ? error.response?.status : undefined;
  if (status !== undefined && status >= 400 && status < 500) return false;
  return failureCount < 3;
}

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      /** Fallback toast text when the API returns no usable message. */
      errorMessage?: string;
      /** Skip the global error toast when the caller handles the error itself. */
      silent?: boolean;
    };
  }
}

export const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: shouldRetry } },
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      console.error("Mutation failed:", error);
      if (mutation.meta?.silent) return;
      toast.error(
        getApiErrorMessage(
          error,
          mutation.meta?.errorMessage ??
            "Something went wrong. Please try again.",
        ),
      );
    },
  }),
});
