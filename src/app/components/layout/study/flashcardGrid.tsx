'use client'

import { useEffect, useState } from 'react'
import { createClientBrowser, LanguageCard } from '@/lib/supabase'
import Flashcard from './flashcard'

interface FlashcardGridProps {
  language: string
  script: string
  limit?: number
}

export default function FlashcardGrid({ language, script, limit = 8 }: FlashcardGridProps) {
  const [cards, setCards] = useState<LanguageCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const supabase = createClientBrowser()
        const query = supabase
          .from(`${language}_${script}`)
          .select('*')
          .limit(limit)

        const { data, error } = await query

        if (error) {
          console.error('Error fetching cards:', error)
        } else {
          setCards(data || [])
        }
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCards()
  }, [language, script, limit])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No cards found for {language} {script}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Flashcard key={card.id} card={card} />
      ))}
    </div>
  )
}