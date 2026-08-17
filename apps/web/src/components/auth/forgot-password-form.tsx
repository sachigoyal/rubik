import { useRequestPasswordReset } from "@/hooks/mutations/use-request-password-reset"
import { AuthHeading } from "./auth-heading"
import { AuthLink } from "./auth-link"
import { FormError } from "./form-error"
import { SubmitButton } from "./submit-button"
import { TextField } from "./text-field"

export function ForgotPasswordForm() {
  const request = useRequestPasswordReset()

  if (request.isSuccess) {
    return (
      <div className="flex flex-col gap-5">
        <AuthHeading title="Check your email">
          If {request.data} has an account, a reset link is on its way.
        </AuthHeading>
        <AuthLink to="/sign-in" className="text-white/70 text-sm">
          Back to sign in
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
        request.mutate(String(data.get("email")))
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
      <FormError message={request.error?.message} />
      <SubmitButton pending={request.isPending}>Send reset link</SubmitButton>
    </form>
  )
}
