'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ThaiQuiz from './components/ThaiQuiz'
import ThaiQuizResults from './components/ThaiQuizResults'
import { ThaiQuizResult } from './components/ThaiQuiz'

interface QuizConfig {
  component: string
  questionCount: number
  quizType: 'pronunciation' | 'meaning' | 'mixed'
}

export default function ThaiQuizPage() {
  const [config, setConfig] = useState<QuizConfig>({
    component: '',
    questionCount: 10,
    quizType: 'mixed'
  })
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizResults, setQuizResults] = useState<ThaiQuizResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [retakeCount, setRetakeCount] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const components = [
    { id: 'consonants', name: 'Consonants', description: 'Thai consonant characters' },
    { id: 'vowels', name: 'Vowels', description: 'Thai vowel characters' },
    { id: 'tones', name: 'Tones', description: 'Thai tone marks' },
    { id: 'vocabulary', name: 'Vocabulary', description: 'Words and phrases' }
  ]

  const questionCounts = [5, 10, 20, 30, 40, 50]
  const quizTypes = [
    { id: 'pronunciation', name: 'Pronunciation', description: 'Test reading skills' },
    { id: 'meaning', name: 'Meaning', description: 'Test understanding' },
    { id: 'mixed', name: 'Mixed', description: 'Test everything' }
  ]

  const handleComponentSelect = (componentId: string) => {
    setConfig(prev => ({ ...prev, component: componentId }))
    // Auto-advance to next step and scroll to top
    setTimeout(() => {
      setCurrentStep(1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 300)
  }

  const handleStartQuiz = () => {
    if (!config.component) return
    
    console.log('Starting Thai quiz with config:', config)
    setQuizStarted(true)
  }

  const handleQuizComplete = (results: ThaiQuizResult[]) => {
    console.log('Thai quiz completed with results:', results)
    setQuizResults(results)
    setQuizStarted(false)
    setShowResults(true)
  }

  const handleRetake = () => {
    setShowResults(false)
    setRetakeCount(prev => prev + 1)
    setQuizStarted(true)
  }

  const handleBackToSetup = () => {
    setShowResults(false)
    setRetakeCount(prev => prev + 1)
    setQuizStarted(false)
    setCurrentStep(0)
    setQuizResults([])
  }

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
      // Scroll to top when advancing
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      // Scroll to top when going back
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const canGoNext = () => {
    switch (currentStep) {
      case 0: return config.component !== ''
      case 1: return true // Quiz settings can always proceed
      case 2: return true // Final step
      default: return false
    }
  }

  if (quizStarted) {
    return (
      <ThaiQuiz key={retakeCount} 
        config={{
          component: config.component,
          questionCount: config.questionCount,
          quizType: config.quizType
        }} 
        onComplete={handleQuizComplete}
      />
    )
  }

  if (showResults) {
    return (
      <ThaiQuizResults 
        results={quizResults}
        onRetake={handleRetake}
        onBackToQuiz={handleBackToSetup}
      />
    )
  }

  const steps = [
    {
      title: 'SELECT COMPONENT',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {components.map((component) => (
            <button
              key={component.id}
              onClick={() => handleComponentSelect(component.id)}
              className={`p-4 md:p-6 border-2 text-left transition-all hover:font-bangers cursor-pointer ${
                config.component === component.id
                  ? 'border-black bg-black text-white'
                  : 'border-gray-300 hover:border-black'
              }`}
            >
              <div className="text-base md:text-lg font-semibold mb-1">{component.name}</div>
              <div className="text-xs md:text-sm opacity-80">{component.description}</div>
            </button>
          ))}
        </div>
      )
    },
    {
      title: 'QUIZ SETTINGS',
      content: (
        <div className="space-y-4 md:space-y-6">
          {/* Question Count */}
          <div>
            <h3 className="text-sm md:text-base font-semibold text-black mb-2 md:mb-3 tracking-wider">NUMBER OF QUESTIONS</h3>
            <div className="flex gap-2 md:gap-3">
              {questionCounts.map((count) => (
                <button
                  key={count}
                  onClick={() => setConfig(prev => ({ ...prev, questionCount: count }))}
                  className={`w-10 h-10 md:w-12 md:h-12 border-2 transition-all hover:font-bangers cursor-pointer text-sm ${
                    config.questionCount === count
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 hover:border-black'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Quiz Type */}
          <div>
            <h3 className="text-sm md:text-base font-semibold text-black mb-2 md:mb-3 tracking-wider">QUIZ TYPE</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {quizTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setConfig(prev => ({ ...prev, quizType: type.id as 'pronunciation' | 'meaning' | 'mixed' }))}
                  className={`p-3 md:p-4 border-2 transition-all hover:font-bangers cursor-pointer ${
                    config.quizType === type.id
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 hover:border-black'
                  }`}
                >
                  <div className="text-sm md:text-base font-semibold mb-1">{type.name}</div>
                  <div className="text-xs opacity-80">{type.description}</div>
                </button>
              ))}
            </div>
          </div>


        </div>
      )
    },
    {
      title: 'REVIEW & START',
      content: (
        <div className="text-center">
          <button
            onClick={handleStartQuiz}
            className="px-6 md:px-8 py-2 md:py-3 bg-black text-white font-semibold tracking-wider hover:font-bangers transition-all border-2 border-black hover:bg-white hover:text-black cursor-pointer text-sm md:text-base"
          >
            START QUIZ
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="bg-white min-h-screen flex flex-col overflow-hidden">
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-6">
        {/* Header */}
        <div className="text-center mb-4 md:mb-6">
          <div className="flex items-center justify-center space-x-2 md:space-x-3 mb-2 md:mb-3">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-black relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white"></div>
              </div>
            </div>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-black tracking-wider mb-2 md:mb-3">THAI QUIZ</h1>
          <div className="h-px w-16 md:w-24 bg-black mx-auto"></div>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center mb-4 md:mb-6">
          <div className="flex space-x-1 md:space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${
                  index === currentStep ? 'bg-black' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              <div className="h-full flex flex-col">
                <h2 className="text-lg md:text-xl font-semibold text-black mb-3 md:mb-4 tracking-wider text-center">
                  {steps[currentStep].title}
                </h2>
                <div className="flex-1 flex items-center justify-center">
                  {steps[currentStep].content}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-4 md:mt-6">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`px-4 md:px-6 py-2 border-2 transition-all hover:font-bangers cursor-pointer text-xs md:text-sm ${
              currentStep === 0
                ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                : 'border-black hover:bg-black hover:text-white'
            }`}
          >
            BACK
          </button>
          
          <button
            onClick={nextStep}
            disabled={!canGoNext()}
            className={`px-4 md:px-6 py-2 border-2 transition-all hover:font-bangers cursor-pointer text-xs md:text-sm ${
              !canGoNext()
                ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                : 'border-black hover:bg-black hover:text-white'
            }`}
          >
            {currentStep === steps.length - 1 ? 'START QUIZ' : 'NEXT'}
          </button>
        </div>
      </div>
    </div>
  )
}
