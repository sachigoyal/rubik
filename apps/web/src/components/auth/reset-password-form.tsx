import { useResetPassword } from "@/hooks/mutations/use-reset-password"
import { AuthHeading } from "./auth-heading"
import { AuthLink } from "./auth-link"
import { FormError } from "./form-error"
import { PasswordField } from "./password-field"
import { SubmitButton } from "./submit-button"

export function ResetPasswordForm({ token }: { token?: string }) {
  const reset = useResetPassword()

  if (!token) {
    return (
      <div className="flex flex-col gap-5">
        <AuthHeading title="Link expired">
          Reset links are good for an hour. Ask for a fresh one.
        </AuthHeading>
        <AuthLink to="/forgot-password" className="text-white/70 text-sm">
          Send a new link
        </AuthLink>
      </div>
    )
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        reset.mutate({ token, newPassword: String(data.get("password")) })
      }}
    >
      <PasswordField
        label="New password"
        name="password"
        autoComplete="new-password"
        placeholder="Create a password"
        minLength={8}
        required
        hint="At least 8 characters."
      />
      <FormError message={reset.error?.message} />
      <SubmitButton pending={reset.isPending}>Save password</SubmitButton>
    </form>
  )
}
