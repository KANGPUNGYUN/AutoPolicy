import '../App.css'
import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import { auth } from '../firebase/app'
import { useAuth } from '../contexts/AuthContext'

export function LoginPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    // 이미 로그인된 경우 어드민으로 보냄
    void navigate('/admin', { replace: true })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/admin', { replace: true })
    } catch (err) {
      console.error(err)
      setError('로그인에 실패했습니다. 이메일/비밀번호를 확인하세요.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleLogin = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      navigate('/admin', { replace: true })
    } catch (err) {
      console.error(err)
      setError('구글 로그인에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="app-main">
      <section className="form-column">
        <h2>어드민 로그인</h2>
        <p className="section-description">
          Firebase Auth로 보호되는 어드민 계정으로 로그인합니다.
        </p>
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label>
            <span>이메일</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            <span>비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <div className="error-text">{error}</div>}
          <button type="submit" disabled={submitting}>
            {submitting ? '로그인 중...' : '로그인'}
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => void handleGoogleLogin()}
          >
            Google 계정으로 로그인
          </button>
        </form>
      </section>
      <section className="preview-column">
        <div className="disclaimer">
          이 페이지는 관리자를 위한 영역입니다. Firebase 콘솔에서 생성한 어드민 계정으로만
          접근이 가능합니다.
        </div>
      </section>
    </main>
  )
}

