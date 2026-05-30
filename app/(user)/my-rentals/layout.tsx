'use client'

import ProtectedRoute from '@/components/ProtectedRoute'

export default function MyRentalsLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  )
}