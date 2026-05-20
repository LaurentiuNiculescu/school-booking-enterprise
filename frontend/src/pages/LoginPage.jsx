import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authApi.login(email, password)
      login(res.data.token, res.data.user)
      navigate('/')
    } catch {
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen">
      {/* Left — Dark Navy branding panel */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-[#161c2d] text-white p-12">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-1">Alpha IT Solutions</h1>
          <h2 className="text-blue-400 text-lg font-semibold mb-6">School Booking Enterprise</h2>
          <p className="text-slate-400 leading-relaxed">
            Centralized IT resource management for educational institutions.
            Track, manage, and secure your school's hardware with QR-powered check-in and check-out.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[['QR', 'Smart Tracking'], ['24/7', 'Real-time'], ['RBAC', 'Secure Access']].map(([val, label]) => (
              <div key={val} className="bg-slate-800 rounded-xl p-4">
                <div className="text-xl font-bold text-blue-400">{val}</div>
                <div className="text-xs text-slate-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Login form */}
      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h2>
          <p className="text-slate-500 mb-8">Sign in to your enterprise account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="admin@school.edu"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900" />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors">
              {loading ? 'Signing in...' : 'Sign in to Dashboard'}
            </button>
          </form>
          <p className="text-center text-slate-400 text-sm mt-8">Alpha IT Solutions · Enterprise Platform</p>
        </div>
      </div>
    </div>
  )
}
