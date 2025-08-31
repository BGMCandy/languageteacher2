'use client'

import { useEffect, useState } from 'react'
import { createClientBrowser, JapaneseKanji } from '@/lib/supabase'

export default function Practice() {
  const [kanji, setKanji] = useState<JapaneseKanji[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchKanji = async () => {
      try {
        const supabase = createClientBrowser()
        const { data, error } = await supabase
          .from('japanese_kanji')
          .select('*')
          .limit(10)

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
    return <div className="p-8 text-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Practice
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kanji.map((k) => (
            <div
              key={k.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl font-bold text-gray-800 mb-4 text-center">
                {k.letter}
              </div>
              <div className="text-lg text-gray-600 mb-2">{k.reading}</div>
              <div className="text-gray-500">{k.name}</div>
              <div className="text-sm text-blue-600 font-medium mt-2">
                Level {k.level}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}