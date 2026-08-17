import { redirect } from "@tanstack/react-router"
import { authClient } from "./auth"

export async function requireSession() {
  const { data: session } = await authClient.getSession()
  if (!session) throw redirect({ to: "/sign-in" })
  return session
}

export async function requireNoSession() {
  const { data: session } = await authClient.getSession()
  if (session) throw redirect({ to: "/dashboard" })
}
