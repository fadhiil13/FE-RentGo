'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Loader2, Car, LogIn } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { getErrorMessage } from '@/lib/axios'

const loginSchema = z.object({
  email:    z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true)
    try {
      const user = await login({ email: data.email, password: data.password })
      toast.success(`Selamat datang, ${user.name}!`)
      if (user.role === 'ADMIN') {
        router.push('/admin')
      } else {
        router.push('/')
      }
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080f1a] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Dekorasi blob */}
      <div className="absolute top-[-100px] right-[-80px] w-[350px] h-[350px] rounded-full bg-[#4ade80] opacity-[0.04] pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-60px] w-[280px] h-[280px] rounded-full bg-[#4ade80] opacity-[0.03] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#4ade80]/15 border border-[#4ade80]/25 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Car size={28} className="text-[#4ade80]" />
          </div>
          <h1 className="text-2xl font-bold text-white">Masuk ke RentGo</h1>
          <p className="text-white/40 text-sm mt-1">Sewa kendaraan impianmu sekarang</p>
        </div>

        {/* Card Form */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wide mb-1.5">
                Email <span className="text-[#4ade80]">*</span>
              </label>
              <input
                type="email"
                placeholder="nama@email.com"
                {...register('email')}
                className="w-full bg-white/5 border border-white/10 focus:border-[#4ade80]/40 focus:bg-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none transition-all [color-scheme:dark]"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wide mb-1.5">
                Password <span className="text-[#4ade80]">*</span>
              </label>
              <input
                type="password"
                placeholder="Minimal 6 karakter"
                {...register('password')}
                className="w-full bg-white/5 border border-white/10 focus:border-[#4ade80]/40 focus:bg-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none transition-all [color-scheme:dark]"
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-[#4ade80] hover:bg-[#22c55e] active:bg-[#16a34a] disabled:opacity-50 disabled:cursor-not-allowed text-[#080f1a] font-bold py-2.5 px-4 rounded-xl transition-colors text-sm mt-2"
            >
              {isSubmitting
                ? <><Loader2 size={16} className="animate-spin" /> Memproses...</>
                : <><LogIn size={16} /> Masuk</>
              }
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-white/[0.06] text-center">
            <p className="text-sm text-white/40">
              Belum punya akun?{' '}
              <Link href="/register" className="text-[#4ade80] font-semibold hover:underline">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-white/20 mt-6">
          © 2026 RentGo. All rights reserved.
        </p>
      </div>
    </div>
  )
}