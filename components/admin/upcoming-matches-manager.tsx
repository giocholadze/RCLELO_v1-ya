"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getAllMatchesFromStorage, createMatch, updateMatch, deleteMatch, uploadImage } from "@/lib/content-manager"
import type { MatchFixture, LeagueCategory } from "@/lib/types"
import { Pencil, Trash2, Plus, Calendar } from "lucide-react"
import FormField from "@/components/ui/form-field"

// This interface extends the base MatchFixture to be used in the component's state
interface MatchFixtureWithLogos extends MatchFixture {
  homeTeamLogo?: string
  awayTeamLogo?: string
}

// FIX 1: Create a dedicated type for the form state.
// This tells TypeScript that the logo fields can be a string (URL), a File, or null.
type MatchFormData = {
    homeTeam: string
    awayTeam: string
    homeTeamLogo: File | string | null
    awayTeamLogo: File | string | null
    matchDate: string
    venue: string
    matchType: LeagueCategory
    status: "scheduled" | "live" | "finished" | string;
};


const categoryOptions: { value: LeagueCategory; label:string }[] = [
    { value: "უმაღლესი", label: "უმაღლესი (Men's)" },
    { value: "ესპუართა", label: "ესპუართა (Men's)" },
    { value: "ლიგა 'ა'", label: "ლიგა 'ა' (Youth)" },
    { value: "ლიგა 'ბ'", label: "ლიგა 'ბ' (Youth)" },
    { value: "საფესტივალო", label: "საფესტივალო (Youth)" },
]

export default function UpcomingMatchesManager() {
  const [matches, setMatches] = useState<MatchFixtureWithLogos[]>([])
  const [editingMatch, setEditingMatch] = useState<MatchFixtureWithLogos | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    const allMatches = await getAllMatchesFromStorage()
    const upcoming = allMatches.filter((match: MatchFixture) => new Date(match.matchDate) >= new Date())
    setMatches(upcoming)
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

  const handleDelete = async (id: number, teams: string) => {
    if (confirm(`დარწმუნებული ხართ, რომ გსურთ ${teams} მატჩის წაშლა?`)) {
      await deleteMatch(id)
      await loadMatches()
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-red-500" />
            მომავალი მატჩების მართვა
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingMatch(null)}>
                <Plus className="h-4 w-4 mr-2" />
                მატჩის დამატება
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingMatch ? "მატჩის რედაქტირება" : "ახალი მატჩის დამატება"}</DialogTitle>
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
                    <h3 className="font-semibold text-lg">
                      {match.homeTeam} vs {match.awayTeam}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
                      <span>თარიღი: {new Date(match.matchDate).toLocaleDateString("ka-GE")}</span>
                      <span>
                        დრო:{" "}
                        {new Date(match.matchDate).toLocaleTimeString("ka-GE", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span>ადგილი: {match.venue}</span>
                      <span>ტიპი: {match.matchType}</span>
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
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(match.id, `${match.homeTeam} vs ${match.awayTeam}`)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {matches.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">მომავალი მატჩები ვერ მოიძებნა.</p>
            </div>
          )}
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
  // FIX 2: The props now accept 'any' to allow the form data (with Files)
  // to be passed up to the handler functions without a type conflict.
  onCreate: (data: any) => void
  onUpdate: (data: any) => void
}) {
  // FIX 3: Apply the new MatchFormData type to the component's state.
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
    const dataToSubmit = {
      ...formData,
      matchDate: new Date(formData.matchDate).toISOString(),
      matchType: formData.matchType as LeagueCategory,
      status: formData.status as "scheduled" | "live" | "finished",
    }

    if (match) {
      onUpdate(dataToSubmit)
    } else {
      // FIX 4: The destructuring is unnecessary here.
      onCreate(dataToSubmit)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, team: 'home' | 'away') => {
      if(e.target.files?.[0]) {
          const file = e.target.files[0];
          if(team === 'home') {
              // This is now valid because MatchFormData allows a File type.
              setFormData({...formData, homeTeamLogo: file });
          } else {
              setFormData({...formData, awayTeamLogo: file });
          }
      }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>სახლის გუნდი</Label>
          <Input
            value={formData.homeTeam}
            onChange={(e) => setFormData({ ...formData, homeTeam: e.target.value })}
            required
            placeholder="მაგ: ლელო"
          />
        </div>
        <div>
          <Label>სტუმარი გუნდი</Label>
          <Input
            value={formData.awayTeam}
            onChange={(e) => setFormData({ ...formData, awayTeam: e.target.value })}
            required
            placeholder="მაგ: აია"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>სახლის გუნდის ლოგო</Label>
          <Input
            type="file"
            onChange={(e) => handleFileChange(e, 'home')}
            accept="image/*"
          />
        </div>
        <div>
          <Label>სტუმარი გუნდის ლოგო</Label>
          <Input
            type="file"
            onChange={(e) => handleFileChange(e, 'away')}
            accept="image/*"
          />
        </div>
      </div>
      <div>
        <Label>თარიღი და დრო</Label>
        <Input
          type="datetime-local"
          value={formData.matchDate}
          onChange={(e) => setFormData({ ...formData, matchDate: e.target.value })}
          required
        />
      </div>
      <div>
        <Label>ადგილი</Label>
        <Input
          value={formData.venue}
          onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
          required
          placeholder="მაგ: ავჭალის სტადიონი"
        />
      </div>
      <FormField
        type="select"
        label="მატჩის ტიპი"
        value={formData.matchType}
        onChange={(value) => setFormData({ ...formData, matchType: value as LeagueCategory })}
        options={categoryOptions}
        required
      />
      <Button type="submit" className="w-full">
        {match ? "მატჩის განახლება" : "მატჩის შექმნა"}
      </Button>
    </form>
  )
}