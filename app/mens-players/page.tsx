"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { getAllPlayersFromStorage } from "@/lib/content-manager"
import type { PlayerCard } from "@/lib/types"
import PlayerCardComponent from "@/components/player-card"
import { useAuth } from "@/components/auth/auth-provider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import PlayerForm from "@/components/admin/player-form"
import { Plus, Loader2 } from "lucide-react"

export default function MensPlayersPage() {
  const [players, setPlayers] = useState<PlayerCard[]>([])
  // Removed coaches state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { isAdmin } = useAuth()

  useEffect(() => {
    loadPlayers()
  }, [])

  const loadPlayers = async () => {
    setIsLoading(true)
    const allPlayers = await getAllPlayersFromStorage()
    // Filter only for 'mens' team players
    setPlayers(allPlayers.filter((p) => p.team === "mens"))
    // Removed filtering for coaches
    setIsLoading(false)
  }

  // Removed scrollToSection as there's only one section now

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-red-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Men's Team</h1>
          {/* Removed scroll buttons */}
        </div>
      </div>

      <div className="container py-8">
        {/* Players Section */}
        <section id="players" className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Players</h2>
            {isAdmin && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Player
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Player</DialogTitle>
                  </DialogHeader>
                  <PlayerForm
                    onSuccess={() => {
                      setIsDialogOpen(false)
                      loadPlayers()
                    }}
                    defaultTeam="mens"
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {players.map((player) => (
              <PlayerCardComponent key={player.id} player={player} onUpdate={loadPlayers} />
            ))}
          </div>

          {players.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No players found for the men's team.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}