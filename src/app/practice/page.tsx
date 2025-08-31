'use client'

import { useState, useEffect } from 'react'
import { supabase, JapaneseKanji } from '@/lib/supabase'
import PracticeCard from './components/PracticeCard'
import PracticeSettings from './components/PracticeSettings'
import PracticeResults from './components/PracticeResults'

export interface PracticeSettings {
  level: string
  shuffle: boolean
  questionType: 'meaning' | 'pronunciation' | 'both'
  characterCount: number
}

export interface QuizQuestion {
  kanji: JapaneseKanji
  question: string
  correctAnswer: string
  options: string[]
  userAnswer?: string
  isCorrect?: boolean
}

export default function PracticePage() {
  const [settings, setSettings] = useState<PracticeSettings>({
    level: 'all',
    shuffle: false,
    questionType: 'meaning',
    characterCount: 10
  })
  
  const [kanjiPool, setKanjiPool] = useState<JapaneseKanji[]>([])
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isPracticing, setIsPracticing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<{
    total: number
    correct: number
    incorrect: number
    questions: QuizQuestion[]
  } | null>(null)

  useEffect(() => {
    if (isPracticing && kanjiPool.length > 0) {
      generateQuiz()
    }
  }, [isPracticing, kanjiPool, settings])

  useEffect(() => {
    if (kanjiPool.length > 0 && isPracticing) {
      generateQuiz()
    }
  }, [kanjiPool])

  const fetchKanjiForLevel = async (level: string) => {
    setLoading(true)
    try {
      let query = supabase
        .from('japanese_kanjii')
        .select('*')
        .limit(10000) // Get all characters

      if (level !== 'all') {
        query = query.eq('level', level)
      }

      const { data, error } = await query
      if (error) throw error

      let kanji = data || []
      
      // If shuffle is enabled, shuffle the array
      if (settings.shuffle) {
        kanji = [...kanji].sort(() => Math.random() - 0.5)
      }

      setKanjiPool(kanji)
      console.log(`Loaded ${kanji.length} kanji for level: ${level}`)
    } catch (err) {
      console.error('Error fetching kanji:', err)
    } finally {
      setLoading(false)
    }
  }

  const generateQuiz = () => {
    if (kanjiPool.length === 0) return

    const questions: QuizQuestion[] = []
    const usedKanji = new Set<string>()

    // Limit the number of kanji to practice based on settings
    const maxKanji = Math.min(settings.characterCount, kanjiPool.length)
    let kanjiCount = 0

    // Generate questions for each kanji in the pool (limited by characterCount)
    for (const kanji of kanjiPool) {
      if (kanjiCount >= maxKanji) break
      if (usedKanji.has(kanji.letter)) continue
      
      usedKanji.add(kanji.letter)
      kanjiCount++

      let question: QuizQuestion

      if (settings.questionType === 'meaning') {
        question = generateMeaningQuestion(kanji, kanjiPool)
      } else if (settings.questionType === 'pronunciation') {
        question = generatePronunciationQuestion(kanji, kanjiPool)
      } else {
        // Both - randomly choose between meaning and pronunciation
        question = Math.random() > 0.5 
          ? generateMeaningQuestion(kanji, kanjiPool)
          : generatePronunciationQuestion(kanji, kanjiPool)
      }

      questions.push(question)
    }

    // Shuffle questions if enabled
    if (settings.shuffle) {
      questions.sort(() => Math.random() - 0.5)
    }

    setCurrentQuestions(questions)
    setCurrentQuestionIndex(0)
    setResults(null)
  }

  const generateMeaningQuestion = (kanji: JapaneseKanji, allKanji: JapaneseKanji[]): QuizQuestion => {
    const correctAnswer = kanji.name
    const options = [correctAnswer]
    
    // Get 3 random wrong answers from other kanji
    const otherKanji = allKanji.filter(k => k.letter !== kanji.letter)
    const shuffledOthers = [...otherKanji].sort(() => Math.random() - 0.5)
    
    for (let i = 0; i < 3 && i < shuffledOthers.length; i++) {
      if (!options.includes(shuffledOthers[i].name)) {
        options.push(shuffledOthers[i].name)
      }
    }
    
    // Shuffle the options
    const shuffledOptions = options.sort(() => Math.random() - 0.5)
    
    return {
      kanji,
      question: `What does the kanji "${kanji.letter}" mean?`,
      correctAnswer,
      options: shuffledOptions
    }
  }

  const generatePronunciationQuestion = (kanji: JapaneseKanji, allKanji: JapaneseKanji[]): QuizQuestion => {
    const correctAnswer = kanji.sound_equiv
    const options = [correctAnswer]
    
    // Get 3 random wrong answers from other kanji
    const otherKanji = allKanji.filter(k => k.letter !== kanji.letter)
    const shuffledOthers = [...otherKanji].sort(() => Math.random() - 0.5)
    
    for (let i = 0; i < 3 && i < shuffledOthers.length; i++) {
      if (!options.includes(shuffledOthers[i].sound_equiv)) {
        options.push(shuffledOthers[i].sound_equiv)
      }
    }
    
    // Shuffle the options
    const shuffledOptions = options.sort(() => Math.random() - 0.5)
    
    return {
      kanji,
      question: `How do you pronounce the kanji "${kanji.letter}"?`,
      correctAnswer,
      options: shuffledOptions
    }
  }

  const handleAnswer = (answer: string) => {
    const currentQuestion = currentQuestions[currentQuestionIndex]
    const isCorrect = answer === currentQuestion.correctAnswer
    
    // Update the question with user's answer
    const updatedQuestions = [...currentQuestions]
    updatedQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      userAnswer: answer,
      isCorrect
    }
    setCurrentQuestions(updatedQuestions)

    // Move to next question or finish
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      finishPractice()
    }
  }

  const finishPractice = () => {
    const correct = currentQuestions.filter(q => q.isCorrect).length
    const incorrect = currentQuestions.filter(q => !q.isCorrect).length
    
    setResults({
      total: currentQuestions.length,
      correct,
      incorrect,
      questions: currentQuestions
    })
    
    setIsPracticing(false)
  }

  const startPractice = () => {
    if (kanjiPool.length === 0) {
      fetchKanjiForLevel(settings.level)
    }
    setIsPracticing(true)
  }

  const resetPractice = () => {
    setCurrentQuestions([])
    setCurrentQuestionIndex(0)
    setIsPracticing(false)
    setResults(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading kanji for practice...</p>
        </div>
      </div>
    )
  }

  if (results) {
    return (
      <PracticeResults 
        results={results} 
        onRestart={resetPractice}
        onNewPractice={() => {
          resetPractice()
          fetchKanjiForLevel(settings.level)
        }}
      />
    )
  }

  if (isPracticing && currentQuestions.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Question {currentQuestionIndex + 1} of {currentQuestions.length}
              </span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {Math.round(((currentQuestionIndex + 1) / currentQuestions.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Current Question */}
          <PracticeCard 
            question={currentQuestions[currentQuestionIndex]}
            onAnswer={handleAnswer}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Kanji Practice
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Test your knowledge of Japanese kanji characters
          </p>
        </div>

        {/* Practice Settings */}
        <PracticeSettings 
          settings={settings}
          onSettingsChange={setSettings}
          onStartPractice={startPractice}
          kanjiCount={kanjiPool.length}
        />

        {/* Instructions */}
        <div className="mt-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-8 border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 text-sm text-slate-600 dark:text-slate-400">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Choose Settings</h3>
              <p>Select your difficulty level and practice mode</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Answer Questions</h3>
              <p>Test your knowledge of kanji meanings and pronunciations</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Review Results</h3>
              <p>See your performance and track your progress</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}