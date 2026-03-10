import { Navigate } from 'react-router-dom'
import { type ReactNode } from 'react'
import { useAuth } from '../contexts/AuthContext'

type Props = {
  children: ReactNode
}

export function ProtectedAdminRoute({ children }: Props) {
  const { user, role, loading } = useAuth()

  if (loading) {
    return <div>로딩 중...</div>
  }

  if (!user || role !== 'admin') {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

