import type { ReactNode } from "react"
import { BrandPanel } from "@/components/brand/brand-panel"
import { Wordmark } from "@/components/brand/wordmark"

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-primary grid h-svh overflow-hidden text-white lg:grid-cols-[minmax(28rem,1fr)_1.15fr]">
      <div className="overflow-hidden px-6 py-8 sm:px-10 lg:px-14 lg:py-12">
        <div className="mx-auto grid h-full w-full max-w-[26rem] grid-rows-[auto_1fr] gap-24 lg:gap-36">
          <Wordmark
            className="focus-visible:ring-white/40"
            markClassName="text-white"
          />
          <div className="pb-16">{children}</div>
        </div>
      </div>

      <BrandPanel />
    </div>
  )
}
