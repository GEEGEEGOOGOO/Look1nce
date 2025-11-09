'use client'

import { useState, useRef } from 'react'
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react'
import { preprocessCloth } from '@/lib/api'

interface ClothUploadProps {
  onUploadComplete: (data: { file: File; category: string; processedPath: string }) => void
}

export default function ClothUpload({ onUploadComplete }: ClothUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [category, setCategory] = useState<string>('upper_body')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please upload an image file')
        return
      }
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
      setError('')
    }
  }

  const handleSubmit = async () => {
    if (!file) {
      setError('Please upload a cloth image')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await preprocessCloth(file, category)
      onUploadComplete({
        file,
        category,
        processedPath: result.processed_path
      })
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to process cloth image')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">Upload Clothing Item</h2>
      
      <div className="space-y-6">
        <div
          className="upload-zone"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          
          {preview ? (
            <div className="space-y-4">
              <div className="image-preview">
                <img 
                  src={preview} 
                  alt="Cloth preview" 
                  className="max-h-64 mx-auto rounded-lg"
                />
              </div>
              <p className="text-sm text-text-light">Click to change image</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-16 h-16 mx-auto text-text-muted" />
              <div>
                <p className="text-lg font-semibold text-white">
                  Click to upload clothing image
                </p>
                <p className="text-sm text-text-light mt-2">
                  From Myntra, Amazon, or any website
                </p>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-3">
            Clothing Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full"
          >
            <option value="upper_body">Upper Body (Shirt, T-shirt, Jacket)</option>
            <option value="lower_body">Lower Body (Pants, Jeans, Shorts)</option>
            <option value="dress">Dress / Full Body</option>
          </select>
        </div>

        {error && (
          <div className="bg-[#3a1414] border border-[#e50914]/50 text-[#ff6b6b] px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!file || loading}
          className="btn-primary w-full flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <ImageIcon className="w-5 h-5" />
              <span>Continue to Photo Upload</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
