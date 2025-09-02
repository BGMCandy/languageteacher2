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

        <div className="flex justify-center mb-8">
          <p>Coming soon..</p>
        </div>
      </div>
    </div>
  )
}