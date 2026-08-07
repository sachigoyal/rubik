# Rubik

A fullstack template on the Cloudflare stack. Built to scale, stay fast, and
behave predictably.

The todo example exists to show the wiring end to end. Delete it and build.

## Stack

| Layer    | Choice                                                    |
| -------- | --------------------------------------------------------- |
| Runtime  | Cloudflare Workers, Hono                                  |
| API      | tRPC v11                                                  |
| Auth     | better-auth: email with password, GitHub and Google OAuth |
| Email    | Cloudflare Email Service, transactional only              |
| Database | Neon serverless Postgres, Drizzle ORM                     |
| Frontend | React 19, Vite, TanStack Router, TanStack Query           |
| UI       | Tailwind v4, Base UI, cva                                 |
| Repo     | pnpm workspaces, Turborepo                                |

```
apps/api      Worker: tRPC at /trpc, better-auth at /api/auth/*
apps/web      Vite SPA
packages/db   Drizzle schema and client
packages/ui   Components and design tokens
```

## Setup

```sh
pnpm install
cp apps/api/.dev.vars.example apps/api/.dev.vars
pnpm --filter @repo/db db:push
npx wrangler email sending enable yourdomain.com
pnpm dev
```

Web runs on 5173, the Worker on 8787.

Fill `apps/api/.dev.vars` first:

| Variable                                    | Notes                                                  |
| ------------------------------------------- | ------------------------------------------------------ |
| `DATABASE_URL`                              | Neon connection string                                 |
| `BETTER_AUTH_SECRET`                        | `openssl rand -base64 32`                              |
| `BETTER_AUTH_URL`                           | `http://localhost:8787` in development                 |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | Callback: `{BETTER_AUTH_URL}/api/auth/callback/github` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Callback: `{BETTER_AUTH_URL}/api/auth/callback/google` |

`APP_URL` and `EMAIL_FROM` are plain vars in `apps/api/wrangler.jsonc`, not
secrets. `APP_URL` is the web origin: it drives CORS, better-auth's
`trustedOrigins`, and where verification and reset links land. `EMAIL_FROM` must
sit on a domain you have onboarded onto Email Sending, or every send fails with
`E_SENDER_NOT_VERIFIED`.

The web app calls `http://localhost:8787` by default. Point it elsewhere with
`VITE_API_URL`.

## Auth

Email with password, plus GitHub and Google. Sign-up requires a verified address,
so it issues no session until the emailed link is opened. Verification and reset
mail go out through the Email Service binding; templates are in
`apps/api/src/email/index.ts`.

Local `wrangler dev` sends real mail: the binding is declared `remote: true`, so
development sends are proxied to the live service. Use addresses you control.

## Commands

```sh
pnpm dev            # web + api
pnpm build
pnpm check-types    # the type gate
pnpm format
```

Database, from `packages/db`:

```sh
pnpm --filter @repo/db db:push       # sync schema
pnpm --filter @repo/db db:studio     # browse data
pnpm --filter @repo/db db:generate   # write a migration
```

`pnpm lint` is currently broken repo-wide: typescript-eslint 8 rejects TS 7.
Use `pnpm check-types`.

## Deploy

```sh
pnpm --filter @repo/api deploy
```

Set the `.dev.vars` variables as Worker secrets with `wrangler secret put`, point
`BETTER_AUTH_URL` at the deployed Worker, set `APP_URL` to your web origin, and
update the OAuth callback URLs.

Build the web app with `pnpm --filter web build` and serve `apps/web/dist` from
any static host.
