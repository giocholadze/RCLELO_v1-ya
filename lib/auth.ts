export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
}

const ADMIN_CREDENTIALS = {
  email: "officelelo1@gmail.com",
  password: "Saracens.lelo1",
  user: {
    id: "admin-1",
    email: "officelelo1@gmail.com",
    name: "Admin",
    role: "admin" as const,
  },
}

export function login(email: string, password: string): { success: boolean; user?: User; message?: string } {
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(ADMIN_CREDENTIALS.user))
    }
    return { success: true, user: ADMIN_CREDENTIALS.user }
  }
  return { success: false, message: "არასწორი ელფოსტა ან პაროლი" }
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user")
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") {
    return null
  }
  const userStr = localStorage.getItem("user")
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}
