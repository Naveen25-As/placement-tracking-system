import React, { createContext, useContext, useEffect, useState } from 'react'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('pt_user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('pt_token')
    if (!token) {
      setLoading(false)
      return
    }
    authService
      .getCurrentUser()
      .then((data) => {
        setUser(data)
        localStorage.setItem('pt_user', JSON.stringify(data))
      })
      .catch(() => {
        localStorage.removeItem('pt_token')
        localStorage.removeItem('pt_user')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const data = await authService.login({ email, password })
    localStorage.setItem('pt_token', data.token)
    localStorage.setItem('pt_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const register = async (payload) => {
    const data = await authService.register(payload)
    localStorage.setItem('pt_token', data.token)
    localStorage.setItem('pt_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('pt_token')
    localStorage.removeItem('pt_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
