import { createTRPCClient, httpBatchLink } from "@trpc/client"
import { createTRPCContext } from "@trpc/tanstack-react-query"
import type { inferRouterOutputs } from "@trpc/server"
import type { AppRouter } from "@repo/api/trpc"
import { env } from "./env"

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>()

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${env.apiUrl}/trpc`,
      fetch: (url, options) =>
        fetch(url, { ...options, credentials: "include" }),
    }),
  ],
})

export type RouterOutputs = inferRouterOutputs<AppRouter>
