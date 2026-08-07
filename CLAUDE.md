# Rubik

A Cloudflare-stack fullstack template built for scale, speed, and predictable
behaviour. This is a template, not a product. The todo router, hooks, and UI are
placeholder examples that show the wiring; treat them as replaceable.

## Layout

- `apps/api`: Hono on Cloudflare Workers. tRPC v11 at `/trpc`, better-auth at `/api/auth/*`, transactional mail through the Cloudflare Email Service binding (`env.EMAIL`).
- `apps/web`: React 19 + Vite SPA. TanStack Router, TanStack Query, tRPC client.
- `packages/db`: Drizzle ORM against Neon serverless Postgres.
- `packages/ui`: Tailwind v4, Base UI primitives, cva. Design tokens live in `src/styles/globals.css`.

pnpm workspaces, orchestrated by Turborepo.

## Commands

- `pnpm dev` runs web (5173) and api (8787) together.
- `pnpm run deploy` builds the SPA and deploys the worker, which serves both at rubik.sachi.dev. It must be `pnpm run deploy`: plain `pnpm deploy` is pnpm's own command. Production vars live in `wrangler.jsonc`; `.dev.vars` overrides them in dev; secrets go in with `pnpm --filter @repo/api secrets`, which bulk-uploads `apps/api/.prod.vars` (gitignored, keys in `.prod.vars.example`).
- `pnpm check-types` is the real gate. `pnpm lint` is broken repo-wide: typescript-eslint 8 rejects TS 7.
- `pnpm --filter @repo/db db:push` / `db:studio` / `db:generate`. Drizzle reads `DATABASE_URL` from `apps/api/.dev.vars`.
- Rerun `pnpm --filter @repo/api cf-typegen` after every `wrangler.jsonc` change. It regenerates the global `Env` interface in `worker-configuration.d.ts` from the config plus `.dev.vars`, which is what the Worker types against. Never hand-write `Env`.

## Auth

Both paths live in `apps/api/src/auth/index.ts`: email with password, and GitHub
or Google OAuth. Email sign-up requires a verified address, so sign-up issues no
session; the UI shows a check-your-email state instead. An unverified sign-in
attempt fails with `EMAIL_NOT_VERIFIED` and the API resends the link.

Every auth link the user clicks lands on `APP_URL`, so the client passes
`callbackURL` on sign-up and sign-in, and `redirectTo` on a reset request. Those
are origin-checked against `trustedOrigins`, which is `[env.APP_URL]`. Getting
`APP_URL` wrong breaks the links, not the sign-in.

Mail templates live in `apps/api/src/email/index.ts`. Sending needs the `from`
domain onboarded (`wrangler email sending enable <domain>`), otherwise sends fail
with `E_SENDER_NOT_VERIFIED`.

## Code conventions

- Named exports, no default exports.
- `import type` for type-only imports. `verbatimModuleSyntax` and `erasableSyntaxOnly` are on.
- Server data is reached only through `apps/web/src/hooks/queries` and `hooks/mutations`, never `useQuery` inline in a component.
- Colour, radius, and spacing come from tokens. No raw hex in components.
- The auth pages are the one surface painted straight onto `bg-primary` with white ink. The shared components assume a light surface, so they take white overrides from `apps/web/src/components/auth/on-primary.ts` at the call site. Everywhere else uses tokens.
- Every mutation that can fail renders its error. Lift the mutation when two controls share it, so one pending action disables the others.

## Writing

- No em dashes. Use a period, a comma, or parentheses.
- Website copy is extremely concise. One line beats two. Cut any subtitle that restates the heading, and cut reassurance nobody asked for.
- Never claim a capability the code does not have.

## Design

- No uppercase letterspaced labels. Never pair `uppercase` with a positive `tracking-`. Sentence case at normal tracking. Negative tracking on large headings is fine.
- No decorative ASCII. `[ sign in ]`, `>` prefixes, and `//` dividers are noise. A glyph earns its place only when it carries meaning or is the illustration itself.
- Restraint over decoration. Prefer removing an element to styling it.
- Anchor stacked pages from the top with padding, never `justify-center`. Centring moves the heading when two pages of the same flow differ in height, and a grid of `auto` rows stretches them, so give the trailing row `1fr`.
- Keep press and hover motion off small controls sitting inside a field. The shared button's `active:translate-y-px` reads as a jolt at that size, so those use a plain `<button>`.
- Accessibility is part of the work, not a pass afterwards: one real `h1` per page, `role="alert"` on error text, `aria-hidden` on decoration, AA contrast, `motion-safe:` on transforms.
