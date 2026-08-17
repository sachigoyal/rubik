import { useState, type ComponentProps } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Input } from "@repo/ui/components/input"
import { cn } from "@repo/ui/lib/utils"
import { onPrimary } from "./on-primary"

export function PasswordField({
  label,
  name,
  hint,
  ...props
}: {
  label: string
  name: string
  hint?: string
} & Omit<ComponentProps<"input">, "id" | "type">) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <Input
          id={name}
          name={name}
          type={visible ? "text" : "password"}
          className={cn("h-11 pr-11", onPrimary.input)}
          aria-describedby={hint ? `${name}-hint` : undefined}
          {...props}
        />
        <button
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          onClick={() => setVisible((shown) => !shown)}
          className="focus-visible:ring-white/40 absolute top-1.5 right-1.5 grid size-8 place-items-center rounded-md text-white/60 transition-colors outline-none hover:bg-white/10 hover:text-white focus-visible:ring-3 [&_svg]:size-4"
        >
          {visible ? <EyeOffIcon aria-hidden /> : <EyeIcon aria-hidden />}
        </button>
      </div>
      {hint && (
        <p id={`${name}-hint`} className={cn("text-xs", onPrimary.muted)}>
          {hint}
        </p>
      )}
    </div>
  )
}
