"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import LoginForm from "@/components/auth/login-form"
import RegisterForm from "@/components/auth/register-form"
import { useAuth } from "@/components/auth/auth-provider"
import { logout } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const { user, refreshUser } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    refreshUser()
    router.push("/")
  }

  if (user) {
    return (
      <div className="container py-8">
        <div className="max-w-md mx-auto text-center space-y-4">
          <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
          <p className="text-muted-foreground">You are logged in as {user.role}</p>
          <div className="space-y-2">
            {user.role === "admin" && (
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

  return (
    <div className="container py-8">
      <div className="max-w-md mx-auto">
        <Tabs defaultValue="login" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm onSuccess={() => router.push("/")} />
          </TabsContent>

          <TabsContent value="register">
            <RegisterForm onSuccess={() => router.push("/auth")} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
