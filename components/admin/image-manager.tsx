"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import FormField from "@/components/ui/form-field"
import { getAllImagesFromStorage, createImage, updateImage, deleteImage } from "@/lib/content-manager"
import { getUploadedImages, deleteUploadedImage, formatFileSize } from "@/lib/image-storage"
import type { Image as ImageType, LeagueCategory } from "@/lib/types" 
import { Pencil, Trash2, Plus, Upload } from "lucide-react"

const categoryOptions: { value: LeagueCategory; label: string }[] = [
    { value: "უმაღლესი", label: "უმაღლესი (Men's)" },
    { value: "ესპუართა", label: "ესპუართა (Men's)" },
    { value: "ლიგა 'ა'", label: "ლიგა 'ა' (Youth)" },
    { value: "ლიგა 'ბ'", label: "ლიგა 'ბ' (Youth)" },
    { value: "საფესტივალო", label: "საფესტივალო (Youth)" },
]

export default function ImageManager() {
  const [images, setImages] = useState<ImageType[]>([])
  const [uploadedImages, setUploadedImages] = useState<any[]>([])
  const [editingImage, setEditingImage] = useState<ImageType | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"gallery" | "uploaded">("gallery")

  useEffect(() => {
    loadImages()
    loadUploadedImages()
  }, [])

  const loadImages = async () => {
    const allImages = await getAllImagesFromStorage()
    setImages(allImages)
  }

  const loadUploadedImages = async () => {
    const uploaded = await getUploadedImages() 
    setUploadedImages(uploaded)
  }

  const handleCreate = async (imageData: Omit<ImageType, "id">) => {
    await createImage(imageData)
    await loadImages()
    setIsDialogOpen(false)
  }

  const handleUpdate = async (id: number, updates: Partial<ImageType>) => {
    await updateImage(id, updates)
    await loadImages()
    setEditingImage(null)
    setIsDialogOpen(false)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this image?")) {
      await deleteImage(id)
      await loadImages()
    }
  }
  
  const handleDeleteUploaded = async (id: string) => {
    if (confirm("Are you sure you want to delete this uploaded image?")) {
      await deleteUploadedImage(id)
      await loadUploadedImages()
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <CardTitle>Image Manager</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingImage(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Image
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingImage ? "Edit Image" : "Add Image"}</DialogTitle>
              </DialogHeader>
              <ImageForm
                image={editingImage}
                onCreate={handleCreate}
                onUpdate={(data) => handleUpdate(editingImage!.id, data)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-2">
          <Button
            variant={activeTab === "gallery" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("gallery")}
          >
            Gallery Images ({images.length})
          </Button>
          <Button
            variant={activeTab === "uploaded" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("uploaded")}
          >
            <Upload className="h-4 w-4 mr-2" />
            Uploaded Files ({uploadedImages.length})
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {activeTab === "gallery" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image.id} className="border rounded-lg p-4">
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.alt}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <h3 className="font-semibold truncate">{image.alt}</h3>
                <p className="text-sm text-muted-foreground">{image.category}</p>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingImage(image)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(image.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedImages.map((image) => (
              <div key={image.id} className="border rounded-lg p-4">
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.name}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <h3 className="font-semibold truncate">{image.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {image.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{formatFileSize(image.size)}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{new Date(image.uploadedAt).toLocaleDateString()}</p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteUploaded(image.id)}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            ))}
          </div>
        )}
        {activeTab === "gallery" && images.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No gallery images found.</p>
          </div>
        )}
        {activeTab === "uploaded" && uploadedImages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No uploaded files found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ImageForm({
  image,
  onCreate,
  onUpdate,
}: {
  image: ImageType | null;
  onCreate: (data: Omit<ImageType, "id">) => void;
  onUpdate: (data: Partial<ImageType>) => void;
}) {
  const [formData, setFormData] = useState({
    url: image?.url || "",
    alt: image?.alt || "",
    category: image?.category || "უმაღლესი",
  })

  useEffect(() => {
    setFormData({
      url: image?.url || "",
      alt: image?.alt || "",
      category: image?.category || "უმაღლესი",
    })
  }, [image])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const dataToSubmit = {
      ...formData,
      category: formData.category as LeagueCategory,
      uploadedAt: image?.uploadedAt || new Date().toISOString(),
      uploadedBy: image?.uploadedBy || 1, 
    }
    if (image) {
      onUpdate(dataToSubmit)
    } else {
      onCreate(dataToSubmit)
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        type="image"
        label="Image"
        value={formData.url}
        onChange={(value) => updateField("url", value)}
        category="gallery"
        required
      />
      <FormField
        type="text"
        label="Alt Text"
        value={formData.alt}
        onChange={(value) => updateField("alt", value)}
        required
      />
      <FormField
        type="select"
        label="Category"
        value={formData.category}
        onChange={(value) => updateField("category", value)}
        options={categoryOptions}
        required
      />
      <Button type="submit" className="w-full">
        {image ? "Update" : "Add"} Image
      </Button>
    </form>
  )
}
