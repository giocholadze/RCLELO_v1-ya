"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getAllPlayersFromStorage, deletePlayer } from "@/lib/content-manager"
import type { PlayerCard } from "@/lib/types"
import { Pencil, Trash2, Plus } from "lucide-react"
import PlayerForm from "./player-form"

export default function PlayerManager() {
  const [players, setPlayers] = useState<PlayerCard[]>([])
  const [editingPlayer, setEditingPlayer] = useState<PlayerCard | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    loadPlayers()
  }, [])

  const loadPlayers = async () => {
    const allPlayers = await getAllPlayersFromStorage()
    setPlayers(allPlayers)
  }

  const handleDelete = async (id: number, name: string) => {
    // NOTE: window.confirm() can be disruptive. Consider a custom modal for a better UX.
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      await deletePlayer(id)
      await loadPlayers()
    }
  }

  const filteredPlayers = players.filter((player) => {
    if (filter === "all") return true
    return player.team === filter
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <CardTitle>Player Manager</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingPlayer(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Player
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingPlayer ? "Edit Player" : "Add New Player"}</DialogTitle>
              </DialogHeader>
              <PlayerForm
                player={editingPlayer || undefined}
                onSuccess={() => {
                  setIsDialogOpen(false)
                  setEditingPlayer(null)
                  loadPlayers()
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
            All ({players.length})
          </Button>
          <Button variant={filter === "mens" ? "default" : "outline"} size="sm" onClick={() => setFilter("mens")}>
            Men's ({players.filter((p) => p.team === "mens").length})
          </Button>
          <Button variant={filter === "womens" ? "default" : "outline"} size="sm" onClick={() => setFilter("womens")}>
            Women's ({players.filter((p) => p.team === "womens").length})
          </Button>
          <Button variant={filter === "youth" ? "default" : "outline"} size="sm" onClick={() => setFilter("youth")}>
            Youth ({players.filter((p) => p.team === "youth").length})
          </Button>
           <Button variant={filter === "coaches" ? "default" : "outline"} size="sm" onClick={() => setFilter("coaches")}>
             Coaches ({players.filter((p) => p.team === "coaches").length})
           </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredPlayers.map((player) => (
            <div key={player.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <img
                    src={player.imageUrl || "/placeholder.svg?height=80&width=80"}
                    alt={player.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{player.name}</h3>
                    <p className="text-sm text-muted-foreground">{player.position}</p>
                    <div className="flex gap-2 mt-2">
                      {player.category && <Badge variant="secondary">{player.category}</Badge>}
                      {player.isActive !== undefined && (
                        <Badge variant={player.isActive ? "default" : "destructive"}>
                          {player.isActive ? "Active" : "Inactive"}
                        </Badge>
                      )}
                    </div>
                    {/* *** FIX STARTS HERE *** */}
                    {/* Display optional fields only if they exist */}
                    <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                      {player.age && <span>Age: {player.age}</span>}
                      {player.height && <span>Height: {player.height}</span>}
                      {player.weight && <span>Weight: {player.weight}</span>}
                    </div>
                    {/* *** FIX ENDS HERE *** */}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingPlayer(player)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(player.id, player.name)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {filteredPlayers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No players found for the selected filter.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}