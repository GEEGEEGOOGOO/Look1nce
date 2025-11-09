'use client'

import { useState, useRef } from 'react'
import { Upload, Camera, User, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { preprocessPerson } from '@/lib/api'
import Webcam from 'react-webcam'

interface PersonUploadProps {
  onUploadComplete: (data: { file: File; processedPath: string }) => void
}

export default function PersonUpload({ onUploadComplete }: PersonUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [showCamera, setShowCamera] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const webcamRef = useRef<Webcam>(null)

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
      setShowCamera(false)
    }
  }

  const capturePhoto = () => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' })
          setFile(file)
          setPreview(imageSrc)
          setShowCamera(false)
        })
    }
  }

  const handleSubmit = async () => {
    if (!file) {
      setError('Please upload or capture a photo')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await preprocessPerson(file)
      onUploadComplete({
        file,
        processedPath: result.processed_path
      })
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to process person image')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#e50914] to-[#c40812] mb-4 glow-red">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-black mb-2">Upload Your Photo</h2>
        <p className="text-[#b3b3b3]">Take a photo or upload an existing one</p>
      </div>

      {/* Tips Card */}
      <div className="mb-6 p-6 bg-[#141414] rounded-xl border border-[#2a2a2a]">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-[#e50914] flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold mb-2 text-[#e50914]">For Best Results:</h4>
            <ul className="text-sm text-[#b3b3b3] space-y-1">
              <li>✓ Stand straight with arms at your sides</li>
              <li>✓ Use good lighting and simple background</li>
              <li>✓ Full body visible in frame</li>
              <li>✗ Avoid T-pose or extreme angles</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {!preview && !showCamera ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Upload Option */}
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
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1a1a1a] border-2 border-[#2a2a2a] group-hover:border-[#e50914] group-hover:bg-[#e50914]/10 transition-all duration-300">
                  <Upload className="w-8 h-8 text-[#808080] group-hover:text-[#e50914] transition-colors duration-300" />
                </div>
                <h3 className="font-bold mb-1 group-hover:text-[#e50914] transition-colors duration-300">
                  Upload Photo
                </h3>
                <p className="text-sm text-[#808080]">
                  From your device
                </p>
              </div>
            </div>

            {/* Camera Option */}
            <div 
              onClick={() => setShowCamera(true)}
              className="upload-zone group"
            >
              <div className="relative z-10">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1a1a1a] border-2 border-[#2a2a2a] group-hover:border-[#e50914] group-hover:bg-[#e50914]/10 transition-all duration-300">
                  <Camera className="w-8 h-8 text-[#808080] group-hover:text-[#e50914] transition-colors duration-300" />
                </div>
                <h3 className="font-bold mb-1 group-hover:text-[#e50914] transition-colors duration-300">
                  Use Camera
                </h3>
                <p className="text-sm text-[#808080]">
                  Take a photo now
                </p>
              </div>
            </div>
          </div>
        ) : showCamera ? (
          <div className="space-y-4">
            <div className="image-preview">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="w-full rounded-xl"
                videoConstraints={{
                  facingMode: 'user',
                  width: 1280,
                  height: 720
                }}
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={capturePhoto}
                className="btn-primary flex-1"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span>Capture Photo</span>
                </div>
              </button>
              <button
                onClick={() => setShowCamera(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Preview */}
            <div className="image-preview group">
              <img
                src={preview}
                alt="Person preview"
                className="w-full h-96 object-contain"
              />
              <button
                onClick={() => {
                  setFile(null)
                  setPreview('')
                }}
                className="absolute top-4 right-4 px-4 py-2 bg-[#0a0a0a]/80 hover:bg-[#e50914] text-white rounded-lg backdrop-blur-sm transition-all duration-300 font-semibold border border-[#2a2a2a] hover:border-[#e50914]"
              >
                Change Photo
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
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
                  <span>Processing Photo...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Generate Try-On Result</span>
                </div>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
