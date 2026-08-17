import { useState } from "react"
import { Checkbox } from "@repo/ui/components/checkbox"
import { useEmailSignIn } from "@/hooks/mutations/use-email-sign-in"
import { AuthError } from "@/lib/auth"
import { AuthLink } from "./auth-link"
import { FormError } from "./form-error"
import { PasswordField } from "./password-field"
import { SubmitButton } from "./submit-button"
import { TextField } from "./text-field"

function messageFor(error: Error | null) {
  if (!error) return undefined
  if (error instanceof AuthError && error.code === "EMAIL_NOT_VERIFIED") {
    return "Verify your email first. We just sent a new link."
  }
  return error.message
}

export function EmailSignInForm() {
  const signIn = useEmailSignIn()
  const [rememberMe, setRememberMe] = useState(true)

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        signIn.mutate({
          email: String(data.get("email")),
          password: String(data.get("password")),
          rememberMe,
        })
      }}
    >
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        required
      />
      <PasswordField
        label="Password"
        name="password"
        autoComplete="current-password"
        placeholder="Your password"
        required
      />

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={setRememberMe}
            className="data-checked:text-primary border-white/40 focus-visible:border-white focus-visible:ring-white/40 data-checked:border-white data-checked:bg-white"
          />
          <label htmlFor="remember" className="text-sm">
            Remember me
          </label>
        </div>
        <AuthLink to="/forgot-password" className="text-white/70 text-sm">
          Forgot password?
        </AuthLink>
      </div>

      <FormError message={messageFor(signIn.error)} />
      <SubmitButton pending={signIn.isPending}>Sign in</SubmitButton>
    </form>
  )
}
