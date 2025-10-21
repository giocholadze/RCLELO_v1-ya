"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import FormField from "@/components/ui/form-field"
import { getAllMatchesFromStorage, createMatch, updateMatch, deleteMatch, uploadImage } from "@/lib/content-manager"
import type { MatchFixture, LeagueCategory } from "@/lib/types"
import { Pencil, Trash2, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


interface MatchFixtureWithLogos extends MatchFixture {
  homeTeamLogo?: string
  awayTeamLogo?: string
}

// This type defines the shape of our form data, allowing logos to be a File, a string URL, or null
type MatchFormData = {
  homeTeam: string
  awayTeam: string
  homeTeamLogo: File | string | null
  awayTeamLogo: File | string | null
  matchDate: string
  venue: string
  matchType: LeagueCategory
  status: "scheduled" | "live" | "finished" | string
}

const categoryOptions: { value: LeagueCategory; label: string }[] = [
    { value: "უმაღლესი", label: "უმაღლესი (Men's)" },
    { value: "ესპუართა", label: "ესპუართა (Men's)" },
    { value: "ლიგა 'ა'", label: "ლიგა 'ა' (Youth)" },
    { value: "ლიგა 'ბ'", label: "ლიგა 'ბ' (Youth)" },
    { value: "საფესტივალო", label: "საფესტივალო (Youth)" },
]

export default function MatchManager() {
  const [matches, setMatches] = useState<MatchFixtureWithLogos[]>([])
  const [editingMatch, setEditingMatch] = useState<MatchFixtureWithLogos | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    const allMatches = await getAllMatchesFromStorage()
    setMatches(allMatches)
  }

  // The 'any' type here correctly handles the mixed data (File/string) from the form
  const handleCreate = async (matchData: any) => {
    if (matchData.homeTeamLogo instanceof File) {
      matchData.homeTeamLogo = await uploadImage(matchData.homeTeamLogo)
    }
    if (matchData.awayTeamLogo instanceof File) {
      matchData.awayTeamLogo = await uploadImage(matchData.awayTeamLogo)
    }
    await createMatch(matchData)
    await loadMatches()
    setIsDialogOpen(false)
  }

  const handleUpdate = async (id: number, updates: any) => {
    if (updates.homeTeamLogo instanceof File) {
      updates.homeTeamLogo = await uploadImage(updates.homeTeamLogo)
    }
    if (updates.awayTeamLogo instanceof File) {
      updates.awayTeamLogo = await uploadImage(updates.awayTeamLogo)
    }
    await updateMatch(id, updates)
    await loadMatches()
    setEditingMatch(null)
    setIsDialogOpen(false)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this match?")) {
      await deleteMatch(id)
      await loadMatches()
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
                onCreate={handleCreate}
                onUpdate={(data) => handleUpdate(editingMatch!.id, data)}
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
                <div className="flex-1 flex items-center gap-4">
                   <img
                    src={match.homeTeamLogo || "/images/placeholder-logo.svg"}
                    alt={`${match.homeTeam} Logo`}
                    className="h-10 w-10 object-contain"
                    onError={(e) => (e.currentTarget.src = "/images/placeholder-logo.svg")}
                  />
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
                  <img
                    src={match.awayTeamLogo || "/images/placeholder-logo.svg"}
                    alt={`${match.awayTeam} Logo`}
                    className="h-10 w-10 object-contain"
                    onError={(e) => (e.currentTarget.src = "/images/placeholder-logo.svg")}
                  />
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
  onCreate,
  onUpdate,
}: {
  match: MatchFixtureWithLogos | null
  // THIS IS THE FIX: The props now accept 'any' to allow the form data (with Files)
  // to be passed up to the handler functions without a type conflict.
  onCreate: (data: any) => void
  onUpdate: (data: any) => void
}) {
  const [formData, setFormData] = useState<MatchFormData>({
    homeTeam: match?.homeTeam || "",
    awayTeam: match?.awayTeam || "",
    homeTeamLogo: match?.homeTeamLogo || null,
    awayTeamLogo: match?.awayTeamLogo || null,
    matchDate: match?.matchDate ? new Date(match.matchDate).toISOString().slice(0, 16) : "",
    venue: match?.venue || "",
    matchType: match?.matchType || "უმაღლესი",
    status: match?.status || "scheduled",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // The dataToSubmit object is created with mixed types (File/string)
    const dataToSubmit = {
      ...formData,
      matchDate: new Date(formData.matchDate).toISOString(),
      matchType: formData.matchType as LeagueCategory,
      status: formData.status as "scheduled" | "live" | "finished",
    }

    // It's then passed to the parent handlers which are equipped to deal with it
    if (match) {
        onUpdate(dataToSubmit)
    } else {
        onCreate(dataToSubmit)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, team: 'home' | 'away') => {
      if(e.target.files?.[0]) {
          const file = e.target.files[0];
          if(team === 'home') {
              setFormData({...formData, homeTeamLogo: file });
          } else {
              setFormData({...formData, awayTeamLogo: file });
          }
      }
  }

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
            <Label>Home Team</Label>
            <Input
                value={formData.homeTeam}
                onChange={(e) => updateField("homeTeam", e.target.value)}
                required
            />
        </div>
        <div>
            <Label>Away Team</Label>
            <Input
                value={formData.awayTeam}
                onChange={(e) => updateField("awayTeam", e.target.value)}
                required
            />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Home Team Logo</Label>
          <Input
            type="file"
            onChange={(e) => handleFileChange(e, 'home')}
            accept="image/*"
          />
        </div>
        <div>
          <Label>Away Team Logo</Label>
          <Input
            type="file"
            onChange={(e) => handleFileChange(e, 'away')}
            accept="image/*"
          />
        </div>
      </div>
      <div>
            <Label>Match Date & Time</Label>
            <Input
                type="datetime-local"
                value={formData.matchDate}
                onChange={(e) => updateField("matchDate", e.target.value)}
                required
            />
      </div>
      <div>
            <Label>Venue</Label>
            <Input
                value={formData.venue}
                onChange={(e) => updateField("venue", e.target.value)}
                required
            />
      </div>
      <FormField
        type="select"
        label="Match Type"
        value={formData.matchType}
        onChange={(value) => updateField("matchType", value)}
        options={categoryOptions}
        required
      />
        <div>
            <Label>Status</Label>
            <Input
                value={formData.status}
                onChange={(e) => updateField("status", e.target.value)}
            />
        </div>
      <Button type="submit" className="w-full">
        {match ? "Update" : "Create"} Match
      </Button>
    </form>
  )
}