"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import FormField from "@/components/ui/form-field"
import { createPlayer, updatePlayer } from "@/lib/content-manager"
import type { PlayerCard } from "@/lib/types"

interface PlayerFormProps {
  player?: PlayerCard
  onSuccess: () => void
  defaultTeam?: "mens" | "youth" | "womens" | "coaches"
}

// *** FIX: Moved this helper function outside the component ***
// This makes it available before the component renders, solving the error.
const getCategoryFromTeam = (team: PlayerCard['team']): PlayerCard["category"] => {
    switch (team) {
      case "mens": return "Men's Rugby"
      case "womens": return "Women's Rugby"
      case "youth": return "Youth Rugby"
      case "coaches": return "Coaches"
      default: return "Men's Rugby"
    }
}

export default function PlayerForm({ player, onSuccess, defaultTeam = "mens" }: PlayerFormProps) {
  // Now this line can safely call the function during initialization
  const [formData, setFormData] = useState({
    name: player?.name || "",
    position: player?.position || "",
    age: player?.age,
    height: player?.height || "",
    weight: player?.weight || "",
    nationality: player?.nationality || "Georgian",
    imageUrl: player?.imageUrl || "",
    team: player?.team || defaultTeam,
    category: player?.category || getCategoryFromTeam(player?.team || defaultTeam),
    isActive: player?.isActive ?? true,
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const currentTeam = player?.team || defaultTeam;
    setFormData({
      name: player?.name || "",
      position: player?.position || "",
      age: player?.age,
      height: player?.height || "",
      weight: player?.weight || "",
      nationality: player?.nationality || "Georgian",
      imageUrl: player?.imageUrl || "",
      team: currentTeam,
      category: player?.category || getCategoryFromTeam(currentTeam),
      isActive: player?.isActive ?? true,
    })
  }, [player, defaultTeam])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const newErrors: { [key: string]: string } = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.position.trim()) newErrors.position = "Position is required"
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    const playerData = {
      ...formData,
      age: formData.age ? Number(formData.age) : undefined,
      category: getCategoryFromTeam(formData.team),
    }

    try {
      if (player) {
        await updatePlayer(player.id, playerData)
      } else {
        await createPlayer(playerData)
      }
      onSuccess()
    } catch (error) {
      console.error("Failed to save player:", error)
      setErrors({ form: "Failed to save player. Please try again."})
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto p-1">
        {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}
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
            value={formData.age ?? ''} 
            onChange={(value) => updateField("age", value ? Number.parseInt(value) : undefined)}
            error={errors.age}
          />
          <FormField
            type="text"
            label="Height"
            value={formData.height}
            onChange={(value) => updateField("height", value)}
            placeholder="e.g., 180cm"
          />
          <FormField
            type="text"
            label="Weight"
            value={formData.weight}
            onChange={(value) => updateField("weight", value)}
            placeholder="e.g., 85kg"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            type="text"
            label="Nationality"
            value={formData.nationality}
            onChange={(value) => updateField("nationality", value)}
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
          />
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Image</h3>
        <FormField
          type="image"
          label="Player Photo"
          value={formData.imageUrl}
          onChange={(value) => updateField("imageUrl", value)}
          category="players"
          placeholder="Upload player photo"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : (player ? "Update Player" : "Create Player")}
      </Button>
    </form>
  )
}