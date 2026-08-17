import { AuthHeading } from "./auth-heading"
import { AuthLink } from "./auth-link"
import { Divider } from "./divider"
import { EmailSignInForm } from "./email-sign-in-form"
import { SocialSignIn } from "./social-sign-in"

export function SignInPanel() {
  return (
    <div className="flex flex-col gap-6">
      <AuthHeading title="Sign in" />
      <EmailSignInForm />
      <Divider label="or" />
      <SocialSignIn />
      <p className="text-white/70 text-sm">
        No account? <AuthLink to="/sign-up">Create one</AuthLink>
      </p>
    </div>
  )
}
