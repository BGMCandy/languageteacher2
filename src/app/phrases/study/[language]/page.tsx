'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'

interface GeneratedPhrase {
  phrase: string
  pinyin?: string[]
  reading_kana?: string
  romaji?: string
  translation_en: string
  literal_en?: string
  meaning: string
  tags: string[]
}

interface StudySession {
  language: string
  level: number
  topic?: string
  currentPhrase: GeneratedPhrase | null
  loading: boolean
  error: string | null
}

export default function StudySessionPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const language = params.language as string
  const level = parseInt(searchParams.get('level') || '1')
  const topic = searchParams.get('topic') || undefined

  const [session, setSession] = useState<StudySession>({
    language,
    level,
    topic,
    currentPhrase: null,
    loading: false,
    error: null
  })

  const [showAnswer, setShowAnswer] = useState(false)
  const [savedPhrases, setSavedPhrases] = useState<GeneratedPhrase[]>([])

  // Generate a new phrase
  const generateNewPhrase = async () => {
    setSession(prev => ({ ...prev, loading: true, error: null }))
    setShowAnswer(false)

    try {
      const response = await fetch('/api/ai/generate-phrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          level,
          topic,
          maxLength: 4
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate phrase')
      }

      const phrase = await response.json()
      setSession(prev => ({ ...prev, currentPhrase: phrase, loading: false }))
    } catch (error) {
      setSession(prev => ({ 
        ...prev, 
        error: 'Failed to generate phrase. Please try again.',
        loading: false 
      }))
    }
  }

  // Save phrase to database
  const savePhrase = async () => {
    if (!session.currentPhrase) return

    try {
      const apiEndpoint = language === 'zh' ? '/api/zh/phrases' : '/api/ja/phrases'
      
      // Parse characters and create links
      const links = session.currentPhrase.phrase.split('').map((char, index) => ({
        [language === 'zh' ? 'char' : 'letter']: char,
        index
      }))

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...session.currentPhrase,
          links
        })
      })

      if (response.ok) {
        setSavedPhrases(prev => [...prev, session.currentPhrase!])
        // Generate new phrase after saving
        generateNewPhrase()
      } else {
        throw new Error('Failed to save phrase')
      }
    } catch (error) {
      setSession(prev => ({ 
        ...prev, 
        error: 'Failed to save phrase. Please try again.' 
      }))
    }
  }

  // Load initial phrase
  useEffect(() => {
    generateNewPhrase()
  }, [])

  const isChinese = language === 'zh'
  const languageName = isChinese ? 'Chinese' : 'Japanese'
  const levelName = isChinese ? `Grade ${level}` : `JLPT N${level}`

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {languageName} Study Session
          </h1>
          <p className="text-lg text-gray-600">
            {levelName} • {topic ? `Topic: ${topic}` : 'General phrases'}
          </p>
        </div>

        {/* Study Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {session.loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating new phrase...</p>
            </div>
          ) : session.error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-red-600 mb-4">{session.error}</p>
              <button 
                onClick={generateNewPhrase}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : session.currentPhrase ? (
            <div className="space-y-6">
              {/* Phrase Display */}
              <div className="text-center">
                <div className="text-6xl font-bold mb-4 chinese-font-extended">
                  {session.currentPhrase.phrase}
                </div>
                
                {isChinese ? (
                  <div className="text-2xl text-gray-600 mb-2">
                    {session.currentPhrase.pinyin?.join(' ')}
                  </div>
                ) : (
                  <div className="text-2xl text-gray-600 mb-2">
                    {session.currentPhrase.reading_kana}
                  </div>
                )}
              </div>

              {/* Answer Section */}
              {showAnswer ? (
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Translation:</h3>
                    <p className="text-lg">{session.currentPhrase.translation_en}</p>
                  </div>
                  
                  {session.currentPhrase.literal_en && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Literal Meaning:</h3>
                      <p className="text-gray-700">{session.currentPhrase.literal_en}</p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Context & Usage:</h3>
                    <p className="text-gray-700">{session.currentPhrase.meaning}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Tags:</h3>
                    <div className="flex flex-wrap gap-2">
                      {session.currentPhrase.tags.map((tag, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <button 
                    onClick={() => setShowAnswer(true)}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Show Answer
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              {showAnswer && (
                <div className="flex justify-center space-x-4">
                  <button 
                    onClick={generateNewPhrase}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Next Phrase
                  </button>
                  <button 
                    onClick={savePhrase}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Save & Continue
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Saved Phrases */}
        {savedPhrases.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Saved Phrases ({savedPhrases.length})
            </h3>
            <div className="space-y-3">
              {savedPhrases.slice(-5).map((phrase, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-lg font-medium chinese-font-extended">{phrase.phrase}</span>
                    <span className="text-gray-600 ml-3">{phrase.translation_en}</span>
                  </div>
                  <div className="text-green-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
