'use client'

import Link from 'next/link'
import { MapPin, Calendar, Tag } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import type { Vehicle } from '@/types'
import { formatRupiah } from '@/lib/format'

const statusBadge: Record<string, string> = {
  AVAILABLE:   'bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/25',
  RENTED:      'bg-yellow-400/10 text-yellow-400 border border-yellow-400/25',
  MAINTENANCE: 'bg-white/10 text-white/50 border border-white/15',
}

const statusLabel: Record<string, string> = {
  AVAILABLE:   'Tersedia',
  RENTED:      'Disewa',
  MAINTENANCE: 'Perawatan',
}

const typeLabel: Record<string, string> = {
  CAR:        'Mobil',
  MOTORCYCLE: 'Motor',
}

interface VehicleCardProps {
  vehicle:    Vehicle
  startDate?: string
  endDate?:   string
  lokasi?:    string
}

export default function VehicleCard({ vehicle, startDate, endDate, lokasi }: VehicleCardProps) {
  const params = new URLSearchParams()
  if (startDate) params.set('startDate', startDate)
  if (endDate)   params.set('endDate',   endDate)
  if (lokasi)    params.set('lokasi',    lokasi)
  const query     = params.toString()
  const detailUrl = `/vehicles/${vehicle.id}${query ? `?${query}` : ''}`

  const allImages = [
    vehicle.imageUrl ?? `https://placehold.co/400x200/0f1f2e/4ade80?text=${encodeURIComponent(vehicle.name)}`,
    ...(vehicle.images?.map((img) => img.url) ?? []),
  ]

  const [currentIdx, setCurrentIdx]   = useState(0)
  const [isHovered, setIsHovered]     = useState(false)
  const [animClass, setAnimClass]     = useState('')
  const intervalRef                    = useRef<NodeJS.Timeout | null>(null)

  const goTo = (newIdx: number, dir: 'left' | 'right') => {
    const enterClass = dir === 'right' ? 'slide-in-right' : 'slide-in-left'
    setAnimClass(enterClass)
    setCurrentIdx(newIdx)
    setTimeout(() => setAnimClass(''), 300)
  }

  const goNext = () => goTo((currentIdx + 1) % allImages.length, 'right')
  const goPrev = () => goTo((currentIdx - 1 + allImages.length) % allImages.length, 'left')

  useEffect(() => {
    if (isHovered && allImages.length > 1) {
      intervalRef.current = setInterval(() => {
        setAnimClass('slide-in-right')
        setCurrentIdx((prev) => (prev + 1) % allImages.length)
        setTimeout(() => setAnimClass(''), 300)
      }, 1200)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (!isHovered) { setCurrentIdx(0); setAnimClass('') }
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isHovered, allImages.length])

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(60px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-60px); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
        .slide-in-right { animation: slideInRight 0.3s ease-out both; }
        .slide-in-left  { animation: slideInLeft  0.3s ease-out both; }
      `}</style>

      <div className="bg-white/[0.04] border border-white/10 hover:border-[#4ade80]/25 hover:bg-white/[0.07] transition-all rounded-2xl flex flex-col overflow-hidden">

        {/* Gambar */}
        <div
          className="relative w-full h-48 bg-white/5 overflow-hidden rounded-t-2xl group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => { setIsHovered(false) }}
        >
          <img
            key={currentIdx}
            src={allImages[currentIdx]}
            alt={vehicle.name}
            className={`w-full h-full object-cover ${animClass}`}
          />

          {/* Badge status */}
          <div className="absolute top-3 right-3 z-10">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge[vehicle.status] ?? statusBadge.MAINTENANCE}`}>
              {statusLabel[vehicle.status] ?? vehicle.status}
            </span>
          </div>

          {/* Badge tipe */}
          <div className="absolute top-3 left-3 z-10">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#93c5fd]/10 text-[#93c5fd] border border-[#93c5fd]/25">
              {typeLabel[vehicle.type] ?? vehicle.type}
            </span>
          </div>

          {/* Tombol panah */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); goPrev() }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 text-lg font-bold"
              >
                ‹
              </button>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); goNext() }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 text-lg font-bold"
              >
                ›
              </button>
            </>
          )}

          {/* Dot indicator */}
          {allImages.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); goTo(i, i > currentIdx ? 'right' : 'left') }}
                  className={`rounded-full transition-all duration-300 ${
                    i === currentIdx
                      ? 'bg-white w-4 h-1.5'
                      : 'bg-white/40 w-1.5 h-1.5 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Konten */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          <h3 className="font-semibold text-white text-base leading-tight line-clamp-1">
            {vehicle.name}
          </h3>

          <div className="flex flex-col gap-1 text-xs text-white/35">
            <span className="flex items-center gap-1.5">
              <Tag size={12} /> {vehicle.brand} · {vehicle.model}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={12} /> Tahun {vehicle.year}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={12} /> {vehicle.plateNumber}
            </span>
          </div>

          <div className="mt-auto pt-3 border-t border-white/[0.06] flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-[#4ade80]">
                {formatRupiah(vehicle.pricePerDay)}
              </p>
              <p className="text-xs text-white/30">per hari</p>
            </div>
            <Link
              href={detailUrl}
              className="bg-[#4ade80]/10 hover:bg-[#4ade80]/20 border border-[#4ade80]/25 text-[#4ade80] font-semibold text-xs py-2 px-3 rounded-xl transition-all"
            >
              Lihat Detail
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}