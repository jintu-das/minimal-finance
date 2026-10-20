import { useState } from "react";
import { AppNavbar } from "@/components/common/navbar";
import { ChatButton } from "@/features/chat/components/chat-button";
import { ChatPanel } from "@/features/chat/components/chat-panel";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { QueryClient } from "@tanstack/react-query";

interface RouterContext {
  queryClient: QueryClient;
}

// eslint-disable-next-line react-refresh/only-export-components
const RootLayout = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <div className="flex min-h-dvh">
        <div className="min-w-0 flex-1">
          <AppNavbar />
          <Outlet />
        </div>
        <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
      </div>
      <TanStackRouterDevtools />
      {!chatOpen && <ChatButton onClick={() => setChatOpen(true)} />}
    </>
  );
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});
