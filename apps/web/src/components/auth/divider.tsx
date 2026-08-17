export function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex-1 border-t border-dashed border-white/20" />
      <span className="text-xs text-white/60">{label}</span>
      <span className="flex-1 border-t border-dashed border-white/20" />
    </div>
  )
}
