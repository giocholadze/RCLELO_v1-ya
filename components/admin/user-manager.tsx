"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCurrentUser } from "@/lib/auth"
import type { User } from "@/lib/auth" // Corrected import path
import { Trash2 } from "lucide-react"

export default function UserManager() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Load the current user from localStorage
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }, [])

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>User Manager</CardTitle>
          {/* Add User functionality is removed as we only have one static admin */}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {user ? (
            <div key={user.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <p>No user is currently logged in.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}