"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Pencil, Check, X } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { getContentValue, updateContent } from "@/lib/content-manager"

interface EditableTextProps {
  contentKey: string
  defaultValue: string
  type?: "text" | "textarea" | "number"
  className?: string
  as?: "h1" | "h2" | "h3" | "p" | "span"
}

export default function EditableText({
  contentKey,
  defaultValue,
  type = "text",
  className = "",
  as: Component = "span",
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(defaultValue) // Start with default
  const [tempValue, setTempValue] = useState(defaultValue)
  const { isAdmin } = useAuth()

  // *** FIX: Correctly fetch async data in useEffect ***
  useEffect(() => {
    const fetchContent = async () => {
      const contentValue = await getContentValue(contentKey, defaultValue)
      setValue(contentValue)
      setTempValue(contentValue)
    }
    fetchContent()
  }, [contentKey, defaultValue])

  const handleSave = async () => {
    await updateContent(contentKey, tempValue)
    setValue(tempValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempValue(value)
    setIsEditing(false)
  }

  if (!isAdmin) {
    return <Component className={className}>{value}</Component>
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        {type === "textarea" ? (
          <Textarea value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="flex-1" />
        ) : (
          <Input value={tempValue} onChange={(e) => setTempValue(e.target.value)} type={type} className="flex-1" />
        )}
        <Button size="sm" onClick={handleSave}>
          <Check className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={handleCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="group relative inline-block">
      <Component className={className}>{value}</Component>
      <Button
        size="sm"
        variant="ghost"
        className="absolute -top-1 -right-8 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => setIsEditing(true)}
      >
        <Pencil className="h-3 w-3" />
      </Button>
    </div>
  )
}