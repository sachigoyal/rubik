import { createFileRoute } from "@tanstack/react-router"
import { SignInPanel } from "@/components/auth/sign-in-panel"
import { AuthLayout } from "@/components/layout/auth-layout"
import { requireNoSession } from "@/lib/guards"
import { pageHead } from "@/lib/site"

export const Route = createFileRoute("/sign-in")({
  head: () =>
    pageHead({
      title: "Sign in",
      description: "Sign in to Rubik with email, GitHub, or Google.",
      path: "/sign-in",
    }),
  beforeLoad: requireNoSession,
  component: LoginPage,
})

function LoginPage() {
  return (
    <AuthLayout>
      <SignInPanel />
    </AuthLayout>
  )
}
