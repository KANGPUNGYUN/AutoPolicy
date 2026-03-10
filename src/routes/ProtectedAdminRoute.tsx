import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

type Props = {
  children: JSX.Element
}

export function ProtectedAdminRoute({ children }: Props) {
  const { user, role, loading } = useAuth()

  if (loading) {
    return <div>로딩 중...</div>
  }

  if (!user || role !== 'admin') {
    return <Navigate to="/login" replace />
  }

  return children
}

