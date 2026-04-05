'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

export interface User {
  id: string
  email: string
  name: string
  isAdmin?: boolean
  isSeller?: boolean
  sellerStatus?: "none" | "pending" | "approved" | "rejected"
  backendToken?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()

  const isLoading = status === 'loading'

  const user: User | null = session?.user
    ? {
        id: (session.user as any).id,
        email: session.user.email!,
        name: session.user.name!,
        isAdmin: (session.user as any).isAdmin,
        isSeller: (session.user as any).isSeller,
        sellerStatus: (session.user as any).sellerStatus,
        backendToken: (session.user as any).backendToken,
      }
    : null

  const login = async (email: string, password: string) => {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    if (result?.error) {
      throw new Error(result.error)
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      }
    )
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.message || 'Signup failed')
    }
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    if (result?.error) {
      throw new Error(result.error)
    }
  }

  const logout = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}