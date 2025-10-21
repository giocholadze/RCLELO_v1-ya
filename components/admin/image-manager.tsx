"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import FormField from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
    getAllImagesFromStorage, 
    createImage, 
    updateImage, 
    deleteImage,
    getUploadedImages,
    deleteUploadedImage,
    formatFileSize,
    uploadGalleryImage
} from "@/lib/content-manager"
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
  
  const handleCreate = async (imageData: Omit<ImageType, "id" | "url"> & { imageFile?: File }) => {
    try {
        let imageUrl = "";
        if (imageData.imageFile) {
            const uploadedUrl = await uploadGalleryImage(imageData.imageFile);
            if (!uploadedUrl) {
                alert("Image upload failed. Please try again.");
                return;
            }
            imageUrl = uploadedUrl;
        }

        const { imageFile, ...dbData } = imageData;

        await createImage({
            ...dbData,
            url: imageUrl,
        });
        await loadImages();
        setIsDialogOpen(false);
    } catch (error) {
        // FIX: Add detailed error logging
        console.error("Failed to create image record:", error);
        alert("Failed to create image record. Check the console for more details.");
    }
  }

  const handleUpdate = async (id: number, updates: Partial<ImageType>) => {
    try {
        await updateImage(id, updates)
        await loadImages()
        setEditingImage(null)
        setIsDialogOpen(false)
    } catch(error) {
        // FIX: Add detailed error logging
        console.error("Failed to update image record:", error);
        alert("Failed to update image record. Check the console for more details.");
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this gallery record? This won't delete the uploaded file.")) {
      await deleteImage(id)
      await loadImages()
    }
  }
  
  const handleDeleteUploaded = async (fileName: string) => {
    if (confirm("Are you sure you want to permanently delete this file from storage?")) {
      await deleteUploadedImage(fileName)
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
                Add Image to Gallery
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingImage ? "Edit Gallery Image" : "Add Image to Gallery"}</DialogTitle>
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
            Gallery DB ({images.length})
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
                    {image.metadata.mimetype}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{formatFileSize(image.size)}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{new Date(image.uploadedAt).toLocaleString()}</p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteUploaded(image.name)}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete File
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
  onCreate: (data: Omit<ImageType, "id" | "url"> & { imageFile?: File }) => void;
  onUpdate: (data: Partial<ImageType>) => void;
}) {
  const [formData, setFormData] = useState({
    alt: image?.alt || "",
    category: image?.category || "უმაღლესი" as LeagueCategory,
    imageFile: undefined as File | undefined,
    url: image?.url || ""
  })

  useEffect(() => {
    setFormData({
      alt: image?.alt || "",
      category: image?.category || "უმაღლესი",
      imageFile: undefined,
      url: image?.url || "",
    })
  }, [image])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image && !formData.imageFile) {
        alert("Please select an image file to upload.");
        return;
    }
    
    const { url, ...dataToSubmit } = formData;

    if (image) {
      onUpdate({
        id: image.id,
        alt: dataToSubmit.alt,
        category: dataToSubmit.category,
      });
    } else {
      onCreate({
        ...dataToSubmit,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 1, // Placeholder user ID
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!image && (
        <div>
            <Label>Image File</Label>
            <Input 
                type="file"
                required
                accept="image/*"
                onChange={(e) => setFormData(prev => ({...prev, imageFile: e.target.files?.[0]}))}
            />
        </div>
      )}

      <FormField
        type="text"
        label="Alt Text"
        value={formData.alt}
        onChange={(value) => setFormData(prev => ({...prev, alt: value}))}
        required
      />
      <FormField
        type="select"
        label="Category"
        value={formData.category}
        onChange={(value) => setFormData(prev => ({...prev, category: value as LeagueCategory}))}
        options={categoryOptions}
        required
      />

      {(formData.url || formData.imageFile) && (
        <div>
            <Label>Preview</Label>
            <img
                src={formData.imageFile ? URL.createObjectURL(formData.imageFile) : formData.url}
                alt="Preview"
                className="w-full h-32 object-cover rounded border mt-1"
            />
        </div>
      )}

      <Button type="submit" className="w-full">
        {image ? "Update" : "Add"} Image
      </Button>
    </form>
  )
}