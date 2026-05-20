import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth()
  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#0f172a]">
      <div className="text-white text-lg">Loading...</div>
    </div>
  )
  return token ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { token } = useAuth()
  return !token ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/*" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
