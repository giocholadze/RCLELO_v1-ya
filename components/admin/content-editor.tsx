// components/admin/content-editor.tsx (შესწორებული)

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

// **გასწორდა იმპორტი:** EditableContent ახლა მოდის /lib/types-დან
import type { EditableContent } from "@/lib/types" 
import { getEditableContent, saveEditableContent } from "@/lib/content-manager" 
import { Loader2 } from "lucide-react" 

export default function ContentEditor() {
  const [content, setContent] = useState<EditableContent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // ------------------------------------
  // 1. მონაცემების ჩატვირთვა (useEffect-ში)
  // ------------------------------------
  useEffect(() => {
    const loadContent = async () => {
      // ვინაიდან getEditableContent არის async, ვიყენებთ await-ს
      const editableContent = await getEditableContent()
      setContent(editableContent)
      setIsLoading(false)
    }
    loadContent()
  }, [])

  // ------------------------------------
  // 2. ცვლილების დამუშავება და შენახვა
  // ------------------------------------
  const handleUpdate = async (id: string, value: string) => {
    setIsSaving(true)
    const updatedContent = content.map((item) => (item.id === id ? { ...item, value } : item))
    setContent(updatedContent)
    await saveEditableContent(updatedContent) // ასინქრონული შენახვა
    setIsSaving(false)
  }

  const addNewContent = async () => {
    setIsSaving(true)
    const newItem: EditableContent = {
      id: Date.now().toString(),
      key: `custom_${Date.now()}`,
      value: "",
      type: "text",
      section: "custom",
    }
    const updatedContent = [...content, newItem]
    setContent(updatedContent)
    await saveEditableContent(updatedContent)
    setIsSaving(false)
  }

  const deleteContent = async (id: string) => {
    setIsSaving(true)
    const updatedContent = content.filter((item) => item.id !== id)
    setContent(updatedContent)
    await saveEditableContent(updatedContent)
    setIsSaving(false)
  }

  // ------------------------------------
  // 3. UI რენდერი
  // ------------------------------------
  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  const contentToMap = Array.isArray(content) ? content : [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>კონტენტის რედაქტორი</CardTitle>
        <div className="flex items-center gap-4">
            {isSaving && (
                <span className="flex items-center text-sm text-muted-foreground animate-pulse">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    შენახვა...
                </span>
            )}
            <Button onClick={addNewContent} className="w-fit" disabled={isSaving}>
                ახალი კონტენტის დამატება
            </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* აქ იყო შეცდომა (image_dd2065.png: Error: content.map is not a function).
           ეს ხდება, თუ content არასწორად ჩაიტვირთება, მაგრამ ახლა loadContent არის async, რაც ამცირებს რისკს. */}
        {contentToMap.length === 0 ? (
            <p className="text-center text-muted-foreground p-8">კონტენტი ვერ მოიძებნა. დაამატეთ ახალი.</p>
        ) : (
            contentToMap.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                        <Label className="font-semibold">{item.key}</Label>
                        <Button variant="destructive" size="sm" onClick={() => deleteContent(item.id)} disabled={isSaving}>
                            წაშლა
                        </Button>
                    </div>

                    {/* Key Input */}
                    <div>
                        <Label htmlFor={`key-${item.id}`}>Key</Label>
                        <Input
                            id={`key-${item.id}`}
                            value={item.key}
                            onChange={async (e) => {
                                setIsSaving(true)
                                const updatedContent = content.map((c) => (c.id === item.id ? { ...c, key: e.target.value } : c))
                                setContent(updatedContent)
                                await saveEditableContent(updatedContent)
                                setIsSaving(false)
                            }}
                            disabled={isSaving}
                        />
                    </div>

                    {/* Value Input/Textarea */}
                    <div>
                        <Label htmlFor={`value-${item.id}`}>Value</Label>
                        {item.type === "textarea" ? (
                            <Textarea 
                                id={`value-${item.id}`}
                                value={item.value} 
                                onChange={(e) => handleUpdate(item.id, e.target.value)} 
                                rows={4} 
                                disabled={isSaving} 
                            />
                        ) : (
                            <Input
                                id={`value-${item.id}`}
                                value={item.value}
                                onChange={(e) => handleUpdate(item.id, e.target.value)}
                                type={item.type === "number" ? "number" : "text"}
                                disabled={isSaving}
                            />
                        )}
                    </div>

                    {/* Type and Section Selectors */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor={`type-${item.id}`}>Type</Label>
                            <select
                                id={`type-${item.id}`}
                                value={item.type}
                                onChange={async (e) => {
                                    setIsSaving(true)
                                    const updatedContent = content.map((c) =>
                                        c.id === item.id ? { ...c, type: e.target.value as "text" | "number" | "textarea" } : c,
                                    )
                                    setContent(updatedContent)
                                    await saveEditableContent(updatedContent)
                                    setIsSaving(false)
                                }}
                                className="w-full p-2 border rounded border-input bg-background"
                                disabled={isSaving}
                            >
                                <option value="text">ტექსტი</option>
                                <option value="number">რიცხვი</option>
                                <option value="textarea">ტექსტური ველი</option>
                            </select>
                        </div>

                        <div>
                            <Label htmlFor={`section-${item.id}`}>Section</Label>
                            <Input
                                id={`section-${item.id}`}
                                value={item.section}
                                onChange={async (e) => {
                                    setIsSaving(true)
                                    const updatedContent = content.map((c) =>
                                        c.id === item.id ? { ...c, section: e.target.value } : c,
                                    )
                                    setContent(updatedContent)
                                    await saveEditableContent(updatedContent)
                                    setIsSaving(false)
                                }}
                                disabled={isSaving}
                            />
                        </div>
                    </div>
                </div>
            ))
        )}
      </CardContent>
    </Card>
  )
}