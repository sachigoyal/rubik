import { cn } from "@repo/ui/lib/utils"
import { GithubIcon, XIcon } from "@/components/icons"
import { SOCIALS } from "@/lib/socials"

const LINKS = [
  { href: SOCIALS.github, label: "GitHub", Icon: GithubIcon },
  { href: SOCIALS.x, label: "X", Icon: XIcon },
] as const

export function SocialLinks({
  className,
  linkClassName,
}: {
  className?: string
  linkClassName?: string
}) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      {LINKS.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          className={cn(
            "rounded-sm transition-opacity hover:opacity-80 focus-visible:ring-3 focus-visible:outline-none",
            linkClassName,
          )}
        >
          <Icon className="size-4" />
        </a>
      ))}
    </div>
  )
}
