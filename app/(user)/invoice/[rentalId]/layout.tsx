'use client'

import ProtectedRoute from '@/components/ProtectedRoute'

export default function InvoiceLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  )
}