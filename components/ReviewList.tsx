'use client'
import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { reviewApi } from '@/lib/api'
import type { VehicleReviews } from '@/types'
import Loader from './Loader'

interface ReviewListProps {
  vehicleId: string
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-white/20'}
        />
      ))}
    </div>
  )
}

export default function ReviewList({ vehicleId }: ReviewListProps) {
  const [data, setData]       = useState<VehicleReviews | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await reviewApi.getByVehicle(vehicleId)
        setData(res)
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [vehicleId])

  if (loading) return <Loader />
  if (!data || data.totalReviews === 0) return (
    <p className="text-sm text-white/30 italic">Belum ada review untuk kendaraan ini.</p>
  )

  return (
    <div className="space-y-4">

      {/* Summary */}
      <div className="flex items-center gap-4 bg-amber-400/10 border border-amber-400/20 rounded-2xl p-4">
        <p className="text-5xl font-extrabold text-amber-400">{data.avgRating.toFixed(1)}</p>
        <div>
          <StarDisplay rating={data.avgRating} />
          <p className="text-xs text-white/40 mt-1">{data.totalReviews} review</p>
        </div>
      </div>

      {/* List */}
      {data.reviews.map((r, i) => {
        const colors = [
          { bg: 'bg-[#4ade80]/5 border-[#4ade80]/20',  name: 'text-[#4ade80]',  star: 'text-[#4ade80] fill-[#4ade80]',  badge: 'bg-[#4ade80]/10 border-[#4ade80]/20 text-[#4ade80]' },
          { bg: 'bg-[#93c5fd]/5 border-[#93c5fd]/20',  name: 'text-[#93c5fd]',  star: 'text-[#93c5fd] fill-[#93c5fd]',  badge: 'bg-[#93c5fd]/10 border-[#93c5fd]/20 text-[#93c5fd]' },
          { bg: 'bg-amber-400/5 border-amber-400/20',   name: 'text-amber-400',  star: 'text-amber-400 fill-amber-400',  badge: 'bg-amber-400/10 border-amber-400/20 text-amber-400' },
          { bg: 'bg-purple-400/5 border-purple-400/20', name: 'text-purple-400', star: 'text-purple-400 fill-purple-400', badge: 'bg-purple-400/10 border-purple-400/20 text-purple-400' },
          { bg: 'bg-pink-400/5 border-pink-400/20',     name: 'text-pink-400',   star: 'text-pink-400 fill-pink-400',    badge: 'bg-pink-400/10 border-pink-400/20 text-pink-400' },
        ]
        const c = colors[i % colors.length]

        return (
          <div key={r.id} className={`border rounded-2xl p-4 space-y-3 ${c.bg}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Avatar inisial */}
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-sm ${c.badge}`}>
                  {r.user?.name?.charAt(0).toUpperCase() ?? '?'}
                </div>
                <p className={`font-semibold text-sm ${c.name}`}>{r.user?.name ?? 'Anonim'}</p>
              </div>
              <p className="text-xs text-white/30">
                {new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>

            {/* Bintang */}
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={15}
                  className={s <= r.rating ? c.star : 'text-white/15'}
                />
              ))}
            </div>

            {/* Komentar */}
            <p className="text-sm text-white/70 leading-relaxed">{r.comment}</p>
          </div>
        )
      })}
    </div>
  )
}