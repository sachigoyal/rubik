import { createFileRoute } from "@tanstack/react-router"
import { AuthHeading } from "@/components/auth/auth-heading"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { AuthLayout } from "@/components/layout/auth-layout"
import { pageHead } from "@/lib/site"

export const Route = createFileRoute("/reset-password")({
  head: () =>
    pageHead({
      title: "Reset password",
      path: "/reset-password",
      noIndex: true,
    }),
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string" ? search.token : undefined,
  }),
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  const { token } = Route.useSearch()

  return (
    <AuthLayout>
      <div className="flex flex-col gap-6">
        {token && <AuthHeading title="New password" />}
        <ResetPasswordForm token={token} />
      </div>
    </AuthLayout>
  )
}
