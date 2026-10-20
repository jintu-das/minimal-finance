import { MutationCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "./api-types";

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
