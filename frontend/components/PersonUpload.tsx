'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, Camera, Loader2, ArrowLeft } from 'lucide-react'
import Webcam from 'react-webcam'
import { preprocessPerson } from '@/lib/api'

interface PersonUploadProps {
  onUploadComplete: (data: { file: File; processedPath: string }) => void
  onBack: () => void
}

export default function PersonUpload({ onUploadComplete, onBack }: PersonUploadProps) {
  const [mode, setMode] = useState<'upload' | 'camera'>('upload')
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
    }
  }

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      setPreview(imageSrc)
      setShowCamera(false)
      
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'captured-photo.jpg', { type: 'image/jpeg' })
          setFile(file)
        })
    }
  }, [webcamRef])

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
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-text-muted hover:text-white transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h2 className="text-3xl font-bold text-white">Upload Your Photo</h2>
        <div className="w-20" />
      </div>

      <div className="space-y-6">
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => {
              setMode('upload')
              setShowCamera(false)
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              mode === 'upload'
                ? 'bg-gradient-to-r from-[#e50914] to-[#c40812] text-white shadow-lg shadow-red-900/30'
                : 'bg-[#1a1a1a] text-text-light border border-border-dark hover:bg-bg-card-hover hover:border-primary/50'
            }`}
          >
            <Upload className="w-5 h-5 inline mr-2" />
            Upload Photo
          </button>
          <button
            onClick={() => {
              setMode('camera')
              setShowCamera(true)
              setPreview('')
              setFile(null)
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              mode === 'camera'
                ? 'bg-gradient-to-r from-[#e50914] to-[#c40812] text-white shadow-lg shadow-red-900/30'
                : 'bg-[#1a1a1a] text-text-light border border-border-dark hover:bg-bg-card-hover hover:border-primary/50'
            }`}
          >
            <Camera className="w-5 h-5 inline mr-2" />
            Use Camera
          </button>
        </div>

        {mode === 'upload' && !showCamera && (
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
                    alt="Person preview" 
                    className="max-h-96 mx-auto rounded-lg"
                  />
                </div>
                <p className="text-sm text-text-light">Click to change image</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-16 h-16 mx-auto text-text-muted" />
                <div>
                  <p className="text-lg font-semibold text-white">
                    Click to upload your photo
                  </p>
                  <p className="text-sm text-text-light mt-2">
                    Best results with:
                  </p>
                  <ul className="text-xs text-text-light mt-1 space-y-1">
                    <li>• Person facing camera</li>
                    <li>• Upper body visible</li>
                    <li>• Good lighting</li>
                    <li>• Neutral pose</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {showCamera && mode === 'camera' && (
          <div className="space-y-4">
            {!preview ? (
              <>
                <div className="rounded-lg overflow-hidden border-2 border-border-dark">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    className="w-full"
                    videoConstraints={{
                      facingMode: 'user'
                    }}
                  />
                </div>
                <button
                  onClick={capturePhoto}
                  className="btn-primary w-full"
                >
                  <Camera className="w-5 h-5 inline mr-2" />
                  Capture Photo
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="image-preview">
                  <img 
                    src={preview} 
                    alt="Captured photo" 
                    className="max-h-96 mx-auto rounded-lg"
                  />
                </div>
                <button
                  onClick={() => {
                    setPreview('')
                    setFile(null)
                  }}
                  className="btn-secondary w-full"
                >
                  Retake Photo
                </button>
              </div>
            )}
          </div>
        )}

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
            <span>Continue to Try-On</span>
          )}
        </button>
      </div>
    </div>
  )
}
