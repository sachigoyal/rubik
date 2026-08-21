import { Reveal } from "./reveal"
import { RowMarker } from "./row-marker"
import { Section } from "./section"

const FLOWS = [
  {
    flow: "Sign up",
    detail: "Verify your email, then you're in",
  },
  {
    flow: "Sign in",
    detail: "Password, GitHub, or Google",
  },
  {
    flow: "Unverified sign-in",
    detail: "Fails and resends the link",
  },
  {
    flow: "Password reset",
    detail: "Emailed link, new password",
  },
] as const

export function AuthSection() {
  return (
    <Section title="Auth">
      {(shown) => (
        <ul>
          {FLOWS.map((row, index) => (
            <li key={row.flow} className="group border-t last:border-b">
              <Reveal
                shown={shown}
                delay={100 + index * 60}
                className="grid grid-cols-[1rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-1 py-4 sm:grid-cols-[1rem_9.5rem_minmax(0,1fr)]"
              >
                <RowMarker />
                <span className="font-mono text-xs text-muted-foreground">
                  {row.flow}
                </span>
                <span className="col-start-2 text-lg font-medium tracking-tight transition-colors duration-200 group-hover:text-primary sm:col-start-3">
                  {row.detail}
                </span>
              </Reveal>
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}
