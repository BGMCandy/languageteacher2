'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClientBrowser } from '@/lib/supabase'
import KanjiQuiz from './components/KanjiQuiz'
import QuizResults from './components/QuizResults'
import { QuizResult } from './components/KanjiQuiz'

interface QuizConfig {
  language: string
  component: string
  questionCount: number
  levels: string[]
  quizType: 'pronunciation' | 'meaning' | 'mixed'
}

export default function QuizPage() {
  const [config, setConfig] = useState<QuizConfig>({
    language: '',
    component: '',
    questionCount: 10,
    levels: [],
    quizType: 'mixed'
  })
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizResults, setQuizResult] = useState<QuizResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [retakeCount, setRetakeCount] = useState(0)
  const [availableLevels, setAvailableLevels] = useState<string[]>([])
  const [loadingLevels, setLoadingLevels] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)

  const languages = [
    { id: 'japanese', name: 'Japanese', icon: '日本語' },
    { id: 'chinese', name: 'Chinese', icon: '中文' },
    { id: 'korean', name: 'Korean', icon: '한국어' },
    { id: 'spanish', name: 'Spanish', icon: 'ES' },
    { id: 'french', name: 'French', icon: 'FR' },
    { id: 'german', name: 'German', icon: 'DE' }
  ]

  const components = {
    japanese: [
      { id: 'kanji', name: 'Kanji', description: 'Japanese characters' },
      { id: 'vocabulary', name: 'Vocabulary', description: 'Words and phrases' },
      { id: 'grammar', name: 'Grammar', description: 'Sentence structure' },
      { id: 'hiragana', name: 'Hiragana', description: 'Japanese syllabary' },
      { id: 'katakana', name: 'Katakana', description: 'Japanese syllabary' }
    ],
    chinese: [
      { id: 'characters', name: 'Characters', description: 'Chinese characters' },
      { id: 'vocabulary', name: 'Vocabulary', description: 'Words and phrases' },
      { id: 'grammar', name: 'Grammar', description: 'Sentence structure' }
    ],
    korean: [
      { id: 'hangul', name: 'Hangul', description: 'Korean alphabet' },
      { id: 'vocabulary', name: 'Vocabulary', description: 'Words and phrases' },
      { id: 'grammar', name: 'Grammar', description: 'Sentence structure' }
    ],
    spanish: [
      { id: 'vocabulary', name: 'Vocabulary', description: 'Words and phrases' },
      { id: 'grammar', name: 'Grammar', description: 'Sentence structure' },
      { id: 'conjugation', name: 'Conjugation', description: 'Verb forms' }
    ],
    french: [
      { id: 'vocabulary', name: 'Vocabulary', description: 'Words and phrases' },
      { id: 'grammar', name: 'Grammar', description: 'Sentence structure' },
      { id: 'conjugation', name: 'Conjugation', description: 'Verb forms' }
    ],
    german: [
      { id: 'vocabulary', name: 'Vocabulary', description: 'Words and phrases' },
      { id: 'grammar', name: 'Grammar', description: 'Sentence structure' },
      { id: 'cases', name: 'Cases', description: 'Noun cases' }
    ]
  }

  const questionCounts = [5, 10, 20, 30, 40, 50]
  const quizTypes = [
    { id: 'pronunciation', name: 'Pronunciation', description: 'Test reading skills' },
    { id: 'meaning', name: 'Meaning', description: 'Test understanding' },
    { id: 'mixed', name: 'Mixed', description: 'Test everything' }
  ]

  // Fetch available levels from database
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        setLoadingLevels(true)
        console.log('Starting to fetch levels...')
        
        const supabase = createClientBrowser()
        console.log('Supabase client created')
        
        // First get the total count
        const { count, error: countError } = await supabase
          .from('japanese_kanji')
          .select('*', { count: 'exact', head: true })
        
        if (countError) {
          console.error('Error getting count:', countError)
          return
        }
        
        console.log(`Total kanji in database: ${count}`)
        
        // Fetch all levels in chunks to bypass any limits
        let allLevels: string[] = []
        const chunkSize = 1000
        let offset = 0
        
        while (offset < (count || 0)) {
          const { data: chunk, error: chunkError } = await supabase
            .from('japanese_kanji')
            .select('level')
            .not('level', 'is', null)
            .range(offset, offset + chunkSize - 1)
          
          if (chunkError) {
            console.error('Error fetching chunk:', chunkError)
            break
          }
          
          if (chunk && chunk.length > 0) {
            allLevels = [...allLevels, ...chunk.map(item => item.level)]
            console.log(`Fetched chunk: ${chunk.length} kanji (total levels: ${allLevels.length})`)
          }
          
          offset += chunkSize
        }
        
        console.log(`Total levels fetched: ${allLevels.length}`)
        
        // Get unique levels
        const uniqueLevels = [...new Set(allLevels)]
        console.log('Unique levels found:', uniqueLevels)
        
        // Sort levels logically: Level 1-6 first, then Secondary
        const sortedLevels = uniqueLevels.sort((a, b) => {
          if (a.startsWith('Level ') && b.startsWith('Level ')) {
            const aNum = parseInt(a.replace('Level ', ''))
            const bNum = parseInt(b.replace('Level ', ''))
            return aNum - bNum
          }
          if (a === 'Secondary') return 1
          if (b === 'Secondary') return -1
          return a.localeCompare(b)
        })
        
        console.log('Sorted levels:', sortedLevels)
        setAvailableLevels(sortedLevels)
        
      } catch (err) {
        console.error('Error fetching levels:', err)
      } finally {
        setLoadingLevels(false)
      }
    }

    fetchLevels()
  }, [])

  const handleStartQuiz = () => {
    if (!config.language || !config.component) return
    
    console.log('Starting quiz with config:', config)
    setQuizStarted(true)
  }

  const handleQuizComplete = (results: QuizResult[]) => {
    console.log('Quiz completed with results:', results)
    setQuizResult(results)
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
    setQuizResult([])
  }

  const toggleLevel = (level: string) => {
    setConfig(prev => ({
      ...prev,
      levels: prev.levels.includes(level)
        ? prev.levels.filter(l => l !== level)
        : [...prev.levels, level]
    }))
  }

  const handleLanguageSelect = (languageId: string) => {
    setConfig(prev => ({ ...prev, language: languageId }))
    // Auto-advance to next step and scroll to top
    setTimeout(() => {
      setCurrentStep(1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 300)
  }

  const handleComponentSelect = (componentId: string) => {
    setConfig(prev => ({ ...prev, component: componentId }))
    // Auto-advance to next step and scroll to top
    setTimeout(() => {
      setCurrentStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 300)
  }

  const nextStep = () => {
    if (currentStep < 3) {
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
      case 0: return config.language !== ''
      case 1: return config.component !== ''
      case 2: return true // Quiz settings can always proceed
      case 3: return true // Final step
      default: return false
    }
  }

  if (quizStarted) {
    return (
      <KanjiQuiz key={retakeCount} 
        config={{
          questionCount: config.questionCount,
          levels: config.levels,
          quizType: config.quizType
        }} 
        onComplete={handleQuizComplete}
      />
    )
  }

  if (showResults) {
    return (
      <QuizResults 
        results={quizResults}
        onRetake={handleRetake}
        onBackToQuiz={handleBackToSetup}
      />
    )
  }

  const steps = [
    {
      title: 'SELECT LANGUAGE',
      content: (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {languages.map((language) => (
            <button
              key={language.id}
              onClick={() => {
                if (language.id === 'japanese') {
                  handleLanguageSelect('japanese')
                }
              }}
              disabled={language.id !== 'japanese'}
              className={`p-4 md:p-6 border-2 transition-all hover:font-bangers cursor-pointer ${
                language.id === 'japanese'
                  ? config.language === language.id
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 hover:border-black'
                  : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <div className="text-2xl md:text-3xl mb-2 font-medium">{language.icon}</div>
              <div className="text-sm md:text-base font-semibold">{language.name}</div>
            </button>
          ))}
        </div>
      )
    },
    {
      title: 'SELECT COMPONENT',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {components[config.language as keyof typeof components]?.map((component) => (
            <button
              key={component.id}
              onClick={() => {
                if (component.id === 'kanji') {
                  handleComponentSelect('kanji')
                }
              }}
              disabled={component.id !== 'kanji'}
              className={`p-4 md:p-6 border-2 text-left transition-all hover:font-bangers cursor-pointer ${
                component.id === 'kanji'
                  ? config.component === component.id
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 hover:border-black'
                  : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
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

          {/* Level Selection */}
          <div>
            <h3 className="text-sm md:text-base font-semibold text-black mb-2 md:mb-3 tracking-wider">
              SELECT LEVELS {config.levels.length > 0 && `(${config.levels.length} selected)`}
            </h3>
            <p className="text-xs text-gray-600 mb-2 md:mb-3">Leave empty to include all levels</p>
            
            {loadingLevels ? (
              <div className="text-gray-500 text-xs md:text-sm">Loading levels...</div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
                {availableLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => toggleLevel(level)}
                    className={`p-2 md:p-3 border-2 transition-all hover:font-bangers cursor-pointer text-xs md:text-sm ${
                      config.levels.includes(level)
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-black'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Custom Lists - Coming Soon */}
          <div>
            <h3 className="text-sm md:text-base font-semibold text-black mb-2 md:mb-3 tracking-wider">
              CUSTOM LISTS
            </h3>
            <div className="border-2 border-dashed border-gray-300 bg-gray-50 p-4 md:p-6 text-center">
              <div className="text-gray-500 text-sm md:text-base font-medium mb-1">
                Select Custom Lists
              </div>
              <div className="text-gray-400 text-xs md:text-sm">
                Coming Soon
              </div>
              <div className="text-gray-400 text-xs mt-2">
                Create your own study lists with specific kanji
              </div>
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
          <h1 className="text-xl md:text-2xl font-bold text-black tracking-wider mb-2 md:mb-3">QUIZ SETUP</h1>
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
