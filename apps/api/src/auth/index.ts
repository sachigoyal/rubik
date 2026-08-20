import { createDB } from "@repo/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

type ENV = {
    DATABASE_URL: string;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
    GITHUB_CLIENT_ID: string;
    GITHUB_CLIENT_SECRET: string;
}

export function createAuth(env: ENV) {
    return betterAuth({
        database: drizzleAdapter(createDB(env.DATABASE_URL), {provider: "pg"}),
        secret: env.BETTER_AUTH_SECRET,
        baseURL: env.BETTER_AUTH_URL,
        trustedOrigins: ["http://localhost:5173"],
        socialProviders:{
            github: {
                clientId: env.GITHUB_CLIENT_ID,
                clientSecret: env.GITHUB_CLIENT_SECRET,
            }
        }
    })
}