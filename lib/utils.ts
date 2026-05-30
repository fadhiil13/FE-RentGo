/**
 * Format angka ke Rupiah.
 * formatRupiah(350000) -> "Rp 350.000"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format ISO date string ke tanggal Indonesia.
 * formatDate("2025-08-01T08:00:00Z") -> "1 Agustus 2025"
 */
export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Format dengan jam.
 * formatDateTime("2025-08-01T08:00:00Z") -> "1 Agt 2025, 15.00"
 */
export function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Hitung jumlah hari sewa (ceil, minimal 1) — sama seperti logika backend.
 */
export function calculateDays(startDate: string, endDate: string): number {
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()
  const diffMs = end - start
  return Math.max(1, Math.ceil(diffMs / 86400000))
}

/**
 * Label & warna untuk status rental (untuk badge UI).
 */
export const RENTAL_STATUS_CONFIG: Record<
  string,
  { label: string; color: string }
> = {
  PENDING: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: 'Dikonfirmasi', color: 'bg-blue-100 text-blue-800' },
  ONGOING: { label: 'Berlangsung', color: 'bg-indigo-100 text-indigo-800' },
  COMPLETED: { label: 'Selesai', color: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Dibatalkan', color: 'bg-red-100 text-red-800' },
}

/**
 * Label & warna untuk status kendaraan.
 */
export const VEHICLE_STATUS_CONFIG: Record<
  string,
  { label: string; color: string }
> = {
  AVAILABLE: { label: 'Tersedia', color: 'bg-green-100 text-green-800' },
  RENTED: { label: 'Disewa', color: 'bg-orange-100 text-orange-800' },
  MAINTENANCE: { label: 'Perawatan', color: 'bg-gray-100 text-gray-800' },
}

/**
 * Label tipe kendaraan dalam Bahasa Indonesia.
 */
export const VEHICLE_TYPE_LABEL: Record<string, string> = {
  CAR: 'Mobil',
  MOTORCYCLE: 'Motor',
  BICYCLE: 'Sepeda',
  BUS: 'Bus',
}