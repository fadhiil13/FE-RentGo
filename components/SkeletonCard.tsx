export default function SkeletonCard() {
  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl flex flex-col overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-white/[0.06] rounded-t-2xl" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 bg-white/[0.06] rounded-lg w-3/4" />
        <div className="h-3 bg-white/[0.06] rounded-lg w-1/2" />
        <div className="h-3 bg-white/[0.06] rounded-lg w-2/3" />
        <div className="mt-2 pt-3 border-t border-white/[0.06] flex items-center justify-between">
          <div className="h-5 bg-white/[0.06] rounded-lg w-1/3" />
          <div className="h-8 bg-white/[0.06] rounded-xl w-1/4" />
        </div>
      </div>
    </div>
  )
}