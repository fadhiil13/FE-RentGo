'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Loader2, Camera, User, Mail, Phone, Save, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { authApi } from '@/lib/api'
import { getErrorMessage } from '@/lib/axios'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, setUser, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  const [name, setName]         = useState('')
  const [phone, setPhone]       = useState('')
  const [saving, setSaving]     = useState(false)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview]   = useState<string | null>(null)
  const fileRef                 = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login')
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (user) {
      setName(user.name  ?? '')
      setPhone(user.phone ?? '')
      setPreview(user.avatarUrl ?? null)
    }
  }, [user])

  const handleSave = async () => {
    if (!name.trim()) { toast.error('Nama tidak boleh kosong'); return }
    setSaving(true)
    try {
      const updated = await authApi.updateProfile({ name, phone })
      setUser(updated)
      toast.success('Profil berhasil disimpan!')
      router.push('/')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Format harus JPG/PNG/WEBP'); return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran maksimal 5MB'); return
    }
    // Preview lokal
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)

    // Upload ke server
    setUploading(true)
    try {
      const updated = await authApi.uploadAvatar(file)
      setUser(updated)
      toast.success('Foto profil berhasil diupload!')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#080f1a] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#4ade80]" size={32} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080f1a] text-white">
      <div className="max-w-xl mx-auto px-4 py-10">

        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-[#4ade80] mb-6 transition-colors">
          <ArrowLeft size={16} /> Kembali
        </Link>

        <h1 className="text-2xl font-bold text-white mb-8">Profil Saya</h1>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-white/10 border-2 border-white/20 flex items-center justify-center">
              {preview ? (
                <img src={preview} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-[#4ade80]">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-8 h-8 bg-[#4ade80] hover:bg-[#22c55e] rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
            >
              {uploading
                ? <Loader2 size={14} className="animate-spin text-[#080f1a]" />
                : <Camera size={14} className="text-[#080f1a]" />
              }
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <p className="text-xs text-white/30 mt-3">Klik ikon kamera untuk ganti foto</p>
          <p className="text-xs text-white/20">JPG · PNG · WEBP — maks. 5MB</p>
        </div>

        {/* Form */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 space-y-5">

          {/* Email — read only */}
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wide mb-2">Email</label>
            <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3">
              <Mail size={15} className="text-white/30 flex-shrink-0" />
              <span className="text-sm text-white/40">{user.email}</span>
              <span className="ml-auto text-xs bg-white/10 text-white/30 px-2 py-0.5 rounded-full">Tidak dapat diubah</span>
            </div>
          </div>

          {/* Nama */}
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wide mb-2">Nama Lengkap</label>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 focus-within:border-[#4ade80]/40 rounded-xl px-4 py-3 transition-all">
              <User size={15} className="text-[#4ade80] flex-shrink-0" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama lengkap kamu"
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/25 focus:outline-none"
              />
            </div>
          </div>

          {/* No HP */}
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wide mb-2">Nomor HP</label>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 focus-within:border-[#4ade80]/40 rounded-xl px-4 py-3 transition-all">
              <Phone size={15} className="text-[#4ade80] flex-shrink-0" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh: 08123456789"
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/25 focus:outline-none"
              />
            </div>
          </div>

          {/* Tombol Simpan */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-[#4ade80] hover:bg-[#22c55e] disabled:opacity-50 disabled:cursor-not-allowed text-[#080f1a] font-bold py-3 rounded-xl transition-colors"
          >
            {saving
              ? <><Loader2 size={16} className="animate-spin" /> Menyimpan...</>
              : <><Save size={16} /> Simpan Perubahan</>
            }
          </button>
        </div>

      </div>
    </div>
  )
}