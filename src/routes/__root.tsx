import { AppNavbar } from "@/components/common/navbar";
import { ChatButton } from "@/features/chat/components/chat-button";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

// eslint-disable-next-line react-refresh/only-export-components
const RootLayout = () => (
  <>
    <AppNavbar />
    <Outlet />
    <TanStackRouterDevtools />
    <ChatButton />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
