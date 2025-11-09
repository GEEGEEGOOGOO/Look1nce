'use client'

import { useState, useRef } from 'react'
import { Upload, Image as ImageIcon, Loader2, Shirt, CheckCircle } from 'lucide-react'
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

  const categories = [
    { value: 'upper_body', label: 'Upper Body', desc: 'Shirts, T-shirts, Hoodies' },
    { value: 'lower_body', label: 'Lower Body', desc: 'Pants, Jeans, Shorts' },
    { value: 'dress', label: 'Full Dress', desc: 'Dresses, Jumpsuits' }
  ]

  return (
    <div className="card max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#e50914] to-[#c40812] mb-4 glow-red">
          <Shirt className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-black mb-2">Choose Your Outfit</h2>
        <p className="text-[#b3b3b3]">Upload a clothing image from any shopping website</p>
      </div>
      
      <div className="space-y-6">
        {/* Upload Zone */}
        {!preview ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="upload-zone group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="relative z-10">
              <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#1a1a1a] border-2 border-[#2a2a2a] group-hover:border-[#e50914] group-hover:bg-[#e50914]/10 transition-all duration-300">
                <Upload className="w-10 h-10 text-[#808080] group-hover:text-[#e50914] transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-[#e50914] transition-colors duration-300">
                Click to Upload Clothing Image
              </h3>
              <p className="text-[#808080] mb-4">
                PNG, JPG up to 10MB
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-[#606060]">
                <ImageIcon className="w-4 h-4" />
                <span>Supports all image formats</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Preview */}
            <div className="image-preview group">
              <img
                src={preview}
                alt="Cloth preview"
                className="w-full h-96 object-contain"
              />
              <button
                onClick={() => {
                  setFile(null)
                  setPreview('')
                }}
                className="absolute top-4 right-4 px-4 py-2 bg-[#0a0a0a]/80 hover:bg-[#e50914] text-white rounded-lg backdrop-blur-sm transition-all duration-300 font-semibold border border-[#2a2a2a] hover:border-[#e50914]"
              >
                Change Image
              </button>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-bold mb-4 text-[#b3b3b3] uppercase tracking-wider">
                Select Clothing Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={`
                      relative p-6 rounded-xl border-2 transition-all duration-300 text-left
                      ${category === cat.value 
                        ? 'border-[#e50914] bg-[#e50914]/10 shadow-lg shadow-red-900/20' 
                        : 'border-[#2a2a2a] bg-[#141414] hover:border-[#e50914]/50 hover:bg-[#1a1a1a]'
                      }
                    `}
                  >
                    {category === cat.value && (
                      <div className="absolute top-3 right-3">
                        <CheckCircle className="w-5 h-5 text-[#e50914]" />
                      </div>
                    )}
                    <div className="font-bold mb-1">{cat.label}</div>
                    <div className="text-sm text-[#808080]">{cat.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary w-full text-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="spinner w-5 h-5" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Continue to Next Step</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
