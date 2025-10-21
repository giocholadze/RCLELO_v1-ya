"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, X, ImageIcon, Trash2, Eye, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
// 1. FIX: Import Supabase client directly and the correct gallery function
import { supabase } from "@/lib/supabase"
import { getAllImagesFromStorage } from "@/lib/content-manager" 
import type { Image as ImageType } from "@/lib/types"

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
  const [galleryImages, setGalleryImages] = useState<ImageType[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 2. FIX: Rewritten file upload logic to use Supabase Storage
  const handleFileUpload = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`)
      return
    }

    setIsUploading(true)
    try {
      const fileName = `${Date.now()}_${file.name}`
      const { data, error } = await supabase.storage
        .from(category) // 'category' should match your bucket name (e.g., 'news', 'gallery')
        .upload(fileName, file)

      if (error) throw error

      // Get the public URL of the uploaded file
      const { data: { publicUrl } } = supabase.storage.from(category).getPublicUrl(fileName)
      
      onChange(publicUrl) // Update the form with the new URL
    } catch (error) {
      console.error("Upload failed:", error)
      alert("Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }
  
  // All the drag/drop and file select handlers now point to the new upload logic
  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, [])
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, [])
  const handleDrop = useCallback(async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) await handleFileUpload(files[0]);
  }, [category]);
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) await handleFileUpload(files[0]);
  }, [category]);


  const handleUrlSubmit = () => {
    onChange(urlInput)
    setShowUrlInput(false)
  }
  
  // 3. FIX: Rewritten gallery logic to fetch from the database
  const openGallery = async () => {
    const images = await getAllImagesFromStorage()
    setGalleryImages(images)
    setGalleryOpen(true)
  }

  const handleImageSelect = (imageUrl: string) => {
    onChange(imageUrl)
    setGalleryOpen(false)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {value && (
        <div className="relative">
          <img src={value} alt="Preview" className="w-full h-32 object-cover rounded border" />
          <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2 h-6 w-6 p-0" onClick={() => onChange("")}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      <Card
        className={cn("border-2 border-dashed ...", isDragging && "border-red-500", isUploading && "opacity-50")}
        onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            {isUploading ? <Loader2 className="h-8 w-8 mb-2 animate-spin text-red-500"/> : <Upload className="h-8 w-8 mb-2 text-gray-400" />}
            <p className="text-sm text-gray-600 mb-2">{isUploading ? "Uploading..." : "Drag & drop an image, or click to select"}</p>
            <p className="text-xs text-gray-400">Max size: {maxSize}MB</p>
        </CardContent>
      </Card>

      <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileSelect} className="hidden" />

      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => setShowUrlInput(!showUrlInput)} className="flex-1">
            Enter URL
        </Button>
        {showGallery && (
          <Button type="button" variant="outline" size="sm" onClick={openGallery} className="flex-1 bg-transparent">
            <ImageIcon className="h-4 w-4 mr-2" />
            Gallery
          </Button>
        )}
      </div>

      {showUrlInput && (
        <div className="flex gap-2">
          <Input placeholder="Enter image URL" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} className="flex-1" />
          <Button type="button" onClick={handleUrlSubmit} size="sm">Add</Button>
        </div>
      )}

      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Image Gallery</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image) => (
              <Card key={image.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative group">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={image.alt}
                    className="w-full h-24 object-cover cursor-pointer"
                    onClick={() => handleImageSelect(image.url)}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                     <Button size="sm" variant="secondary" onClick={() => handleImageSelect(image.url)} className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                        <Eye className="h-4 w-4" />
                     </Button>
                  </div>
                </div>
                <CardContent className="p-2">
                  <p className="text-xs font-medium truncate">{image.alt}</p>
                  <p className="text-xs text-muted-foreground">{image.category}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          {galleryImages.length === 0 && (
            <div className="text-center py-8"><p className="text-muted-foreground">No images found in the gallery.</p></div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}