"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, X, ImageIcon, Trash2, Eye } from "lucide-react"
import {
  uploadImage,
  getUploadedImages,
  deleteUploadedImage,
  formatFileSize,
  type UploadedImage,
} from "@/lib/image-storage"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  category?: string
  placeholder?: string
  className?: string
  accept?: string
  maxSize?: number // in MB
  showGallery?: boolean
}

export default function ImageUpload({
  value,
  onChange,
  category = "general",
  placeholder = "Upload an image or enter URL",
  className,
  accept = "image/*",
  maxSize = 5,
  showGallery = true,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [urlInput, setUrlInput] = useState(value || "")
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadImages = useCallback(() => {
    const images = getUploadedImages()
    setUploadedImages(images)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        await handleFileUpload(files[0])
      }
    },
    [category],
  )

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        await handleFileUpload(files[0])
      }
    },
    [category],
  )

  const handleFileUpload = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`)
      return
    }

    setIsUploading(true)
    try {
      const uploadedImage = await uploadImage(file, category)
      onChange(uploadedImage.url)
      loadImages()
    } catch (error) {
      console.error("Upload failed:", error)
      alert("Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleUrlSubmit = () => {
    onChange(urlInput)
    setShowUrlInput(false)
  }

  const handleImageSelect = (imageUrl: string) => {
    onChange(imageUrl)
    setGalleryOpen(false)
  }

  const handleDeleteImage = async (id: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      deleteUploadedImage(id)
      loadImages()
    }
  }

  const openGallery = () => {
    loadImages()
    setGalleryOpen(true)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Current Image Preview */}
      {value && (
        <div className="relative">
          <img src={value || "/placeholder.svg"} alt="Preview" className="w-full h-32 object-cover rounded border" />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 h-6 w-6 p-0"
            onClick={() => onChange("")}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Upload Area */}
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          isDragging ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400",
          isUploading && "opacity-50 pointer-events-none",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <Upload className={cn("h-8 w-8 mb-2", isDragging ? "text-red-500" : "text-gray-400")} />
          <p className="text-sm text-gray-600 mb-2">
            {isUploading ? "Uploading..." : "Drag & drop an image here, or click to select"}
          </p>
          <p className="text-xs text-gray-400">Max size: {maxSize}MB</p>
        </CardContent>
      </Card>

      <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileSelect} className="hidden" />

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="flex-1"
        >
          Enter URL
        </Button>
        {showGallery && (
          <Button type="button" variant="outline" size="sm" onClick={openGallery} className="flex-1 bg-transparent">
            <ImageIcon className="h-4 w-4 mr-2" />
            Gallery
          </Button>
        )}
      </div>

      {/* URL Input */}
      {showUrlInput && (
        <div className="flex gap-2">
          <Input
            placeholder="Enter image URL"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1"
          />
          <Button type="button" onClick={handleUrlSubmit} size="sm">
            Add
          </Button>
        </div>
      )}

      {/* Image Gallery Dialog */}
      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Image Gallery</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedImages.map((image) => (
              <Card key={image.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative group">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={image.name}
                    className="w-full h-24 object-cover cursor-pointer"
                    onClick={() => handleImageSelect(image.url)}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleImageSelect(image.url)}
                        className="h-6 w-6 p-0"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteImage(image.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                <CardContent className="p-2">
                  <p className="text-xs font-medium truncate">{image.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(image.size)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          {uploadedImages.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No images uploaded yet.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
