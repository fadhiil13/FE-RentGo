'use client'
import { useState } from 'react'
import { Star } from 'lucide-react'
import { reviewApi } from '@/lib/api'
import { getErrorMessage } from '@/lib/axios'
import toast from 'react-hot-toast'

interface ReviewFormProps {
  rentalId: string
  onSuccess?: () => void
}

export default function ReviewForm({ rentalId, onSuccess }: ReviewFormProps) {
  const [rating, setRating]   = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Pilih rating dulu!')
      return
    }
    if (!comment.trim()) {
      toast.error('Tulis komentar dulu!')
      return
    }
    setLoading(true)
    try {
      await reviewApi.create({ rentalId, rating, comment })
    //   toast.success('Review berhasil dikirim!')
      setRating(0)
      setComment('')
      onSuccess?.()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
      <h3 className="font-bold text-slate-800">Tulis Review</h3>

      {/* Bintang */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
          >
            <Star
              size={28}
              className={`transition-colors ${
                star <= (hovered || rating)
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-slate-200'
              }`}
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="text-sm text-slate-500 ml-2 self-center">
            {['', 'Sangat Buruk', 'Buruk', 'Cukup', 'Bagus', 'Sangat Bagus'][rating]}
          </span>
        )}
      </div>

      {/* Komentar */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Ceritakan pengalaman kamu..."
        rows={3}
        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="btn-primary w-full disabled:opacity-60"
      >
        {loading ? 'Mengirim...' : 'Kirim Review'}
      </button>
    </div>
  )
}