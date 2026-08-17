export function FormError({ message }: { message?: string }) {
  if (!message) return null

  return (
    <p role="alert" className="text-xs text-red-200">
      {message}
    </p>
  )
}
