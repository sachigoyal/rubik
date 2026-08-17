import { createFileRoute } from "@tanstack/react-router"
import { AuthHeading } from "@/components/auth/auth-heading"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { AuthLayout } from "@/components/layout/auth-layout"
import { requireNoSession } from "@/lib/guards"
import { pageHead } from "@/lib/site"

export const Route = createFileRoute("/forgot-password")({
  head: () =>
    pageHead({
      title: "Forgot password",
      description: "Request a password reset link by email.",
      path: "/forgot-password",
    }),
  beforeLoad: requireNoSession,
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <div className="flex flex-col gap-6">
        <AuthHeading title="Reset password">
          We will email you a link to set a new one.
        </AuthHeading>
        <ForgotPasswordForm />
      </div>
    </AuthLayout>
  )
}
