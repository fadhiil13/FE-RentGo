import { authApi, LoginPayload, RegisterPayload } from './api'
import type { User } from '@/types'

const TOKEN_KEY = 'rentgo_token'
const USER_KEY = 'rentgo_user'

/**
 * Login: panggil API, simpan token & user ke localStorage.
 */
export async function login(payload: LoginPayload): Promise<User> {
  const { accessToken, user } = await authApi.login(payload)

  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, accessToken)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }

  return user
}

/**
 * Register akun baru (role default USER).
 */
export async function register(payload: RegisterPayload): Promise<User> {
  return authApi.register(payload)
}

/**
 * Logout: hapus token & user dari localStorage.
 */
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }
}

/**
 * Ambil user yang sedang login dari localStorage (tanpa hit API).
 */
export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(USER_KEY)
  return raw ? (JSON.parse(raw) as User) : null
}

/**
 * Cek apakah user sedang login.
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem(TOKEN_KEY)
}

/**
 * Cek apakah user yang login adalah ADMIN.
 */
export function isAdmin(): boolean {
  const user = getStoredUser()
  return user?.role === 'ADMIN'
}