import { Loader2 } from 'lucide-react'

interface LoaderProps {
  text?: string
}

export default function Loader({ text = 'Memuat data...' }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Loader2 className="animate-spin text-primary-600" size={32} />
      <p className="text-sm text-slate-500">{text}</p>
    </div>
  )
}