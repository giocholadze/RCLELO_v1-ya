"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import FormField from "@/components/ui/form-field"
import { getAllNewsFromStorage, createNews, updateNews, deleteNews } from "@/lib/content-manager"
import type { NewsItem } from "@/lib/types"
import { Pencil, Trash2, Plus } from "lucide-react"

export default function NewsManager() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    const allNews = await getAllNewsFromStorage()
    setNews(allNews)
  }

  const handleCreate = async (newsData: Omit<NewsItem, "id">) => {
    await createNews(newsData)
    await loadNews()
    setIsDialogOpen(false)
  }

  const handleUpdate = async (id: number, updates: Partial<NewsItem>) => {
    await updateNews(id, updates)
    await loadNews()
    setEditingNews(null)
    setIsDialogOpen(false)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this news item?")) {
      await deleteNews(id)
      await loadNews()
    }
  }

  const handleSubmit = (data: Omit<NewsItem, "id"> | Partial<NewsItem>) => {
    if (editingNews) {
      handleUpdate(editingNews.id, data)
    } else {
      handleCreate(data as Omit<NewsItem, "id">)
    }
  }


  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>News Manager</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingNews(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add News
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingNews ? "Edit News" : "Create News"}</DialogTitle>
              </DialogHeader>
              <NewsForm
                news={editingNews}
                onSubmit={handleSubmit}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {news.map((item) => (
            <div key={item.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.excerpt}</p>
                  <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                    <span>By: {item.author}</span>
                    <span>Category: {item.category}</span>
                    <span>Views: {item.viewCount}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingNews(item)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
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

function NewsForm({
  news,
  onSubmit,
}: {
  news: NewsItem | null
  onSubmit: (data: Omit<NewsItem, "id"> | Partial<NewsItem>) => void
}) {
  const [formData, setFormData] = useState({
    title: news?.title || "",
    excerpt: news?.excerpt || "",
    content: news?.content || "",
    author: news?.author || "",
    category: news?.category || "",
    imageUrl: news?.imageUrl || "",
    viewCount: news?.viewCount || 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      publishedDate: news?.publishedDate || new Date().toISOString(),
      isArchived: news?.isArchived || false,
    })
  }

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        type="text"
        label="Title"
        value={formData.title}
        onChange={(value) => updateField("title", value)}
        required
      />

      <FormField
        type="textarea"
        label="Excerpt"
        value={formData.excerpt}
        onChange={(value) => updateField("excerpt", value)}
        required
      />

      <FormField
        type="textarea"
        label="Content"
        value={formData.content}
        onChange={(value) => updateField("content", value)}
        rows={6}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          type="text"
          label="Author"
          value={formData.author}
          onChange={(value) => updateField("author", value)}
          required
        />

        <FormField
          type="text"
          label="Category"
          value={formData.category}
          onChange={(value) => updateField("category", value)}
          required
        />
      </div>

      <FormField
        type="image"
        label="Featured Image"
        value={formData.imageUrl || ""}
        onChange={(value) => updateField("imageUrl", value)}
        category="news"
        placeholder="Upload news image"
      />

      <Button type="submit" className="w-full">
        {news ? "Update" : "Create"} News
      </Button>
    </form>
  )
}