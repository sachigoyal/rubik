import { createAuthClient } from "better-auth/react"
import { env } from "./env"

export const authClient = createAuthClient({ baseURL: env.apiUrl })

export type SessionUser = (typeof authClient.$Infer.Session)["user"]

export type SocialProvider = "github" | "google"

export class AuthError extends Error {
  code?: string

  constructor(message: string, code?: string) {
    super(message)
    this.name = "AuthError"
    this.code = code
  }
}

type AuthResponse = { error?: { message?: string; code?: string } | null }

export function unwrap(response: AuthResponse, fallback: string) {
  if (response.error) {
    throw new AuthError(response.error.message ?? fallback, response.error.code)
  }
}
