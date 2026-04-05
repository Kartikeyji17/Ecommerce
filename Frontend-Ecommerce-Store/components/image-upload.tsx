'use client'

import { useState } from 'react'
import { Upload, Loader2, X } from 'lucide-react'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file'); return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB'); return
    }

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      )

      const data = await res.json()
      if (data.secure_url) {
        onChange(data.secure_url)
      } else {
        setError('Upload failed, try again')
      }
    } catch {
      setError('Upload failed, try again')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* Preview */}
      {value && (
        <div className="relative">
          <img src={value} alt="Product"
            className="w-full h-48 object-cover rounded-lg border border-border" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1 hover:bg-destructive/80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload button */}
      <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition
        ${uploading ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary hover:bg-primary/5'}
        ${value ? 'hidden' : 'flex'}`}>
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8" />
              <p className="text-sm font-medium">Click to upload image</p>
              <p className="text-xs">PNG, JPG, WEBP up to 5MB</p>
            </>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}