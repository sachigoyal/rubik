import { Button } from "@repo/ui/components/button"
import { Spinner } from "@/components/common/spinner"

export function SubmitButton({
  children,
  pending,
}: {
  children: string
  pending: boolean
}) {
  return (
    <Button
      type="submit"
      aria-busy={pending}
      disabled={pending}
      className="text-primary focus-visible:ring-white/40 mt-1 h-12 w-full bg-white text-sm font-medium hover:bg-white/90 focus-visible:border-white"
    >
      {pending && <Spinner />}
      {children}
    </Button>
  )
}
