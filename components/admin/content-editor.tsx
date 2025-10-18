"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import type { EditableContent } from "@/lib/types"
import { getEditableContent, saveEditableContent, deleteContentItem } from "@/lib/content-manager" 
import { Loader2, Save } from "lucide-react" 

export default function ContentEditor() {
  const [content, setContent] = useState<EditableContent[]>([])
  const [originalContent, setOriginalContent] = useState<EditableContent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const loadContent = async () => {
    setIsLoading(true)
    const editableContent = await getEditableContent()
    setContent(editableContent)
    setOriginalContent(editableContent)
    setIsLoading(false)
  }

  useEffect(() => {
    loadContent()
  }, [])

  const handleLocalUpdate = (id: string, field: keyof EditableContent, value: any) => {
    setContent(currentContent =>
      currentContent.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  const handleSaveAll = async () => {
    setIsSaving(true)
    await saveEditableContent(content)
    await loadContent()
    setIsSaving(false)
  }

  const addNewContent = () => {
    const newItem: EditableContent = {
      id: `new_${Date.now()}`,
      key: `new_key_${Date.now()}`,
      value: "New content value",
      type: "text",
      section: "general",
    }
    setContent(currentContent => [...currentContent, newItem])
  }

  // *** THE DEFINITIVE FIX FOR THE DELETE FUNCTION ***
  const handleDelete = async (id: string, key: string) => {
    if (confirm(`Are you sure you want to delete the content with key "${key}"?`)) {
      setIsSaving(true)
      
      // THIS IS THE CORRECTED LOGIC:
      // An item exists in the database if its ID is NOT a string that starts with "new_".
      // This correctly handles both number IDs from the DB and string IDs for new items.
      const isExistingItem = !(typeof id === 'string' && id.startsWith("new_"));

      if (isExistingItem) {
        // This will now execute correctly for items from the database.
        await deleteContentItem(key)
      }
      
      // After deleting, always reload the data from the database.
      await loadContent() 
      
      setIsSaving(false)
    }
  }

  const hasChanges = JSON.stringify(content) !== JSON.stringify(originalContent)

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>კონტენტის რედაქტორი</CardTitle>
        <div className="flex items-center gap-4">
            {isSaving && (
                <span className="flex items-center text-sm text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    მიმდინარეობს...
                </span>
            )}
            <Button onClick={handleSaveAll} disabled={!hasChanges || isSaving}>
                <Save className="mr-2 h-4 w-4" />
                ყველა ცვლილების შენახვა
            </Button>
            <Button onClick={addNewContent} className="w-fit" disabled={isSaving}>
                ახალი კონტენტის დამატება
            </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {content.length === 0 ? (
            <p className="text-center text-muted-foreground p-8">კონტენტი ვერ მოიძებნა.</p>
        ) : (
            content.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                        <Label className="font-semibold">{item.key}</Label>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id, item.key)} disabled={isSaving}>
                            წაშლა
                        </Button>
                    </div>
                    {/* Key Input */}
                    <div>
                        <Label htmlFor={`key-${item.id}`}>Key</Label>
                        <Input
                            id={`key-${item.id}`}
                            value={item.key}
                            onChange={(e) => handleLocalUpdate(item.id, 'key', e.target.value)}
                            disabled={isSaving || !(typeof item.id === 'string' && item.id.startsWith("new_"))}
                        />
                    </div>
                    {/* Value Input/Textarea */}
                    <div>
                        <Label htmlFor={`value-${item.id}`}>Value</Label>
                        {item.type === "textarea" ? (
                            <Textarea id={`value-${item.id}`} value={item.value} onChange={(e) => handleLocalUpdate(item.id, 'value', e.target.value)} rows={4} disabled={isSaving} />
                        ) : (
                            <Input id={`value-${item.id}`} value={item.value} onChange={(e) => handleLocalUpdate(item.id, 'value', e.target.value)} type={item.type === "number" ? "number" : "text"} disabled={isSaving} />
                        )}
                    </div>
                </div>
            ))
        )}
      </CardContent>
    </Card>
  )
}