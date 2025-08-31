'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase, LanguageCard } from '@/lib/supabase'
import Flashcard from './flashcard'

interface FlashcardGridProps {
  language?: 'japanese' | 'thai'
  script?: 'kanji' | 'hiragana' | 'katakana' | 'consonants' | 'vowels' | 'tones'
  level?: string
  limit?: number
}

export default function FlashcardGrid({ 
  language = 'japanese', 
  script = 'kanji', 
  level, 
  limit = 12 
}: FlashcardGridProps) {
  const [cards, setCards] = useState<LanguageCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCards = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let tableName = ''
      if (language === 'japanese') {
        if (script === 'kanji') tableName = 'japanese_kanjii'
        else if (script === 'hiragana') tableName = 'japanese_hiragana'
        else if (script === 'katakana') tableName = 'japanese_katakana'
      } else if (language === 'thai') {
        if (script === 'consonants') tableName = 'thai_consonants'
        else if (script === 'vowels') tableName = 'thai_vowels'
        else if (script === 'tones') tableName = 'thai_tones'
      }

      if (!tableName) {
        setError('Invalid language or script combination')
        return
      }

      let query = supabase
        .from(tableName)
        .select('*')
        .limit(limit)

      if (level) {
        query = query.eq('level', level)
      }

      const { data, error: supabaseError } = await query

      if (supabaseError) {
        throw supabaseError
      }

      setCards(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cards')
    } finally {
      setLoading(false)
    }
  }, [language, script, level, limit])

  useEffect(() => {
    fetchCards()
  }, [fetchCards])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 p-8">
        <p>Error: {error}</p>
        <button 
          onClick={fetchCards}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-400 p-8">
        <p>No cards found for the selected criteria.</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {language.charAt(0).toUpperCase() + language.slice(1)} {script.charAt(0).toUpperCase() + script.slice(1)}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {cards.length} cards available
          {level && ` • Level: ${level}`}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <Flashcard 
            key={`${card.letter}-${index}`} 
            card={card}
            className="mx-auto"
          />
        ))}
      </div>
    </div>
  )
}