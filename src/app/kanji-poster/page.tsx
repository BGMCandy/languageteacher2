'use client'

import { useEffect, useState } from 'react'
import { createClientBrowser, JapaneseKanji } from '@/lib/supabase'

export default function KanjiPoster() {
  const [kanji, setKanji] = useState<JapaneseKanji[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchKanji = async () => {
      try {
        const supabase = createClientBrowser()
        const { data, error } = await supabase
          .from('japanese_kanji')
          .select('*')
          .order('level')

        if (error) {
          console.error('Error fetching kanji:', error)
        } else {
          setKanji(data || [])
        }
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchKanji()
  }, [])

  if (loading) {
    return <div className="p-8 text-center">Loading kanji...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Japanese Kanji Poster
        </h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {kanji.map((k) => (
            <div
              key={k.id}
              className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {k.letter}
              </div>
              <div className="text-sm text-gray-600 mb-1">{k.reading}</div>
              <div className="text-xs text-gray-500">{k.name}</div>
              <div className="text-xs text-blue-600 font-medium mt-1">
                Level {k.level}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
