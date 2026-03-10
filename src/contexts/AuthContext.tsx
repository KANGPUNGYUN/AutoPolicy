import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import {
  onAuthStateChanged,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth'
import { auth } from '../firebase/app'

type Role = 'admin' | 'viewer' | 'unknown'

type AuthContextValue = {
  user: FirebaseUser | null
  role: Role
  loading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [role, setRole] = useState<Role>('unknown')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      // 간단한 초기 버전: 로그인 되면 admin으로 가정 (추후 Firestore role 연동 가능)
      setRole(u ? 'admin' : 'unknown')
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const logout = async () => {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}

