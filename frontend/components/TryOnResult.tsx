'use client'

import { useState, useEffect } from 'react'
import { Loader2, RefreshCw, Download, Sparkles } from 'lucide-react'
import { runVirtualTryOn } from '@/lib/api'

interface TryOnResultProps {
  clothPath: string
  personPath: string
  category: string
  onComplete: (resultPath: string) => void
  onReset: () => void
}

export default function TryOnResult({
  clothPath,
  personPath,
  category,
  onComplete,
  onReset
}: TryOnResultProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [resultPath, setResultPath] = useState<string>('')
  const [processingStage, setProcessingStage] = useState<string>('Initializing...')

  useEffect(() => {
    runTryOn()
  }, [])

  const runTryOn = async () => {
    setLoading(true)
    setError('')
    
    const stages = [
      'Analyzing clothing item...',
      'Detecting body pose...',
      'Running AI model...',
      'Generating result...',
      'Finalizing...'
    ]

    let stageIndex = 0
    const stageInterval = setInterval(() => {
      if (stageIndex < stages.length) {
        setProcessingStage(stages[stageIndex])
        stageIndex++
      }
    }, 2000)

    try {
      const result = await runVirtualTryOn(clothPath, personPath, category)
      clearInterval(stageInterval)
      setResultPath(result.result_path)
      onComplete(result.result_path)
      setLoading(false)
    } catch (err: any) {
      clearInterval(stageInterval)
      setError(err.response?.data?.detail || 'Failed to generate try-on result')
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (resultPath) {
      const link = document.createElement('a')
      link.href = `http://localhost:8000/api/result/${resultPath.split('/').pop()}`
      link.download = 'look1nce-result.png'
      link.click()
    }
  }

  return (
    <div className="card">
      <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center space-x-2">
        <Sparkles className="w-6 h-6 text-primary" />
        <span className="text-white">Virtual Try-On Result</span>
      </h2>

      <div className="space-y-6">
        {loading && (
          <div className="text-center py-12 space-y-4">
            <Loader2 className="w-16 h-16 mx-auto animate-spin text-primary" />
            <p className="text-lg font-semibold text-white">{processingStage}</p>
            <p className="text-sm text-text-light">This may take 10-30 seconds...</p>
            <div className="w-full bg-[#2a2a2a] rounded-full h-2 max-w-md mx-auto">
              <div className="bg-gradient-to-r from-[#e50914] to-[#ff6b6b] h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        )}

        {error && (
          <div className="space-y-4">
            <div className="bg-[#3a1414] border border-[#e50914]/50 text-[#ff6b6b] px-4 py-3 rounded-lg">
              {error}
            </div>
            <div className="flex gap-4">
              <button onClick={runTryOn} className="btn-primary flex-1">
                <RefreshCw className="w-5 h-5 inline mr-2" />
                Retry
              </button>
              <button onClick={onReset} className="btn-secondary flex-1">
                Start Over
              </button>
            </div>
          </div>
        )}

        {!loading && !error && resultPath && (
          <div className="space-y-6">
            <div className="relative image-preview">
              <img
                src={`http://localhost:8000/api/result/${resultPath.split('/').pop()}`}
                alt="Try-on result"
                className="w-full max-h-[600px] object-contain rounded-lg"
              />
              <div className="absolute top-4 right-4 bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-green-900/30">
                ✓ Success
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleDownload}
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Download</span>
              </button>
              <button
                onClick={onReset}
                className="btn-secondary flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Try Another</span>
              </button>
            </div>

            <div className="bg-[#1a2a3a] border border-[#3b82f6]/30 rounded-lg p-4">
              <p className="text-sm text-[#93c5fd]">
                <strong className="text-white">Tip:</strong> For best results, use high-quality images with good lighting
                and clear visibility of the clothing item and person.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
