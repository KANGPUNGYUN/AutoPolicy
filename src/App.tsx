import './App.css'
import { NavLink, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { GeneratorPage } from './routes/Generator'
import { AdminPage } from './routes/Admin'
import { LoginPage } from './routes/Login'
import { ProtectedAdminRoute } from './routes/ProtectedAdminRoute'
import { useAuth } from './contexts/AuthContext'

function AppHeader() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/generator')
  }

  return (
    <header className="app-header">
      <div>
        <h1>AutoPolicy</h1>
        <p className="app-subtitle">
          회사 정보와 옵션을 선택해서 이용약관 / 개인정보 처리방침을 자동 생성하고,
          어드민에서 법령·사례 텍스트를 관리하세요.
        </p>
      </div>
      <div className="header-actions">
        <nav className="main-nav">
          <NavLink
            to="/generator"
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link-active' : 'nav-link'
            }
          >
            생성기
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link-active' : 'nav-link'
            }
          >
            어드민
          </NavLink>
        </nav>
        {user ? (
          <button type="button" className="header-link" onClick={handleLogout}>
            로그아웃
          </button>
        ) : (
          <NavLink to="/login" className="header-link">
            로그인
          </NavLink>
        )}
        <a
          href="https://github.com/KANGPUNGYUN/AutoPolicy"
          target="_blank"
          rel="noreferrer"
          className="header-link secondary"
        >
          GitHub
        </a>
      </div>
    </header>
  )
}

function App() {
  return (
    <div className="app-root">
      <AppHeader />
      <Routes>
        <Route path="/" element={<Navigate to="/generator" replace />} />
        <Route path="/generator" element={<GeneratorPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminPage />
            </ProtectedAdminRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  )
}

export default App
