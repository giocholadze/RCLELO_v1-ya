"use client"
import { useRouter } from "next/navigation"
import LoginForm from "@/components/auth/login-form"

export default function AuthPage() {
  const router = useRouter()

  const handleLoginSuccess = () => {
    router.push("/admin")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <LoginForm onSuccess={handleLoginSuccess} />
      </div>
    </div>
  )
}
