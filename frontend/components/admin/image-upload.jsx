"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Upload, Link as LinkIcon, X, Loader2, Image as ImageIcon } from "lucide-react"
import { api } from "@/lib/api"
import { toast } from "sonner"

export function ImageUpload({ value, onChange, label = "Image" }) {
  const [mode, setMode] = useState(value?.startsWith('http') ? 'url' : 'file')
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value || "")

  useEffect(() => {
    setPreview(value || "")
  }, [value])

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('image', file)

    try {
      // We need to use axios directly or add an upload method to api.js
      // Let's assume api.uploadImage exists or we use the instance
      const res = await api.uploadImage(formData)
      const url = res.url
      onChange(url)
      setPreview(url)
      toast.success("Image uploaded successfully")
    } catch (err) {
      console.error(err)
      toast.error("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const handleUrlChange = (val) => {
    onChange(val)
    setPreview(val)
  }

  const clear = () => {
    onChange("")
    setPreview("")
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant={mode === 'file' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setMode('file')}
            className="h-7 text-[10px] px-2"
          >
            <Upload className="w-3 h-3 mr-1" /> Upload
          </Button>
          <Button 
            type="button" 
            variant={mode === 'url' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setMode('url')}
            className="h-7 text-[10px] px-2"
          >
            <LinkIcon className="w-3 h-3 mr-1" /> URL
          </Button>
        </div>
      </div>

      <div className="relative group">
        {mode === 'file' ? (
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                disabled={uploading}
                className="cursor-pointer"
              />
            </div>
          </div>
        ) : (
          <Input 
            value={preview.startsWith('http') ? preview : ''} 
            onChange={(e) => handleUrlChange(e.target.value)} 
            placeholder="https://images.unsplash.com/..."
            className="pr-10"
          />
        )}
      </div>

      {preview && (
        <div className="relative aspect-video rounded-lg overflow-hidden border border-border bg-muted group">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <Button type="button" variant="destructive" size="icon" onClick={clear}>
               <X className="w-4 h-4" />
             </Button>
          </div>
        </div>
      )}

      {uploading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
          <Loader2 className="w-3 h-3 animate-spin" />
          Uploading image...
        </div>
      )}
    </div>
  )
}
