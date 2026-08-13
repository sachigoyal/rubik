import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router"
import { pageHead } from "@/lib/site"

export const Route = createRootRoute({
  head: () => pageHead({ path: "/" }),
  component: () => (
    <>
      <HeadContent />
      <Outlet />
    </>
  ),
})
