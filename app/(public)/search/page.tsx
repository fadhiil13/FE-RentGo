'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { vehicleApi } from '@/lib/api'
import { getErrorMessage } from '@/lib/axios'
import type { Vehicle, VehicleType } from '@/types'
import VehicleCard from '@/components/VehicleCard'
import EmptyState from '@/components/EmptyState'
import SkeletonCard from '@/components/SkeletonCard'

const VEHICLE_TYPES: { value: VehicleType | ''; label: string }[] = [
  { value: '',           label: 'Semua' },
  { value: 'CAR',        label: 'Mobil' },
  { value: 'MOTORCYCLE', label: 'Motor' },
]

function SearchContent() {
  const searchParams = useSearchParams()

  const initSearch    = searchParams.get('search')    ?? ''
  const initStartDate = searchParams.get('startDate') ?? ''
  const initEndDate   = searchParams.get('endDate')   ?? ''
  const initType      = (searchParams.get('type')     ?? '') as VehicleType | ''
  const initCategory  = searchParams.get('category')  ?? ''   // ← baru

  const [vehicles, setVehicles]     = useState<Vehicle[]>([])
  const [loading, setLoading]       = useState(true)
  const [type, setType]             = useState<VehicleType | ''>(initType)
  const [page, setPage]             = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchVehicles = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        ...(initSearch    ? { search: initSearch }       : {}),
        ...(initCategory  ? { category: initCategory }   : {}),
        ...(type          ? { type }                     : {}),
        page,
        limit: 8,
      }
      const res = await vehicleApi.getAll(params)
      setVehicles(res.items)
      setTotalPages(res.meta.totalPages)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [initSearch, initCategory, type, page])

  useEffect(() => { fetchVehicles() }, [fetchVehicles])

  const handleTypeChange = (val: VehicleType | '') => {
    setType(val)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <div className="bg-gradient-to-br from-[#0369a1] to-[#0ea5e9] text-white py-10 px-4 relative overflow-hidden">
        <div className="absolute top-[-80px] right-[-60px] w-[280px] h-[280px] rounded-full bg-white/10 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <Link href="/" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-5 transition-colors">
            <ArrowLeft size={16} /> Kembali ke Home
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">Hasil Pencarian</h1>
          <div className="flex flex-wrap gap-2 text-sm">
            {initSearch && (
              <span className="bg-white/20 border border-white/30 text-white rounded-full px-3 py-1 font-medium">
                "{initSearch}"
              </span>
            )}
            {initCategory && (
              <span className="bg-white/20 border border-white/30 text-white rounded-full px-3 py-1 font-medium">
                {initCategory}
              </span>
            )}
            {initStartDate && initEndDate && (
              <span className="bg-white/10 border border-white/20 text-white/80 rounded-full px-3 py-1">
                {new Date(initStartDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                {' — '}
                {new Date(initEndDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Konten */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Filter */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <span className="flex items-center gap-1.5 text-sm font-medium text-slate-400">
            <SlidersHorizontal size={16} /> Filter:
          </span>
          {VEHICLE_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => handleTypeChange(t.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                type === t.value
                  ? 'bg-[#0ea5e9] text-white border-[#0ea5e9]'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-[#0ea5e9]/50 hover:text-[#0ea5e9]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-10">
            <EmptyState
              title="Kendaraan tidak ditemukan"
              description="Coba ubah kata kunci atau filter pencarian."
            />
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
            >
              <ArrowLeft size={16} /> Kembali ke Home
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-400 mb-4">
              Menampilkan <span className="font-semibold text-slate-600">{vehicles.length}</span> kendaraan
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {vehicles.map((v) => (
                <VehicleCard key={v.id} vehicle={v} startDate={initStartDate} endDate={initEndDate} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="bg-white border border-slate-200 hover:border-[#0ea5e9] hover:text-[#0ea5e9] text-slate-500 py-2 px-3 rounded-xl disabled:opacity-40 transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm text-slate-500 font-medium">Halaman {page} dari {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="bg-white border border-slate-200 hover:border-[#0ea5e9] hover:text-[#0ea5e9] text-slate-500 py-2 px-3 rounded-xl disabled:opacity-40 transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-slate-400 text-sm">Memuat pencarian...</p>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}