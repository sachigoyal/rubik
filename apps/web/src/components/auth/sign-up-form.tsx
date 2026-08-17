import { useSignUp } from "@/hooks/mutations/use-sign-up"
import { AuthHeading } from "./auth-heading"
import { AuthLink } from "./auth-link"
import { FormError } from "./form-error"
import { PasswordField } from "./password-field"
import { SubmitButton } from "./submit-button"
import { TextField } from "./text-field"

export function SignUpForm() {
  const signUp = useSignUp()

  if (signUp.isSuccess) {
    return (
      <div className="flex flex-col gap-5">
        <AuthHeading title="Check your email">
          We sent a link to {signUp.data}. Open it to finish signing up.
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
        signUp.mutate({
          name: String(data.get("name")),
          email: String(data.get("email")),
          password: String(data.get("password")),
        })
      }}
    >
      <TextField
        label="Name"
        name="name"
        autoComplete="name"
        placeholder="Ada Lovelace"
        required
      />
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
        autoComplete="new-password"
        placeholder="Create a password"
        minLength={8}
        required
        hint="At least 8 characters."
      />
      <FormError message={signUp.error?.message} />
      <SubmitButton pending={signUp.isPending}>Create account</SubmitButton>
    </form>
  )
}
