'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  Menu, X, Car, LayoutDashboard,
  ClipboardList, LogOut, LogIn, UserPlus, Home,
  CreditCard, FileText, Star, Users, Info
} from 'lucide-react'

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout, loading } = useAuth()
  const pathname  = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted,  setMounted]  = useState(false)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { setMenuOpen(false) }, [pathname])

  const showAuth = mounted && !loading

  const navLink = (href: string) =>
    `text-sm transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium ${
      pathname === href
        ? 'text-[#4ade80] bg-[#4ade80]/10'
        : 'text-white/50 hover:text-white hover:bg-white/5'
    }`

  return (
    <nav className="bg-[#080f1a]/80 backdrop-blur-md border-b border-white/[0.06] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#4ade80]/15 border border-[#4ade80]/25 rounded-xl flex items-center justify-center">
              <Car size={18} className="text-[#4ade80]" />
            </div>
            <span className="text-xl font-bold text-white">
              Rent<span className="text-[#4ade80]">Go</span>
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {!showAuth && (
              <div className="flex gap-3">
                <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
                <div className="h-8 w-20 bg-white/10 rounded-xl animate-pulse" />
              </div>
            )}

            {/* Belum login */}
            {showAuth && !isAuthenticated && (
              <>
                <Link href="/" className={navLink('/')}>
                  <Home size={15} /> Home
                </Link>
                <Link href="/vehicles" className={navLink('/vehicles')}>
                  <Car size={15} /> Kendaraan
                </Link>
                <Link href="/about" className={navLink('/about')}>
                  <Info size={15} /> Tentang Kami
                </Link>
                <Link href="/login" className={navLink('/login')}>
                  <LogIn size={15} /> Login
                </Link>
                <Link href="/register" className="ml-2 flex items-center gap-1.5 bg-[#4ade80] hover:bg-[#22c55e] text-[#080f1a] font-bold text-sm py-2 px-4 rounded-xl transition-colors">
                  <UserPlus size={15} /> Daftar
                </Link>
              </>
            )}

            {/* User biasa */}
            {showAuth && isAuthenticated && !isAdmin && (
              <>
                <Link href="/" className={navLink('/')}>
                  <Home size={15} /> Home
                </Link>
                <Link href="/vehicles" className={navLink('/vehicles')}>
                  <Car size={15} /> Kendaraan
                </Link>
                <Link href="/about" className={navLink('/about')}>
                  <Info size={15} /> Tentang Kami
                </Link>
                <Link href="/my-rentals" className={navLink('/my-rentals')}>
                  <ClipboardList size={15} /> Riwayat Sewa
                </Link>
                <div className="flex items-center gap-2 ml-3 pl-3 border-l border-white/[0.08]">
                  {/* ── Profile — bisa diklik ── */}
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-[#4ade80]/30 hover:bg-[#4ade80]/5 rounded-xl px-3 py-1.5 transition-all"
                  >
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt="avatar" className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-[#4ade80]/20 border border-[#4ade80]/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-[#4ade80] text-xs font-bold">
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-medium text-white/70 max-w-[100px] truncate">
                      {user?.name}
                    </span>
                  </Link>
                  <button onClick={logout} className="flex items-center gap-1.5 text-sm text-white/40 hover:text-red-400 hover:bg-red-400/10 px-3 py-1.5 rounded-xl transition-all">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </>
            )}

            {/* Admin */}
            {showAuth && isAuthenticated && isAdmin && (
              <>
                <Link href="/admin" className={navLink('/admin')}>
                  <LayoutDashboard size={15} /> Dashboard
                </Link>
                <Link href="/admin/vehicles" className={navLink('/admin/vehicles')}>
                  <Car size={15} /> Kendaraan
                </Link>
                <Link href="/admin/rentals" className={navLink('/admin/rentals')}>
                  <ClipboardList size={15} /> Pesanan
                </Link>
                <Link href="/admin/payments" className={navLink('/admin/payments')}>
                  <CreditCard size={15} /> Pembayaran
                </Link>
                <Link href="/admin/invoices" className={navLink('/admin/invoices')}>
                  <FileText size={15} /> Invoice
                </Link>
                <Link href="/admin/reviews" className={navLink('/admin/reviews')}>
                  <Star size={15} /> Review
                </Link>
                <Link href="/admin/users" className={navLink('/admin/users')}>
                  <Users size={15} /> Pengguna
                </Link>
                <div className="flex items-center gap-2 ml-3 pl-3 border-l border-white/[0.08]">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
                    <div className="w-6 h-6 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
                      <span className="text-amber-400 text-xs font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                      Admin
                    </span>
                  </div>
                  <button onClick={logout} className="flex items-center gap-1.5 text-sm text-white/40 hover:text-red-400 hover:bg-red-400/10 px-3 py-1.5 rounded-xl transition-all">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button className="md:hidden p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#080f1a] border-t border-white/[0.06] px-4 py-4 space-y-1.5">

          {showAuth && !isAuthenticated && (
            <>
              <Link href="/" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors">
                <Home size={16} /> Home
              </Link>
              <Link href="/vehicles" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors">
                <Car size={16} /> Kendaraan
              </Link>
              <Link href="/about" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors">
                <Info size={16} /> Tentang Kami
              </Link>
              <Link href="/login" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors">
                <LogIn size={16} /> Login
              </Link>
              <Link href="/register" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm bg-[#4ade80] text-[#080f1a] font-bold">
                <UserPlus size={16} /> Daftar
              </Link>
            </>
          )}

          {showAuth && isAuthenticated && !isAdmin && (
            <>
              {/* ── Profile card mobile — bisa diklik ── */}
              <Link href="/profile" className="flex items-center gap-3 px-4 py-3 bg-white/[0.04] border border-white/10 hover:border-[#4ade80]/25 rounded-xl mb-2 transition-all">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="avatar" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#4ade80]/15 border border-[#4ade80]/25 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#4ade80] text-sm font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                  <p className="text-xs text-[#4ade80]/60">Lihat & edit profil →</p>
                </div>
              </Link>
              <Link href="/" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors">
                <Home size={16} /> Home
              </Link>
              <Link href="/vehicles" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors">
                <Car size={16} /> Kendaraan
              </Link>
              <Link href="/about" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors">
                <Info size={16} /> Tentang Kami
              </Link>
              <Link href="/my-rentals" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors">
                <ClipboardList size={16} /> Riwayat Sewa
              </Link>
              <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-400/10 transition-colors">
                <LogOut size={16} /> Logout
              </button>
            </>
          )}

          {showAuth && isAuthenticated && isAdmin && (
            <>
              <div className="flex items-center gap-3 px-4 py-3 bg-amber-400/5 border border-amber-400/15 rounded-xl mb-2">
                <div className="w-9 h-9 rounded-full bg-amber-400/15 border border-amber-400/25 flex items-center justify-center">
                  <span className="text-amber-400 text-sm font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                  <span className="text-xs font-semibold text-amber-400">Administrator</span>
                </div>
              </div>
              <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors">
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link href="/admin/vehicles" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors">
                <Car size={16} /> Kendaraan
              </Link>
              <Link href="/admin/rentals" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors">
                <ClipboardList size={16} /> Pesanan
              </Link>
              <Link href="/admin/payments" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors">
                <CreditCard size={16} /> Pembayaran
              </Link>
              <Link href="/admin/invoices" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors">
                <FileText size={16} /> Invoice
              </Link>
              <Link href="/admin/reviews" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors">
                <Star size={16} /> Review
              </Link>
              <Link href="/admin/users" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors">
                <Users size={16} /> Pengguna
              </Link>
              <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-400/10 transition-colors">
                <LogOut size={16} /> Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}