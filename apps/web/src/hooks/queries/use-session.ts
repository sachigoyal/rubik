import { authClient } from "@/lib/auth"

export function useSession() {
  return authClient.useSession()
}
