import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored && token) setUser(JSON.parse(stored))
    setLoading(false)
  }, [])

  const login = (tokenValue, userData) => {
    setToken(tokenValue)
    setUser(userData)
    localStorage.setItem('token', tokenValue)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const isSuperAdmin = () => user?.role === 'SuperAdmin'

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isSuperAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
