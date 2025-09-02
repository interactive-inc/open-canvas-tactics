import { createRootRoute, Outlet } from "@tanstack/react-router"
import { AppLayout } from "@/components/app-layout"

export const Route = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
})
