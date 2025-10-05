"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import FormField from "@/components/ui/form-field"
import { getAllMatchesFromStorage, createMatch, updateMatch, deleteMatch } from "@/lib/content-manager"
import type { MatchFixture } from "@/lib/types"
import { Pencil, Trash2, Plus } from "lucide-react"

export default function MatchManager() {
  const [matches, setMatches] = useState<MatchFixture[]>([])
  const [editingMatch, setEditingMatch] = useState<MatchFixture | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = () => {
    const allMatches = getAllMatchesFromStorage()
    setMatches(allMatches)
  }

  const handleCreate = (matchData: Omit<MatchFixture, "id">) => {
    createMatch(matchData)
    loadMatches()
    setIsDialogOpen(false)
  }

  const handleUpdate = (id: number, updates: Partial<MatchFixture>) => {
    updateMatch(id, updates)
    loadMatches()
    setEditingMatch(null)
    setIsDialogOpen(false)
  }

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this match?")) {
      deleteMatch(id)
      loadMatches()
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Match Manager</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingMatch(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Match
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingMatch ? "Edit Match" : "Create Match"}</DialogTitle>
              </DialogHeader>
              <MatchForm
                match={editingMatch}
                onSubmit={editingMatch ? (data) => handleUpdate(editingMatch.id, data) : handleCreate}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {matches.map((match) => (
            <div key={match.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold">
                    {match.homeTeam} vs {match.awayTeam}
                  </h3>
                  <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                    <span>Date: {new Date(match.matchDate).toLocaleDateString()}</span>
                    <span>Venue: {match.venue}</span>
                    <span>Type: {match.matchType}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingMatch(match)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(match.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function MatchForm({
  match,
  onSubmit,
}: {
  match: MatchFixture | null
  onSubmit: (data: Omit<MatchFixture, "id">) => void
}) {
  const [formData, setFormData] = useState({
    homeTeam: match?.homeTeam || "",
    awayTeam: match?.awayTeam || "",
    matchDate: match?.matchDate ? new Date(match.matchDate).toISOString().slice(0, 16) : "",
    venue: match?.venue || "",
    matchType: match?.matchType || "",
    status: match?.status || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      matchDate: new Date(formData.matchDate).toISOString(),
    })
  }

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          type="text"
          label="Home Team"
          value={formData.homeTeam}
          onChange={(value) => updateField("homeTeam", value)}
          required
        />

        <FormField
          type="text"
          label="Away Team"
          value={formData.awayTeam}
          onChange={(value) => updateField("awayTeam", value)}
          required
        />
      </div>

      <FormField
        type="text"
        label="Match Date & Time"
        value={formData.matchDate}
        onChange={(value) => updateField("matchDate", value)}
        required
      />

      <FormField
        type="text"
        label="Venue"
        value={formData.venue}
        onChange={(value) => updateField("venue", value)}
        required
      />

      <FormField
        type="text"
        label="Match Type"
        value={formData.matchType}
        onChange={(value) => updateField("matchType", value)}
        required
      />

      <FormField
        type="text"
        label="Status"
        value={formData.status}
        onChange={(value) => updateField("status", value)}
      />

      <Button type="submit" className="w-full">
        {match ? "Update" : "Create"} Match
      </Button>
    </form>
  )
}
