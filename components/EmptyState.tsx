import { PackageOpen } from 'lucide-react'

interface EmptyStateProps {
  title?:       string
  description?: string
}

export default function EmptyState({
  title       = 'Tidak ada data',
  description = 'Belum ada item yang tersedia.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
        <PackageOpen size={28} className="text-slate-400" />
      </div>
      <div>
        <p className="font-semibold text-slate-700">{title}</p>
        <p className="text-sm text-slate-400 mt-1">{description}</p>
      </div>
    </div>
  )
}