"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getAllMatchesFromStorage, createMatch, updateMatch, deleteMatch } from "@/lib/content-manager"
import type { MatchFixture } from "@/lib/types"
import { Pencil, Trash2, Plus, Calendar } from "lucide-react"

export default function UpcomingMatchesManager() {
  const [matches, setMatches] = useState<MatchFixture[]>([])
  const [editingMatch, setEditingMatch] = useState<MatchFixture | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    const allMatches = await getAllMatchesFromStorage()
    // Filter for upcoming matches only
    const upcomingMatches = allMatches.filter((match: MatchFixture) => new Date(match.matchDate) > new Date())
    setMatches(upcomingMatches)
  }

  const handleCreate = async (matchData: Omit<MatchFixture, "id">) => {
    await createMatch(matchData)
    await loadMatches()
    setIsDialogOpen(false)
  }

  const handleUpdate = async (id: number, updates: Partial<MatchFixture>) => {
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
                  <h3 className="font-semibold text-lg">
                    {match.homeTeam} vs {match.awayTeam}
                  </h3>
                  <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                    <span>თარიღი: {new Date(match.matchDate).toLocaleDateString("ka-GE")}</span>
                    <span>
                      დრო:{" "}
                      {new Date(match.matchDate).toLocaleTimeString("ka-GE", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span>ადგილი: {match.venue}</span>
                    <span>ტიპი: {match.matchType}</span>
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
    status: match?.status || "scheduled",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      matchDate: new Date(formData.matchDate).toISOString(),
    })
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
       {/* You were missing the rest of the form, I've added it back */}
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
      <div>
        <Label>მატჩის ტიპი</Label>
        <Input
          value={formData.matchType}
          onChange={(e) => setFormData({ ...formData, matchType: e.target.value })}
          required
          placeholder="მაგ: დიდი 10"
        />
      </div>
      <Button type="submit" className="w-full">
        {match ? "მატჩის განახლება" : "მატჩის შექმნა"}
      </Button>
    </form>
  )
}