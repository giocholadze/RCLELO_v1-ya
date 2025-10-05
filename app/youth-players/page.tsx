"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { getAllPlayersFromStorage } from "@/lib/content-manager"
import type { PlayerCard } from "@/lib/types"
import PlayerCardComponent from "@/components/player-card"
import { useAuth } from "@/components/auth/auth-provider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import PlayerForm from "@/components/admin/player-form"
import { Plus } from "lucide-react"

export default function YouthPlayersPage() {
  const [players, setPlayers] = useState<PlayerCard[]>([])
  const [coaches, setCoaches] = useState<PlayerCard[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { isAdmin } = useAuth()

  useEffect(() => {
    loadPlayers()
  }, [])

  const loadPlayers = () => {
    const allPlayers = getAllPlayersFromStorage()
    setPlayers(allPlayers.filter((p) => p.team === "youth"))
    setCoaches(allPlayers.filter((p) => p.team === "coaches"))
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Youth Team</h1>
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              onClick={() => scrollToSection("players")}
            >
              Players
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              onClick={() => scrollToSection("coaches")}
            >
              Coaches
            </Button>
          </div>
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
                    defaultTeam="youth"
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
              <p className="text-muted-foreground">No players found. Add some players to get started.</p>
            </div>
          )}
        </section>

        {/* Coaches Section */}
        <section id="coaches">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Coaches</h2>
            {isAdmin && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Coach
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Coach</DialogTitle>
                  </DialogHeader>
                  <PlayerForm onSuccess={loadPlayers} defaultTeam="coaches" />
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {coaches.map((coach) => (
              <PlayerCardComponent key={coach.id} player={coach} onUpdate={loadPlayers} />
            ))}
          </div>

          {coaches.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No coaches found. Add some coaches to get started.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
