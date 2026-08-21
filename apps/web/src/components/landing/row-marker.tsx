export function RowMarker() {
  return (
    <span
      aria-hidden
      className="relative w-4 text-center font-mono text-sm leading-none text-muted-foreground/60 select-none"
    >
      <span className="transition-opacity duration-200 group-hover:opacity-0">
        -
      </span>
      <span className="text-primary absolute inset-0 opacity-0 transition-[opacity,transform] duration-200 group-hover:opacity-100 motion-safe:scale-50 motion-safe:group-hover:scale-100">
        +
      </span>
    </span>
  )
}
