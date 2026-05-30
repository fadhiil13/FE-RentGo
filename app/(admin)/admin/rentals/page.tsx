'use client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { RefreshCw, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { rentalApi } from '@/lib/api'
import { getErrorMessage } from '@/lib/axios'
import { formatRupiah, formatDate } from '@/lib/format'
import type { Rental, RentalStatus, PaginationMeta } from '@/types'
import Loader from '@/components/Loader'
import EmptyState from '@/components/EmptyState'

const STATUS_OPTIONS: { value: RentalStatus | ''; label: string }[] = [
  { value: '',           label: 'Semua Status' },
  { value: 'PENDING',    label: 'Menunggu' },
  { value: 'CONFIRMED',  label: 'Dikonfirmasi' },
  { value: 'ONGOING',    label: 'Berlangsung' },
  { value: 'COMPLETED',  label: 'Selesai' },
  { value: 'CANCELLED',  label: 'Dibatalkan' },
]

const NEXT_STATUSES: Partial<Record<RentalStatus, RentalStatus[]>> = {
  PENDING:   ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['ONGOING',   'CANCELLED'],
  ONGOING:   ['COMPLETED', 'CANCELLED'],
}

const statusBadge: Record<string, string> = {
  PENDING:   'badge-yellow',
  CONFIRMED: 'badge-blue',
  ONGOING:   'badge-green',
  COMPLETED: 'badge-gray',
  CANCELLED: 'badge-red',
}
const statusLabel: Record<string, string> = {
  PENDING:   'Menunggu',
  CONFIRMED: 'Dikonfirmasi',
  ONGOING:   'Berlangsung',
  COMPLETED: 'Selesai',
  CANCELLED: 'Dibatalkan',
}

const LIMIT = 10

export default function AdminRentalsPage() {
  const [rentals, setRentals]           = useState<Rental[]>([])
  const [meta, setMeta]                 = useState<PaginationMeta | null>(null)
  const [loading, setLoading]           = useState(true)
  const [filterStatus, setFilterStatus] = useState<RentalStatus | ''>('')
  const [updatingId, setUpdatingId]     = useState<string | null>(null)
  const [page, setPage]                 = useState(1)

  const fetchRentals = async (p = page) => {
    setLoading(true)
    try {
      const res = await rentalApi.getAllPaginated({
        ...(filterStatus ? { status: filterStatus } : {}),
        page: p,
        limit: LIMIT,
      })
      setRentals(res.items)
      setMeta(res.meta)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
    fetchRentals(1)
  }, [filterStatus])

  useEffect(() => {
    fetchRentals(page)
  }, [page])

  const handleStatusChange = async (id: string, newStatus: RentalStatus) => {
    setUpdatingId(id)
    try {
      await rentalApi.updateStatus(id, newStatus)
      toast.success(`Status diubah ke "${statusLabel[newStatus]}"`)
      fetchRentals(page)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kelola Pesanan</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {meta ? `${meta.total} pesanan ditemukan` : `${rentals.length} pesanan ditemukan`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as RentalStatus | '')}
            className="input-field w-auto py-2 text-sm"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button onClick={() => fetchRentals(page)} className="btn-secondary py-2 px-3">
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : rentals.length === 0 ? (
        <EmptyState title="Tidak ada pesanan" description="Belum ada pesanan dengan status ini." />
      ) : (
        <>
          {/* Tabel Desktop */}
          <div className="hidden lg:block card !p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Penyewa', 'Kendaraan', 'Tanggal', 'Total', 'Status', 'Aksi'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rentals.map((r) => {
                  const nextOpts   = NEXT_STATUSES[r.status] ?? []
                  const isUpdating = updatingId === r.id
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-800">{r.user?.name ?? '—'}</p>
                        <p className="text-xs text-slate-400">{r.user?.email ?? ''}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-700">{r.vehicle?.name ?? '—'}</p>
                        <p className="text-xs text-slate-400">{r.vehicle?.plateNumber ?? ''}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-600 text-xs">
                        <p>{formatDate(r.startDate)}</p>
                        <p className="text-slate-400">s/d {formatDate(r.endDate)}</p>
                      </td>
                      <td className="px-5 py-4 font-semibold text-primary-600">
                        {formatRupiah(r.totalPrice)}
                      </td>
                      <td className="px-5 py-4">
                        <span className={statusBadge[r.status] ?? 'badge-gray'}>
                          {statusLabel[r.status] ?? r.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {isUpdating ? (
                          <Loader2 size={16} className="animate-spin text-primary-500" />
                        ) : nextOpts.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {nextOpts.map((s) => (
                              <button
                                key={s}
                                onClick={() => handleStatusChange(r.id, s)}
                                className={`text-xs px-2.5 py-1 rounded-lg font-medium border transition-colors ${
                                  s === 'CANCELLED'
                                    ? 'border-red-200 text-red-600 hover:bg-red-50'
                                    : 'border-primary-200 text-primary-600 hover:bg-primary-50'
                                }`}
                              >
                                → {statusLabel[s]}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Final</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Kartu Mobile */}
          <div className="lg:hidden space-y-3">
            {rentals.map((r) => {
              const nextOpts   = NEXT_STATUSES[r.status] ?? []
              const isUpdating = updatingId === r.id
              return (
                <div key={r.id} className="card space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-800">{r.user?.name ?? '—'}</p>
                      <p className="text-xs text-slate-400">{r.user?.email}</p>
                    </div>
                    <span className={statusBadge[r.status] ?? 'badge-gray'}>
                      {statusLabel[r.status]}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600 space-y-1 border-t border-slate-100 pt-3">
                    <p><span className="text-slate-400">Kendaraan:</span> {r.vehicle?.name ?? '—'}</p>
                    <p><span className="text-slate-400">Plat:</span> {r.vehicle?.plateNumber ?? '—'}</p>
                    <p><span className="text-slate-400">Mulai:</span> {formatDate(r.startDate)}</p>
                    <p><span className="text-slate-400">Selesai:</span> {formatDate(r.endDate)}</p>
                    <p><span className="text-slate-400">Total:</span>{' '}
                      <span className="font-semibold text-primary-600">{formatRupiah(r.totalPrice)}</span>
                    </p>
                  </div>
                  {isUpdating ? (
                    <div className="flex items-center gap-2 text-sm text-primary-600">
                      <Loader2 size={14} className="animate-spin" /> Memperbarui...
                    </div>
                  ) : nextOpts.length > 0 ? (
                    <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                      {nextOpts.map((s) => (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(r.id, s)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-colors ${
                            s === 'CANCELLED'
                              ? 'border-red-200 text-red-600 hover:bg-red-50'
                              : 'border-primary-200 text-primary-600 hover:bg-primary-50'
                          }`}
                        >
                          → {statusLabel[s]}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic border-t border-slate-100 pt-3">Status final</p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-slate-500">
                Halaman {meta.page} dari {meta.totalPages} · {meta.total} data
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary py-2 px-3 disabled:opacity-40"
                >
                  <ChevronLeft size={15} />
                </button>
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
                      page === p
                        ? 'bg-primary-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={page === meta.totalPages}
                  className="btn-secondary py-2 px-3 disabled:opacity-40"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}