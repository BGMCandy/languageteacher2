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

interface KanjiCharacterPageProps {
  params: Promise<{ slug: string }>
}

export default function KanjiCharacterPage({ params }: KanjiCharacterPageProps) {
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
    
      // Method 1: Search in search_text field (most reliable)
      try {
        const { data: searchData, error: searchError } = await supabase
          .from('jmdict_entries')
          .select('*')
          .ilike('search_text', `%${kanjiChar}%`)
          .limit(20)
        
        if (!searchError && searchData) {
          words = searchData as WordEntry[]
        }
      } catch (searchErr) {
        console.log('Search text method failed:', searchErr)
      }
    
      // Method 2: If no results, try array overlap search
      if (words.length === 0) {
        try {
          const { data: arrayData, error: arrayError } = await supabase
            .from('jmdict_entries')
            .select('*')
            .overlaps('headwords', [kanjiChar])
            .limit(20)
          
          if (!arrayError && arrayData) {
            words = arrayData as WordEntry[]
          }
        } catch (arrayErr) {
          console.log('Array search method failed:', arrayErr)
        }
      }
    
      // Method 3: If still no results, try contains search
      if (words.length === 0) {
        try {
          const { data: containsData, error: containsError } = await supabase
            .from('jmdict_entries')
            .select('*')
            .contains('headwords', [kanjiChar])
            .limit(20)
          
          if (!containsError && containsData) {
            words = containsData as WordEntry[]
          }
        } catch (containsErr) {
          console.log('Contains search method failed:', containsErr)
        }
      }
    
      setWords(words)
    } catch (err) {
      console.error('Error fetching kanji words:', err)
      setWords([])
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
          .single()

        if (kanjiError) {
          throw new Error(`Kanji not found: ${kanjiError.message}`)
        }

        if (!kanjiData) {
          throw new Error('No kanji data returned')
        }

        setKanji(kanjiData as KanjiEntry)

        // Fetch words containing this kanji
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
          <p className="text-gray-600">Loading kanji...</p>
        </div>
      </div>
    )
  }

  if (error || !kanji) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Kanji Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested kanji could not be found.'}</p>
          <Link href="/characters" className="btn-3">
            Back to Characters
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/characters" className="text-gray-600 hover:text-black transition-colors mb-4 inline-block">
            ← Back to Characters
          </Link>
          <h1 className="text-6xl font-bold text-black mb-2">{kanji.kanji}</h1>
          <div className="h-px w-24 bg-black"></div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kanji Details */}
          <div className="space-y-6">
            <div className="border-2 border-black p-6">
              <h2 className="text-xl font-bold text-black mb-4 tracking-wider">KANJI DETAILS</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-black mb-2">Meanings</h3>
                  <div className="space-y-2">
                    {kanji.meanings_en.map((meaning, index) => (
                      <div key={index} className="px-3 py-2 bg-gray-100 text-black text-sm">
                        {meaning}
                      </div>
                    ))}
                  </div>
                </div>

                {kanji.on_readings.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-black mb-2">On Readings</h3>
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
                    <h3 className="font-semibold text-black mb-2">Kun Readings</h3>
                    <div className="flex flex-wrap gap-2">
                      {kanji.kun_readings.map((reading, index) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-black text-sm">
                          {reading}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-black">Strokes:</span>
                      <span className="ml-2 text-gray-600">{kanji.strokes || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-black">Grade:</span>
                      <span className="ml-2 text-gray-600">{kanji.grade || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-black">JLPT:</span>
                      <span className="ml-2 text-gray-600">{kanji.jlpt ? `N${kanji.jlpt}` : 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-black">Jouyou:</span>
                      <span className="ml-2 text-gray-600">{kanji.jouyou ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Words Containing This Kanji */}
          <div className="space-y-6">
            <div className="border-2 border-black p-6">
              <h2 className="text-xl font-bold text-black mb-4 tracking-wider">WORDS CONTAINING 「{kanji.kanji}」</h2>
              
              {words.length > 0 ? (
                <div className="space-y-3">
                  {words.slice(0, 10).map((word) => (
                    <Link
                      key={word.seq}
                      href={`/vocabulary/japanese/${word.seq}`}
                      className="block p-3 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-black">{word.headwords[0]}</span>
                        {word.readings[0] && (
                          <span className="text-sm text-gray-600">{word.readings[0]}</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-700 mt-1">
                        {word.glosses_en.slice(0, 2).join(', ')}
                      </div>
                      {word.is_common && (
                        <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                          Common
                        </span>
                      )}
                    </Link>
                  ))}
                  {words.length > 10 && (
                    <p className="text-sm text-gray-500 text-center">
                      And {words.length - 10} more words...
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">No words found containing this kanji.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
