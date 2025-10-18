// components/auth/login-form.tsx

"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import FormField from "@/components/ui/form-field"
import { login } from "@/lib/auth"
import { useAuth } from "./auth-provider" // **შესწორდა:** useAuth import-ის გზა
import { Loader2 } from "lucide-react"

interface LoginFormProps {
  onSuccess: () => void
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  // **შესწორდა:** setUser-ის ამოღება useAuth-დან
  const { setUser } = useAuth() 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const result = login(email, password)

    if (result.success && result.user) {
      // **შესწორდა:** გამოიყენება setUser-ი useAuth-დან
      setUser(result.user) 
      onSuccess()
    } else {
      setError(result.message || "შესვლა ვერ მოხერხდა")
    }
    
    setIsLoading(false)
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">შესვლა</CardTitle>
        <CardDescription>შეიყვანეთ თქვენი ელფოსტა და პაროლი ადმინ-პანელში შესასვლელად.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            type="email"
            label="Email"
            value={email}
            onChange={setEmail}
            required
            // disabled prop-ი არ გადაეცემა
          />
          <FormField
            type="password"
            label="Password"
            value={password}
            onChange={setPassword}
            required
            // disabled prop-ი არ გადაეცემა
          />
          
          {error && <p className="text-sm text-red-500">{error}</p>}
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
                <span className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                </span>
            ) : (
                "შესვლა"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}