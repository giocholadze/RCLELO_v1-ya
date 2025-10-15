"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus, Trash2, Eye } from "lucide-react"
import { getAllImagesFromStorage, createImage, deleteImage } from "@/lib/content-manager"
import type { Image } from "@/lib/types"
import { useAuth } from "@/components/auth/auth-provider"

export default function GalleryPage() {
  const [images, setImages] = useState<Image[]>([])
  const [filteredImages, setFilteredImages] = useState<Image[]>([])
  const [selectedCategory, setSelectedCategory] = useState("ყველა")
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<Image | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { isAdmin } = useAuth()

  useEffect(() => {
    loadImages()
  }, [])

  useEffect(() => {
    filterImages()
  }, [images, selectedCategory, searchTerm])

  const loadImages = async () => {
    setIsLoading(true)
    const allImages = await getAllImagesFromStorage()
    setImages(allImages)
    setIsLoading(false)
  }

  const filterImages = () => {
    let filtered = images

    if (selectedCategory !== "ყველა") {
      filtered = filtered.filter((img) => img.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (img) =>
          img.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          img.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredImages(filtered)
  }

  const handleAddImage = async (imageData: { url: string; alt: string; category: string }) => {
    await createImage({
      ...imageData,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 1,
    })
    loadImages()
    setIsDialogOpen(false)
  }

  const handleDeleteImage = async (id: number, alt: string) => {
    if (confirm(`დარწმუნებული ხართ, რომ გსურთ ${alt}-ის წაშლა?`)) {
      await deleteImage(id)
      loadImages()
    }
  }

  const categories = ["ყველა", ...Array.from(new Set(images.map((img) => img.category)))]

  if (isLoading) {
    return (
      <div className="w-full max-w-[1200px] mx-auto px-4 py-8">
        <div className="text-center">Loading gallery...</div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-1">გალერეა</h1>
            <p className="text-muted-foreground text-lg">ლელოს ფოტო კოლექცია</p>
          </div>
          {isAdmin && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  ფოტოს დამატება
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>ახალი ფოტოს დამატება</DialogTitle>
                </DialogHeader>
                <ImageForm onSubmit={handleAddImage} />
              </DialogContent>
            </Dialog>
          )}
        </div>
        <nav className="text-sm text-muted-foreground">
          <span>მთავარი</span> / <span className="text-foreground">გალერეა</span>
        </nav>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="ძიება..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-red-500 hover:bg-red-600" : "hover:bg-red-50"}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Image Grid */}
      {filteredImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative">
                <img
                  src={image.url || "/placeholder.svg?height=200&width=300"}
                  alt={image.alt}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => {
                    setSelectedImage(image)
                    setIsViewDialogOpen(true)
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      setSelectedImage(image)
                      setIsViewDialogOpen(true)
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    ნახვა
                  </Button>
                </div>
                {isAdmin && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 p-0"
                    onClick={() => handleDeleteImage(image.id, image.alt)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-2">{image.alt}</h3>
                <p className="text-sm text-muted-foreground">{image.category}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(image.uploadedAt).toLocaleDateString("ka-GE")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📷</div>
          <h3 className="text-xl font-semibold mb-2">ფოტოები ვერ მოიძებნა</h3>
          <p className="text-muted-foreground mb-4">შეცვალეთ ძიების კრიტერიუმები ან დაამატეთ ახალი ფოტოები.</p>
          <Button
            onClick={() => {
              setSelectedCategory("ყველა")
              setSearchTerm("")
            }}
          >
            ყველა ფოტოს ნახვა
          </Button>
        </div>
      )}

      {/* Image View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedImage?.alt}</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <img
                src={selectedImage.url || "/placeholder.svg"}
                alt={selectedImage.alt}
                className="w-full max-h-96 object-contain rounded"
              />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>კატეგორია:</strong> {selectedImage.category}
                </div>
                <div>
                  <strong>ატვირთვის თარიღი:</strong> {new Date(selectedImage.uploadedAt).toLocaleDateString("ka-GE")}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ImageForm({ onSubmit }: { onSubmit: (data: { url: string; alt: string; category: string }) => void }) {
  const [formData, setFormData] = useState({
    url: "",
    alt: "",
    category: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ url: "", alt: "", category: "" })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>ფოტოს URL</Label>
        <Input
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          required
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <Label>აღწერა</Label>
        <Input
          value={formData.alt}
          onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
          required
          placeholder="ფოტოს აღწერა"
        />
      </div>

      <div>
        <Label>კატეგორია</Label>
        <Input
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
          placeholder="მაგ: მატჩები, ვარჯიში, ღონისძიებები"
        />
      </div>

      {formData.url && (
        <div>
          <Label>გადახედვა</Label>
          <img
            src={formData.url || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-32 object-cover rounded border"
          />
        </div>
      )}

      <Button type="submit" className="w-full">
        ფოტოს დამატება
      </Button>
    </form>
  )
}
