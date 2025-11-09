'use client'

import { useState, useEffect } from 'react'
import ClothUpload from '@/components/ClothUpload'
import PersonUpload from '@/components/PersonUpload'
import TryOnResult from '@/components/TryOnResult'
import { Sparkles, Shirt, User, CheckCircle2 } from 'lucide-react'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const [clothData, setClothData] = useState<{
    file: File | null
    category: string
    processedPath: string
  }>({
    file: null,
    category: 'upper_body',
    processedPath: ''
  })
  
  const [personData, setPersonData] = useState<{
    file: File | null
    processedPath: string
  }>({
    file: null,
    processedPath: ''
  })
  
  const [resultPath, setResultPath] = useState<string>('')

  const handleClothUpload = (data: any) => {
    setClothData(data)
    setStep(2)
  }

  const handlePersonUpload = (data: any) => {
    setPersonData(data)
    setStep(3)
  }

  const handleTryOnComplete = (result: string) => {
    setResultPath(result)
  }

  const resetFlow = () => {
    setStep(1)
    setClothData({ file: null, category: 'upper_body', processedPath: '' })
    setPersonData({ file: null, processedPath: '' })
    setResultPath('')
  }
  
  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#e50914]/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#e50914]/5 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a0a]/80 border-b border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-[#e50914] blur-xl opacity-50 rounded-full" />
                <Sparkles className="w-10 h-10 text-[#e50914] relative" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">
                  <span className="text-white">Look</span>
                  <span className="text-[#e50914]">1nce</span>
                </h1>
                <p className="text-xs text-[#808080] tracking-wider uppercase">AI Virtual Try-On</p>
              </div>
            </div>
            <button 
              onClick={resetFlow}
              className="px-6 py-2.5 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white rounded-lg border border-[#2a2a2a] hover:border-[#e50914]/50 transition-all duration-300 font-semibold"
            >
              Start Over
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        {step === 1 && (
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              <span className="text-white">Try On Clothes</span>
              <br />
              <span className="bg-gradient-to-r from-[#e50914] to-[#ff6b6b] bg-clip-text text-transparent">
                Instantly
              </span>
            </h2>
            <p className="text-xl text-[#b3b3b3] max-w-2xl mx-auto">
              Upload a clothing image and see how it looks on you using advanced AI technology
            </p>
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-16">
          <div className="flex items-center justify-center space-x-8">
            <StepIndicator 
              number={1} 
              active={step === 1} 
              completed={step > 1} 
              label="Choose Outfit"
              icon={<Shirt className="w-5 h-5" />}
            />
            <div className={`h-1 w-32 rounded-full transition-all duration-500 ${step > 1 ? 'bg-gradient-to-r from-[#e50914] to-[#ff6b6b]' : 'bg-[#2a2a2a]'}`} />
            
            <StepIndicator 
              number={2} 
              active={step === 2} 
              completed={step > 2} 
              label="Upload Photo"
              icon={<User className="w-5 h-5" />}
            />
            <div className={`h-1 w-32 rounded-full transition-all duration-500 ${step > 2 ? 'bg-gradient-to-r from-[#e50914] to-[#ff6b6b]' : 'bg-[#2a2a2a]'}`} />
            
            <StepIndicator 
              number={3} 
              active={step === 3} 
              completed={!!resultPath} 
              label="See Result"
              icon={<Sparkles className="w-5 h-5" />}
            />
          </div>
        </div>

        {/* Content Cards */}
        <div className="max-w-4xl mx-auto">
          {step === 1 && (
            <div className="animate-slide-up">
              <ClothUpload onUploadComplete={handleClothUpload} />
            </div>
          )}

          {step === 2 && (
            <div className="animate-slide-up">
              <PersonUpload onUploadComplete={handlePersonUpload} />
            </div>
          )}

          {step === 3 && (
            <div className="animate-slide-up">
              <TryOnResult
                clothPath={clothData.processedPath}
                personPath={personData.processedPath}
                category={clothData.category}
                onComplete={handleTryOnComplete}
                onReset={resetFlow}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-[#2a2a2a] bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-[#808080] text-sm">
            <p>&copy; 2025 Look1nce. Powered by AI Magic ✨</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function StepIndicator({ 
  number, 
  active, 
  completed, 
  label,
  icon 
}: { 
  number: number
  active: boolean
  completed: boolean
  label: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center space-y-3">
      <div className={`
        step-indicator
        ${active ? 'active scale-110' : ''}
        ${completed ? 'completed' : ''}
        relative group
      `}>
        {completed ? <CheckCircle2 className="w-6 h-6" /> : icon}
        
        {active && (
          <div className="absolute inset-0 rounded-full bg-[#e50914] blur-xl opacity-50 animate-pulse" />
        )}
      </div>
      <span className={`text-sm font-semibold transition-colors duration-300 ${
        active ? 'text-[#e50914]' : completed ? 'text-[#4ade80]' : 'text-[#808080]'
      }`}>
        {label}
      </span>
    </div>
  )
}
