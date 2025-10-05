"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { getEditableContent, saveEditableContent, type EditableContent } from "@/lib/content-manager"

export default function ContentEditor() {
  const [content, setContent] = useState<EditableContent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadContent = () => {
      const editableContent = getEditableContent()
      setContent(editableContent)
      setIsLoading(false)
    }
    loadContent()
  }, [])

  const handleUpdate = (id: string, value: string) => {
    const updatedContent = content.map((item) => (item.id === id ? { ...item, value } : item))
    setContent(updatedContent)
    saveEditableContent(updatedContent)
  }

  const addNewContent = () => {
    const newItem: EditableContent = {
      id: Date.now().toString(),
      key: `custom_${Date.now()}`,
      value: "",
      type: "text",
      section: "custom",
    }
    const updatedContent = [...content, newItem]
    setContent(updatedContent)
    saveEditableContent(updatedContent)
  }

  const deleteContent = (id: string) => {
    const updatedContent = content.filter((item) => item.id !== id)
    setContent(updatedContent)
    saveEditableContent(updatedContent)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Editor</CardTitle>
        <Button onClick={addNewContent} className="w-fit">
          Add New Content
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {content.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <Label className="font-semibold">{item.key}</Label>
              <Button variant="destructive" size="sm" onClick={() => deleteContent(item.id)}>
                Delete
              </Button>
            </div>

            <div>
              <Label>Key</Label>
              <Input
                value={item.key}
                onChange={(e) => {
                  const updatedContent = content.map((c) => (c.id === item.id ? { ...c, key: e.target.value } : c))
                  setContent(updatedContent)
                  saveEditableContent(updatedContent)
                }}
              />
            </div>

            <div>
              <Label>Value</Label>
              {item.type === "textarea" ? (
                <Textarea value={item.value} onChange={(e) => handleUpdate(item.id, e.target.value)} rows={4} />
              ) : (
                <Input
                  value={item.value}
                  onChange={(e) => handleUpdate(item.id, e.target.value)}
                  type={item.type === "number" ? "number" : "text"}
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <select
                  value={item.type}
                  onChange={(e) => {
                    const updatedContent = content.map((c) =>
                      c.id === item.id ? { ...c, type: e.target.value as "text" | "number" | "textarea" } : c,
                    )
                    setContent(updatedContent)
                    saveEditableContent(updatedContent)
                  }}
                  className="w-full p-2 border rounded"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="textarea">Textarea</option>
                </select>
              </div>

              <div>
                <Label>Section</Label>
                <Input
                  value={item.section}
                  onChange={(e) => {
                    const updatedContent = content.map((c) =>
                      c.id === item.id ? { ...c, section: e.target.value } : c,
                    )
                    setContent(updatedContent)
                    saveEditableContent(updatedContent)
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
