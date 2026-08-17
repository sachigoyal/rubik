import { BrandDiagram } from "./brand-diagram"

export function BrandPanel() {
  return (
    <aside className="hidden select-none lg:flex lg:items-center lg:justify-center lg:px-14">
      <BrandDiagram className="h-auto max-h-full w-full max-w-[52rem]" />
    </aside>
  )
}
