interface SkeletonTableProps {
  rows?: number
  cols?: number
}

export default function SkeletonTable({ rows = 5, cols = 5 }: SkeletonTableProps) {
  return (
    <div className="card !p-0 overflow-hidden animate-pulse">
      <div className="bg-slate-50 border-b border-slate-100 px-5 py-4">
        <div className="h-3.5 bg-slate-200 rounded w-1/3" />
      </div>
      <div className="divide-y divide-slate-50">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-5 py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-200 flex-shrink-0" />
            <div className="flex-1 grid gap-2" style={{ gridTemplateColumns: `repeat(${cols - 1}, 1fr)` }}>
              {Array.from({ length: cols - 1 }).map((_, j) => (
                <div key={j} className="h-3 bg-slate-100 rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}