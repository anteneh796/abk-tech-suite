"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { api, SOCKET_URL } from "@/lib/api"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const restore = async () => {
      setIsLoading(true)
      try {
        const storedToken = localStorage.getItem('abk_token')
        const storedUser = localStorage.getItem('abk_user')

        if (storedToken) {
          // Verify session via /me
          try {
            const data = await api.me()
            setUser(data.user)
            localStorage.setItem('abk_user', JSON.stringify(data.user))
            setIsLoading(false)
            return
          } catch (err) {
            // Access token might be expired, interceptor will try refresh.
            // If me() fails after interceptor attempt, we fall through to cleanup.
          }
        }

        // Cleanup if no session could be restored
        localStorage.removeItem('abk_user')
        localStorage.removeItem('abk_token')
        setUser(null)
      } catch (err) {
        console.error('Failed to restore session', err)
      } finally {
        setIsLoading(false)
      }
    }

    restore()
  }, [])

  const login = async (email, password) => {
    try {
      const data = await api.login(email, password)
      if (data.user) {
        setUser(data.user)
        return { success: true, user: data.user }
      }
      return { success: false, error: 'Unexpected response' }
    } catch (err) {
      console.error('Login error', err)
      return { success: false, error: err.response?.data?.message || 'Login failed' }
    }
  }

  const register = async (userData) => {
    try {
      const data = await api.register(userData)
      if (data.user) {
        setUser(data.user)
        return { success: true, user: data.user }
      }
      return { success: false, error: 'Unexpected response' }
    } catch (err) {
      console.error('Register error', err)
      return { success: false, error: err.response?.data?.message || 'Registration failed' }
    }
  }

  const logout = async () => {
    try {
      await api.logout()
    } catch (err) {
      console.error('Logout error', err)
    } finally {
      setUser(null)
    }
  }

  const refreshUser = async () => {
    try {
      const data = await api.me()
      setUser(data.user)
      localStorage.setItem('abk_user', JSON.stringify(data.user))
      return data.user
    } catch (err) {
      console.error('Failed to refresh user', err)
      return null
    }
  }

  const [socket, setSocket] = useState(null)

  // Socket initialization
  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      const newSocket = require('socket.io-client').io(SOCKET_URL, { withCredentials: true });

      newSocket.on('connect', () => {
        console.log('Socket Connected:', newSocket.id)
        newSocket.emit('join', user.id || user._id);
        setSocket(newSocket)
      });

      return () => {
        newSocket.disconnect();
        setSocket(null)
      };
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, socket, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
