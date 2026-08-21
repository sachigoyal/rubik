export const site = {
  name: "Rubik",
  url: "https://rubik.sachi.dev",
  description:
    "A Cloudflare fullstack template. Hono on Workers, tRPC, Drizzle on Neon, better-auth, and a React SPA.",
} as const

export function pageHead(opts: {
  title?: string
  description?: string
  path: string
  noIndex?: boolean
}) {
  return {
    meta: [
      { title: opts.title ? `${opts.title} · ${site.name}` : site.name },
      { name: "description", content: opts.description ?? site.description },
      ...(opts.noIndex ? [{ name: "robots", content: "noindex" }] : []),
    ],
    links: opts.noIndex
      ? []
      : [{ rel: "canonical", href: `${site.url}${opts.path}` }],
  }
}
