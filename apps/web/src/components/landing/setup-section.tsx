import { useRef, useState } from "react"
import { Reveal } from "./reveal"
import { Section } from "./section"

const COMMANDS = [
  "pnpm install",
  "cp apps/api/.dev.vars.example apps/api/.dev.vars",
  "pnpm --filter @repo/db db:push",
  "pnpm dev",
] as const

const OUTPUT = [
  "web  http://localhost:5173",
  "api  http://localhost:8787",
] as const

const LINE_AT = (index: number) => 200 + index * 150
const OUTPUT_AT = (index: number) => LINE_AT(COMMANDS.length) + index * 90
const CARET_AT = OUTPUT_AT(OUTPUT.length) + 120

function CopyButton() {
  const [copied, setCopied] = useState(false)
  const timer = useRef(0)

  const copy = async () => {
    await navigator.clipboard.writeText(COMMANDS.join("\n"))
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 rounded-sm font-mono text-xs transition-colors focus-visible:ring-3 focus-visible:outline-none"
    >
      {copied ? "copied" : "copy"}
    </button>
  )
}

export function SetupSection() {
  return (
    <Section title="Local setup">
      {(shown) => (
        <Reveal shown={shown} delay={150}>
          <div className="rounded-xl border">
            <div className="flex items-center justify-between border-b px-4 py-2.5">
              <span className="text-muted-foreground font-mono text-xs">
                local dev
              </span>
              <CopyButton />
            </div>
            <div className="flex flex-col gap-1.5 overflow-x-auto px-4 py-4 font-mono text-[13px] leading-relaxed">
              {COMMANDS.map((command, index) => (
                <Reveal
                  key={command}
                  shown={shown}
                  delay={LINE_AT(index)}
                  className="whitespace-nowrap"
                >
                  <span className="text-primary select-none">$ </span>
                  {command}
                </Reveal>
              ))}
              {OUTPUT.map((line, index) => (
                <Reveal
                  key={line}
                  shown={shown}
                  delay={OUTPUT_AT(index)}
                  className="text-muted-foreground whitespace-pre"
                >
                  {line}
                </Reveal>
              ))}
              <Reveal shown={shown} delay={CARET_AT}>
                <span
                  aria-hidden
                  className="bg-primary/70 inline-block h-3.5 w-1.5 align-middle"
                  style={{ animation: "landing-caret 1.1s step-end infinite" }}
                />
              </Reveal>
            </div>
          </div>
        </Reveal>
      )}
    </Section>
  )
}
