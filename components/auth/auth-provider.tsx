// auth-provider.ts (შესწორებული)

"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@/lib/auth"
import { getCurrentUser } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  isLoading: boolean
  refreshUser: () => void
  // **დამატებულია:** setUser ფუნქცია კონტექსტის ტიპში
  setUser: (user: User | null) => void 
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isLoading: true,
  refreshUser: () => {},
  // **დამატებულია:**setUser-ის ცარიელი ფუნქციის დეფოლტ მნიშვნელობა
  setUser: () => {}, 
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // refreshUser ფუნქცია იყენებს ლოკალურ setUser-ს
  const refreshUser = () => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }

  useEffect(() => {
    refreshUser()
    setIsLoading(false)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === "admin",
        isLoading,
        refreshUser,
        // **გასაღები ცვლილება:** setUser ფუნქციის გადმოცემა
        setUser, 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)