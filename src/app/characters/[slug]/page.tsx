'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import { createClientBrowser } from '@/lib/supabase'
import Link from 'next/link'

interface KanjiEntry {
  kanji: string
  grade: number | null
  jlpt: number | null
  strokes: number | null
  meanings_en: string[]
  on_readings: string[]
  kun_readings: string[]
  jouyou: boolean
}

interface WordEntry {
  seq: number
  headwords: string[]
  readings: string[]
  glosses_en: string[]
  is_common: boolean
}

interface CharacterPageProps {
  params: Promise<{ slug: string }>
}

export default function CharacterPage({ params }: CharacterPageProps) {
  const { slug: rawSlug } = use(params)
  const slug = decodeURIComponent(rawSlug) // Decode URL-encoded characters
  const [kanji, setKanji] = useState<KanjiEntry | null>(null)
  const [words, setWords] = useState<WordEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch words containing the selected kanji using multiple search methods
  const fetchKanjiWords = async (kanjiChar: string): Promise<void> => {
    if (!kanjiChar) return
    
    try {
      const supabase = createClientBrowser()
      
      // Try multiple search methods to find words containing this kanji
      let words: WordEntry[] = []
      let error: Error | null = null
    
      // Method 1: Search in search_text field (most reliable)
      const { data: searchResults, error: searchError } = await supabase
        .from('jmdict_entries')
        .select('seq, headwords, readings, glosses_en, is_common')
        .ilike('search_text', `%${kanjiChar}%`)
        .limit(10)
      
      if (searchError) {
        console.log('Search method 1 failed, trying alternative...', searchError)
        
        // Method 2: Try searching in headwords array using text search
        const { data: headwordResults, error: headwordError } = await supabase
          .from('jmdict_entries')
          .select('seq, headwords, readings, glosses_en, is_common')
          .textSearch('headwords', kanjiChar)
          .limit(10)
        
        if (headwordError) {
          console.log('Search method 2 failed, trying final method...', headwordError)
          
          // Method 3: Use raw SQL-like search in any text field
          const { data: rawResults, error: rawError } = await supabase
            .from('jmdict_entries')
            .select('seq, headwords, readings, glosses_en, is_common')
            .or(`headwords.cs.{${kanjiChar}},readings.cs.{${kanjiChar}}`)
            .limit(10)
          
          if (rawError) {
            error = rawError
          } else {
            words = (rawResults as WordEntry[]) || []
          }
        } else {
          words = (headwordResults as WordEntry[]) || []
        }
      } else {
        words = (searchResults as WordEntry[]) || []
      }
      
      if (error) {
        console.error('All search methods failed:', error)
        return
      }
      
      setWords(words)
      console.log(`Found ${words.length} words containing kanji: ${kanjiChar}`)
      
    } catch (err) {
      console.error('Error fetching kanji words:', err)
    }
  }

  useEffect(() => {
    async function fetchKanjiData(): Promise<void> {
      try {
        setLoading(true)
        
        const supabase = createClientBrowser()
        
        // Fetch kanji details
        const { data: kanjiData, error: kanjiError } = await supabase
          .from('kanjidic2')
          .select('*')
          .eq('kanji', slug)
          .maybeSingle()

        if (kanjiError) {
          console.error('Kanji query error:', kanjiError)
          throw new Error(`Database error: ${kanjiError.message}`)
        }

        if (!kanjiData) {
          throw new Error(`Kanji character "${slug}" not found in database`)
        }

        setKanji(kanjiData as KanjiEntry)

        // Fetch words containing this kanji using multiple search methods
        await fetchKanjiWords(slug)

      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchKanjiData()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading character...</p>
        </div>
      </div>
    )
  }

  if (error || !kanji) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Character Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested character could not be found.'}</p>
          <Link href="/dictionary" className="btn-3">
            Back to Dictionary
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">

<div
  className="absolute bottom-[-5%] right-[-5%] h-[80vh] w-[80vh]
             flex items-center justify-center
             pointer-events-none select-none
             text-[60vh] font-bold leading-none
             text-black/10 dark:text-white/10"
>
  {kanji.kanji}
</div>


      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dictionary" className="text-gray-600 hover:text-black transition-colors mb-4 inline-block">
            ← Back to Dictionary
          </Link>
          <h1 className="text-4xl font-bold text-black mb-2">{kanji.kanji}</h1>
          <div className="h-px w-24 bg-black"></div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Character Details */}
          <div className="space-y-6">
            <div className="border-2 border-black p-6">
              <h2 className="text-xl font-bold text-black mb-4 tracking-wider">CHARACTER DETAILS</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-black mb-2">Meanings</h3>
                  <div className="flex flex-wrap gap-2">
                    {kanji.meanings_en.map((meaning, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-black text-sm">
                        {meaning}
                      </span>
                    ))}
                  </div>
                </div>

                {kanji.on_readings.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-black mb-2">On-readings (音読み)</h3>
                    <div className="flex flex-wrap gap-2">
                      {kanji.on_readings.map((reading, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-black text-sm">
                          {reading}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {kanji.kun_readings.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-black mb-2">Kun-readings (訓読み)</h3>
                    <div className="flex flex-wrap gap-2">
                      {kanji.kun_readings.map((reading, index) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-black text-sm">
                          {reading}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <h3 className="font-semibold text-black mb-1">Strokes</h3>
                    <p className="text-gray-600">{kanji.strokes || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-1">Grade</h3>
                    <p className="text-gray-600">{kanji.grade || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-1">JLPT</h3>
                    <p className="text-gray-600">{kanji.jlpt ? `N${kanji.jlpt}` : 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-1">Jouyou</h3>
                    <p className="text-gray-600">{kanji.jouyou ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Example Words */}
          <div className="space-y-6">
            <div className="border-2 border-black p-6">
              <h2 className="text-xl font-bold text-black mb-4 tracking-wider">EXAMPLE WORDS</h2>
              
              {words.length > 0 ? (
                <div className="space-y-4">
                  {words.map((word) => (
                    <div key={word.seq} className="border border-gray-200 p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-bold text-black">
                          {word.headwords[0]}
                        </span>
                        <span className="text-gray-600">
                          {word.readings[0]}
                        </span>
                        {word.is_common && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium">
                            Common
                          </span>
                        )}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {word.glosses_en.slice(0, 3).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No example words found for this character.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}