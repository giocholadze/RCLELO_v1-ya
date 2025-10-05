"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Pencil, Plus } from "lucide-react"
import type { PlayerCard } from "@/lib/types"
import { useAuth } from "@/components/auth/auth-provider"
import { deletePlayer } from "@/lib/content-manager"
import PlayerForm from "@/components/admin/player-form"

interface PlayerCardProps {
  player: PlayerCard
  onUpdate: () => void
}

export default function PlayerCardComponent({ player, onUpdate }: PlayerCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const { isAdmin } = useAuth()

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${player.name}?`)) {
      deletePlayer(player.id)
      onUpdate()
    }
  }

  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 bg-gray-100 dark:bg-gray-800">
      {/* Admin Controls */}
      {isAdmin && (
        <div className="absolute top-2 right-2 z-10">
          <Button
            variant="destructive"
            size="sm"
            className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600"
            onClick={handleDelete}
          >
            <Plus className="h-4 w-4 rotate-45" />
          </Button>
        </div>
      )}

      {/* Player Image */}
      <div className="relative h-64 bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <img
          src={player.imageUrl || "/placeholder.svg?height=300&width=250"}
          alt={player.name}
          className="w-full h-full object-cover"
        />
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Player Name */}
        <h3 className="font-bold text-lg uppercase tracking-wide text-gray-900 dark:text-gray-100">{player.name}</h3>

        {/* Position */}
        <p className="text-sm text-gray-600 dark:text-gray-400">Position: {player.position}</p>

        {/* Sponsor Section */}
        {player.sponsorName && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Player Sponsor:
            </p>
            <div className="flex items-center space-x-2">
              {player.sponsorLogo && (
                <img src={player.sponsorLogo || "/placeholder.svg"} alt={player.sponsorName} className="h-6 w-auto" />
              )}
              <span className="text-xs text-gray-600 dark:text-gray-400">{player.sponsorName}</span>
            </div>
          </div>
        )}

        {/* Category Badge */}
        <div className="pt-2">
          <Badge
            variant="secondary"
            className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs px-3 py-1 rounded-full"
          >
            {player.category}
          </Badge>
        </div>

        {/* Admin Edit Button */}
        {isAdmin && (
          <div className="pt-2">
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit {player.name}</DialogTitle>
                </DialogHeader>
                <PlayerForm
                  player={player}
                  onSuccess={() => {
                    setIsEditDialogOpen(false)
                    onUpdate()
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
