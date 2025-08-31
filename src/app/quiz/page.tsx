'use client'

import { useState } from 'react'
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

  const languages = [
    { id: 'japanese', name: 'Japanese', icon: '🇯🇵' },
    { id: 'chinese', name: 'Chinese', icon: '🇨🇳' },
    { id: 'korean', name: 'Korean', icon: '🇰🇷' },
    { id: 'spanish', name: 'Spanish', icon: '🇪🇸' },
    { id: 'french', name: 'French', icon: '🇫🇷' },
    { id: 'german', name: 'German', icon: '🇩🇪' }
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

  const questionCounts = [5, 10, 20, 30]
  const quizTypes = [
    { id: 'pronunciation', name: 'Pronunciation', description: 'Test reading skills' },
    { id: 'meaning', name: 'Meaning', description: 'Test understanding' },
    { id: 'mixed', name: 'Mixed', description: 'Test everything' }
  ]

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
    
    // TODO: Save results to Supabase
    // TODO: Show results summary
  }

  const handleRetake = () => {
    setShowResults(false)
    setQuizStarted(true)
  }

  const handleBackToQuiz = () => {
    setShowResults(false)
    setQuizResult([])
  }

  // If quiz is started, show the quiz component
  if (quizStarted && config.language === 'japanese' && config.component === 'kanji') {
    return (
      <KanjiQuiz 
        config={{
          questionCount: config.questionCount,
          levels: config.levels,
          quizType: config.quizType
        }}
        onComplete={handleQuizComplete}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Language Quiz
        </h1>

        {/* Language Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Choose Language</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setConfig({ ...config, language: lang.id, component: '' })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  config.language === lang.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-2">{lang.icon}</div>
                <div className="font-medium text-gray-800">{lang.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Component Selection */}
        {config.language && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Choose Component</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {components[config.language as keyof typeof components]?.map((comp) => (
                <button
                  key={comp.id}
                  onClick={() => setConfig({ ...config, component: comp.id })}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    config.component === comp.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-800 mb-1">{comp.name}</div>
                  <div className="text-sm text-gray-600">{comp.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quiz Configuration */}
        {config.component && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Quiz Settings</h2>
            
            {/* Question Count */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <div className="flex gap-2">
                {questionCounts.map((count) => (
                  <button
                    key={count}
                    onClick={() => setConfig({ ...config, questionCount: count })}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      config.questionCount === count
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Quiz Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quiz Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quizTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setConfig({ ...config, quizType: type.id as 'pronunciation' | 'meaning' | 'mixed' })}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      config.quizType === type.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-800 mb-1">{type.name}</div>
                    <div className="text-sm text-gray-600">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Level Selection for Japanese Kanji */}
            {config.language === 'japanese' && config.component === 'kanji' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Levels (Optional - leave empty for all levels)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'].map((level) => (
                    <button
                      key={level}
                      onClick={() => {
                        const newLevels = config.levels.includes(level)
                          ? config.levels.filter(l => l !== level)
                          : [...config.levels, level]
                        setConfig({ ...config, levels: newLevels })
                      }}
                      className={`px-3 py-2 rounded-lg border-2 text-sm transition-all ${
                        config.levels.includes(level)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Start Quiz Button */}
            <div className="text-center">
              <button
                onClick={handleStartQuiz}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!config.language || !config.component}
              >
                Start Quiz
              </button>
            </div>
          </div>
        )}

        {/* Results Display */}
        {showResults && quizResults.length > 0 && (
          <QuizResults 
            results={quizResults} 
            onRetake={handleRetake} 
            onBackToQuiz={handleBackToQuiz} 
          />
        )}
      </div>
    </div>
  )
}
