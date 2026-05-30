import axios from 'axios'
import toast from 'react-hot-toast'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// REQUEST interceptor — otomatis tempel token
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('rentgo_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// RESPONSE interceptor — tangani 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('rentgo_token')
        localStorage.removeItem('rentgo_user')
        toast.error('Sesi berakhir, silakan login lagi')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Helper: ambil data dari res.data.data
export function unwrap<T>(res: { data: { data: T } }): T {
  return res.data.data
}

// Helper: ambil pesan error
export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message ?? 'Terjadi kesalahan'
  }
  return 'Terjadi kesalahan'
}

export default axiosInstance