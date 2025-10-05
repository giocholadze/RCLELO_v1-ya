"use client"

// Image storage service for handling uploads and management
const UPLOADED_IMAGES_KEY = "lelo_uploaded_images"

export interface UploadedImage {
  id: string
  name: string
  url: string
  file: File
  uploadedAt: string
  category: string
  size: number
  type: string
}

export function getUploadedImages(): UploadedImage[] {
  if (typeof window === "undefined") return []
  const images = localStorage.getItem(UPLOADED_IMAGES_KEY)
  return images ? JSON.parse(images) : []
}

export function saveUploadedImages(images: UploadedImage[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(UPLOADED_IMAGES_KEY, JSON.stringify(images))
}

export function uploadImage(file: File, category = "general"): Promise<UploadedImage> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("File must be an image"))
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const uploadedImage: UploadedImage = {
        id: Date.now().toString(),
        name: file.name,
        url: e.target?.result as string,
        file,
        uploadedAt: new Date().toISOString(),
        category,
        size: file.size,
        type: file.type,
      }

      const existingImages = getUploadedImages()
      existingImages.push(uploadedImage)
      saveUploadedImages(existingImages)
      resolve(uploadedImage)
    }

    reader.onerror = () => {
      reject(new Error("Failed to read file"))
    }

    reader.readAsDataURL(file)
  })
}

export function deleteUploadedImage(id: string): boolean {
  const images = getUploadedImages()
  const filteredImages = images.filter((img) => img.id !== id)

  if (filteredImages.length !== images.length) {
    saveUploadedImages(filteredImages)
    return true
  }

  return false
}

export function getImagesByCategory(category: string): UploadedImage[] {
  return getUploadedImages().filter((img) => img.category === category)
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
