import { AppNavbar } from "@/components/common/navbar";
import { ChatButton } from "@/features/chat/components/chat-button";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { QueryClient } from "@tanstack/react-query";

interface RouterContext {
  queryClient: QueryClient;
}

// eslint-disable-next-line react-refresh/only-export-components
const RootLayout = () => (
  <>
    <AppNavbar />
    <Outlet />
    <TanStackRouterDevtools />
    <ChatButton />
  </>
);

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});
