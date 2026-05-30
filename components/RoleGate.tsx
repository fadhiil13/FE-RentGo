'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import type { Role } from '@/types'
import { Loader2 } from 'lucide-react'

interface RoleGateProps {
  allow: Role[]
  children: React.ReactNode
}

export default function RoleGate({ allow, children }: RoleGateProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user && !allow.includes(user.role)) {
      router.replace('/')
    }
  }, [loading, user, allow, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-600" size={32} />
      </div>
    )
  }

  if (!user || !allow.includes(user.role)) return null

  return <>{children}</>
}