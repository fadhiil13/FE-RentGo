'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { RefreshCw, Star, Trash2, Loader2 } from 'lucide-react'
import { reviewApi } from '@/lib/api'
import { getErrorMessage } from '@/lib/axios'
import type { Review } from '@/types'
import Loader from '@/components/Loader'
import EmptyState from '@/components/EmptyState'

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={13}
          className={s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
        />
      ))}
    </div>
  )
}

export default function AdminReviewsPage() {
  const [reviews, setReviews]       = useState<Review[]>([])
  const [loading, setLoading]       = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const data = await reviewApi.getAll()
      setReviews(Array.isArray(data) ? data : (data as any)?.items ?? [])
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReviews() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus review ini?')) return
    setDeletingId(id)
    try {
      await reviewApi.delete(id)
      toast.success('Review berhasil dihapus!')
      setReviews((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setDeletingId(null)
    }
  }

  const avgRating = reviews.length
    ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1)
    : '0'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kelola Review</h1>
          <p className="text-slate-500 text-sm mt-0.5">{reviews.length} review ditemukan</p>
        </div>
        <button onClick={fetchReviews} className="btn-secondary py-2 px-3">
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Summary */}
      {reviews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="card text-center">
            <p className="text-3xl font-extrabold text-amber-500">{avgRating}</p>
            <div className="flex justify-center mt-1">
              <StarDisplay rating={Math.round(Number(avgRating))} />
            </div>
            <p className="text-xs text-slate-400 mt-1">Rating Rata-rata</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-extrabold text-slate-800">{reviews.length}</p>
            <p className="text-xs text-slate-400 mt-1">Total Review</p>
          </div>
          <div className="card text-center col-span-2 md:col-span-1">
            <p className="text-3xl font-extrabold text-emerald-600">
              {reviews.filter((r) => r.rating >= 4).length}
            </p>
            <p className="text-xs text-slate-400 mt-1">Review Positif (≥4★)</p>
          </div>
        </div>
      )}

      {loading ? (
        <Loader />
      ) : reviews.length === 0 ? (
        <EmptyState title="Belum ada review" description="Belum ada review dari pengguna." />
      ) : (
        <>
          {/* Tabel Desktop */}
          <div className="hidden lg:block card !p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Pengguna', 'Rating', 'Komentar', 'Tanggal', 'Aksi'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800">{r.user?.name ?? '—'}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <StarDisplay rating={r.rating} />
                        <span className="text-xs font-semibold text-slate-600">{r.rating}/5</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      <p className="text-slate-600 text-sm line-clamp-2">{r.comment}</p>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleDelete(r.id)}
                        disabled={deletingId === r.id}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {deletingId === r.id
                          ? <><Loader2 size={12} className="animate-spin" /> Menghapus...</>
                          : <><Trash2 size={12} /> Hapus</>
                        }
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Kartu Mobile */}
          <div className="lg:hidden space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="card space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-800">{r.user?.name ?? '—'}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <StarDisplay rating={r.rating} />
                      <span className="text-xs text-slate-400">{r.rating}/5</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">
                    {new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <p className="text-sm text-slate-600 border-t border-slate-100 pt-3">{r.comment}</p>
                <div className="border-t border-slate-100 pt-3">
                  <button
                    onClick={() => handleDelete(r.id)}
                    disabled={deletingId === r.id}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {deletingId === r.id
                      ? <><Loader2 size={12} className="animate-spin" /> Menghapus...</>
                      : <><Trash2 size={12} /> Hapus Review</>
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}