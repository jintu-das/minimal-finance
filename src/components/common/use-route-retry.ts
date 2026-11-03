import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useRouter, type ErrorComponentProps } from "@tanstack/react-router";

// Recovers a route error component: clears the query error, resets the
// boundary and re-runs the loaders.
export function useRouteRetry(reset: ErrorComponentProps["reset"]) {
  const router = useRouter();
  const queryErrorResetBoundary = useQueryErrorResetBoundary();

  return () => {
    queryErrorResetBoundary.reset();
    reset();
    void router.invalidate();
  };
}
