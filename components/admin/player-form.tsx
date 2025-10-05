"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import FormField from "@/components/ui/form-field"
import { createPlayer, updatePlayer } from "@/lib/content-manager"
import type { PlayerCard } from "@/lib/types"

interface PlayerFormProps {
  player?: PlayerCard
  onSuccess: () => void
  defaultTeam?: "mens" | "youth" | "womens" | "coaches"
}

export default function PlayerForm({ player, onSuccess, defaultTeam = "mens" }: PlayerFormProps) {
  const [formData, setFormData] = useState({
    name: player?.name || "",
    position: player?.position || "",
    age: player?.age || 20,
    height: player?.height || "",
    weight: player?.weight || "",
    nationality: player?.nationality || "Georgian",
    imageUrl: player?.imageUrl || "",
    biography: player?.biography || "",
    team: player?.team || defaultTeam,
    category: player?.category || ("Men's Rugby" as const),
    sponsorName: player?.sponsorName || "",
    sponsorLogo: player?.sponsorLogo || "",
    isActive: player?.isActive ?? true,
    stats: {
      matches: player?.stats.matches || 0,
      tries: player?.stats.tries || 0,
      points: player?.stats.points || 0,
      yellowCards: player?.stats.yellowCards || 0,
      redCards: player?.stats.redCards || 0,
    },
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const newErrors: { [key: string]: string } = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.position.trim()) newErrors.position = "Position is required"
    if (formData.age < 1 || formData.age > 100) newErrors.age = "Age must be between 1 and 100"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const playerData = {
      ...formData,
      category: getCategoryFromTeam(formData.team),
    }

    if (player) {
      updatePlayer(player.id, playerData)
    } else {
      createPlayer(playerData)
    }

    onSuccess()
  }

  const getCategoryFromTeam = (team: string): PlayerCard["category"] => {
    switch (team) {
      case "mens":
        return "Men's Rugby"
      case "womens":
        return "Women's Rugby"
      case "youth":
        return "Youth Rugby"
      case "coaches":
        return "Coaches"
      default:
        return "Men's Rugby"
    }
  }

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const updateStat = (stat: string, value: number) => {
    setFormData({
      ...formData,
      stats: { ...formData.stats, [stat]: value },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            type="text"
            label="Name"
            value={formData.name}
            onChange={(value) => updateField("name", value)}
            required
            error={errors.name}
          />

          <FormField
            type="text"
            label="Position"
            value={formData.position}
            onChange={(value) => updateField("position", value)}
            required
            error={errors.position}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            type="number"
            label="Age"
            value={formData.age}
            onChange={(value) => updateField("age", Number.parseInt(value) || 0)}
            required
            error={errors.age}
          />

          <FormField
            type="text"
            label="Height"
            value={formData.height}
            onChange={(value) => updateField("height", value)}
            placeholder="e.g., 180cm"
            required
          />

          <FormField
            type="text"
            label="Weight"
            value={formData.weight}
            onChange={(value) => updateField("weight", value)}
            placeholder="e.g., 85kg"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            type="text"
            label="Nationality"
            value={formData.nationality}
            onChange={(value) => updateField("nationality", value)}
            required
          />

          <FormField
            type="select"
            label="Team"
            value={formData.team}
            onChange={(value) => updateField("team", value)}
            options={[
              { value: "mens", label: "Men's Team" },
              { value: "womens", label: "Women's Team" },
              { value: "youth", label: "Youth Team" },
              { value: "coaches", label: "Coaches" },
            ]}
            required
          />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Images</h3>

        <FormField
          type="image"
          label="Player Photo"
          value={formData.imageUrl}
          onChange={(value) => updateField("imageUrl", value)}
          category="players"
          placeholder="Upload player photo"
        />
      </div>

      {/* Sponsor Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sponsor Information</h3>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            type="text"
            label="Sponsor Name"
            value={formData.sponsorName}
            onChange={(value) => updateField("sponsorName", value)}
            placeholder="Enter sponsor name"
          />

          <FormField
            type="image"
            label="Sponsor Logo"
            value={formData.sponsorLogo}
            onChange={(value) => updateField("sponsorLogo", value)}
            category="sponsors"
            placeholder="Upload sponsor logo"
          />
        </div>
      </div>

      {/* Biography */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Biography</h3>

        <FormField
          type="textarea"
          label="Biography"
          value={formData.biography}
          onChange={(value) => updateField("biography", value)}
          rows={4}
          placeholder="Enter player biography"
        />
      </div>

      {/* Statistics */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Statistics</h3>

        <div className="grid grid-cols-5 gap-2">
          <FormField
            type="number"
            label="Matches"
            value={formData.stats.matches}
            onChange={(value) => updateStat("matches", Number.parseInt(value) || 0)}
          />

          <FormField
            type="number"
            label="Tries"
            value={formData.stats.tries}
            onChange={(value) => updateStat("tries", Number.parseInt(value) || 0)}
          />

          <FormField
            type="number"
            label="Points"
            value={formData.stats.points}
            onChange={(value) => updateStat("points", Number.parseInt(value) || 0)}
          />

          <FormField
            type="number"
            label="Yellow Cards"
            value={formData.stats.yellowCards}
            onChange={(value) => updateStat("yellowCards", Number.parseInt(value) || 0)}
          />

          <FormField
            type="number"
            label="Red Cards"
            value={formData.stats.redCards}
            onChange={(value) => updateStat("redCards", Number.parseInt(value) || 0)}
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        {player ? "Update" : "Create"} Player
      </Button>
    </form>
  )
}
