"use client"

import { Button } from "@/components/ui/button"
import LoginForm from "@/components/auth/login-form"
import { useAuth } from "@/components/auth/auth-provider"
import { logout } from "@/lib/auth" // This now correctly calls Supabase's signOut
import { useRouter } from "next/navigation"

export default function AuthPage() {
  // 1. FIX: Removed 'refreshUser' as it's no longer needed
  const { user } = useAuth()
  const router = useRouter()

  // 2. FIX: Made the logout function async
  const handleLogout = async () => {
    await logout()
    // The AuthProvider will automatically detect the logout and update the state.
    // We can then redirect the user.
    router.push("/") 
  }

  // If a user is logged in, show the "Welcome" message and logout button
  if (user) {
    return (
      <div className="container py-8">
        <div className="max-w-md mx-auto text-center space-y-4">
          {/* 3. FIX: Display user's email, which is always available */}
          <h1 className="text-2xl font-bold">Welcome, {user.email}!</h1>
          <p className="text-muted-foreground">You are logged in.</p>
          <div className="space-y-2">
            {user.email === 'officelelo1@gmail.com' && (
              <Button onClick={() => router.push("/admin")} className="w-full">
                Go to Admin Panel
              </Button>
            )}
            <Button variant="outline" onClick={handleLogout} className="w-full">
              Logout
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // If no user is logged in, show the login form
  return (
    <div className="container py-8">
      <div className="max-w-md mx-auto">
        {/* 4. FIX: Removed unnecessary Tabs and the 'onSuccess' prop */}
        <LoginForm />
      </div>
    </div>
  )
}