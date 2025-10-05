"use client"

import type { User } from "./types"

// Mock user storage - in production, use proper database
const USERS_KEY = "lelo_users"
const CURRENT_USER_KEY = "lelo_current_user"

export function getUsers(): User[] {
  if (typeof window === "undefined") return []
  const users = localStorage.getItem(USERS_KEY)
  return users ? JSON.parse(users) : []
}

export function saveUsers(users: User[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem(CURRENT_USER_KEY)
  return user ? JSON.parse(user) : null
}

export function setCurrentUser(user: User | null): void {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

export function register(
  email: string,
  password: string,
  name: string,
  role: "admin" | "user" = "user",
): { success: boolean; message: string; user?: User } {
  const users = getUsers()

  if (users.find((u) => u.email === email)) {
    return { success: false, message: "User already exists" }
  }

  const newUser: User = {
    id: Date.now(),
    email,
    password, // In production, hash this!
    role,
    name,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  saveUsers(users)

  return { success: true, message: "User created successfully", user: newUser }
}

export function login(email: string, password: string): { success: boolean; message: string; user?: User } {
  const users = getUsers()
  const user = users.find((u) => u.email === email && u.password === password)

  if (!user) {
    return { success: false, message: "Invalid credentials" }
  }

  setCurrentUser(user)
  return { success: true, message: "Login successful", user }
}

export function logout(): void {
  setCurrentUser(null)
}

export function isAdmin(): boolean {
  const user = getCurrentUser()
  return user?.role === "admin"
}

// Initialize with default admin user
export function initializeAuth(): void {
  if (typeof window === "undefined") return

  const users = getUsers()
  if (users.length === 0) {
    register("admin@lelo.ge", "admin123", "Admin User", "admin")
  }
}
