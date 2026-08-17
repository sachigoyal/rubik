import { createFileRoute } from "@tanstack/react-router"
import { SignUpForm } from "@/components/auth/sign-up-form"
import { AuthHeading } from "@/components/auth/auth-heading"
import { AuthLink } from "@/components/auth/auth-link"
import { Divider } from "@/components/auth/divider"
import { SocialSignIn } from "@/components/auth/social-sign-in"
import { AuthLayout } from "@/components/layout/auth-layout"
import { requireNoSession } from "@/lib/guards"
import { pageHead } from "@/lib/site"

export const Route = createFileRoute("/sign-up")({
  head: () =>
    pageHead({
      title: "Sign up",
      description: "Create a Rubik account with email, GitHub, or Google.",
      path: "/sign-up",
    }),
  beforeLoad: requireNoSession,
  component: SignUpPage,
})

function SignUpPage() {
  return (
    <AuthLayout>
      <div className="flex flex-col gap-6">
        <AuthHeading title="Create account" />
        <SignUpForm />
        <Divider label="or" />
        <SocialSignIn />
        <p className="text-white/70 text-sm">
          Have an account? <AuthLink to="/sign-in">Sign in</AuthLink>
        </p>
      </div>
    </AuthLayout>
  )
}
