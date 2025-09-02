'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface DictionaryEntry {
  seq: number
  headwords: string[]
  readings: string[]
  glosses_en: string[]
  is_common: boolean
  pos_tags: string[]
  freq_tags: string[]
}

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

interface VocabularyPageProps {
  params: Promise<{ slug: string }>
}

export default function VocabularyPage({ params }: VocabularyPageProps) {
  const { slug: rawSlug } = use(params)
  const slug = decodeURIComponent(rawSlug) // Decode URL-encoded characters
  const [word, setWord] = useState<DictionaryEntry | null>(null)
  const [kanjiDetails, setKanjiDetails] = useState<KanjiEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchWordData(): Promise<void> {
      try {
        setLoading(true)
        
        // Fetch word details by sequence number
        const seqNumber: number = parseInt(slug)
        if (isNaN(seqNumber)) {
          throw new Error('Invalid word ID')
        }

        const { data: wordData, error: wordError } = await supabase
          .from('jmdict_entries')
          .select('*')
          .eq('seq', seqNumber)
          .single()

        if (wordError) {
          throw new Error(`Word not found: ${wordError.message}`)
        }

        if (!wordData) {
          throw new Error('No word data returned')
        }

        setWord(wordData as DictionaryEntry)

        // Fetch kanji details for each character in the word
        if (wordData.headwords && wordData.headwords.length > 0) {
          const mainWord: string = wordData.headwords[0]
          const kanjiChars: string[] = mainWord.split('').filter((char: string) => /[\u4e00-\u9faf]/.test(char)) // Only kanji characters
          
          if (kanjiChars.length > 0) {
            const { data: kanjiData, error: kanjiError } = await supabase
              .from('kanjidic2')
              .select('*')
              .in('kanji', kanjiChars)

            if (kanjiError) {
              console.error('Error fetching kanji details:', kanjiError.message)
            } else {
              setKanjiDetails((kanjiData as KanjiEntry[]) || [])
            }
          }
        }

      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchWordData()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading word...</p>
        </div>
      </div>
    )
  }

  if (error || !word) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Word Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested word could not be found.'}</p>
          <Link href="/dictionary" className="btn-3">
            Back to Dictionary
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
          <Link href="/dictionary" className="text-gray-600 hover:text-black transition-colors mb-4 inline-block">
            ← Back to Dictionary
          </Link>
          <h1 className="text-4xl font-bold text-black mb-2">{word.headwords[0]}</h1>
          <div className="h-px w-24 bg-black"></div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Word Details */}
          <div className="space-y-6">
            <div className="border-2 border-black p-6">
              <h2 className="text-xl font-bold text-black mb-4 tracking-wider">WORD DETAILS</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-black mb-2">Readings</h3>
                  <div className="flex flex-wrap gap-2">
                    {word.readings.map((reading, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-black text-sm">
                        {reading}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-black mb-2">Meanings</h3>
                  <div className="space-y-2">
                    {word.glosses_en.map((gloss, index) => (
                      <div key={index} className="px-3 py-2 bg-gray-100 text-black text-sm">
                        {gloss}
                      </div>
                    ))}
                  </div>
                </div>

                {word.pos_tags && word.pos_tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-black mb-2">Part of Speech</h3>
                    <div className="flex flex-wrap gap-2">
                      {word.pos_tags.map((pos, index) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-black text-sm">
                          {pos}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {word.freq_tags && word.freq_tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-black mb-2">Frequency</h3>
                    <div className="flex flex-wrap gap-2">
                      {word.freq_tags.map((freq, index) => (
                        <span key={index} className="px-3 py-1 bg-yellow-100 text-black text-sm">
                          {freq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-black">Common Word:</span>
                    <span className={`px-3 py-1 text-sm font-medium ${
                      word.is_common 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {word.is_common ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kanji Breakdown */}
          <div className="space-y-6">
            <div className="border-2 border-black p-6">
              <h2 className="text-xl font-bold text-black mb-4 tracking-wider">KANJI BREAKDOWN</h2>
              
              {kanjiDetails.length > 0 ? (
                <div className="space-y-4">
                  {kanjiDetails.map((kanji) => (
                    <div key={kanji.kanji} className="border border-gray-200 p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl font-bold text-black">{kanji.kanji}</span>
                        <Link 
                          href={`/characters/${kanji.kanji}`}
                          className="text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                          View Details →
                        </Link>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-gray-600">Meanings: </span>
                          <span className="text-sm text-black">
                            {kanji.meanings_en.slice(0, 3).join(', ')}
                          </span>
                        </div>
                        
                        {kanji.on_readings.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-gray-600">On: </span>
                            <span className="text-sm text-black">
                              {kanji.on_readings.slice(0, 2).join(', ')}
                            </span>
                          </div>
                        )}
                        
                        {kanji.kun_readings.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-gray-600">Kun: </span>
                            <span className="text-sm text-black">
                              {kanji.kun_readings.slice(0, 2).join(', ')}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex gap-4 text-xs text-gray-500">
                          <span>Strokes: {kanji.strokes || 'N/A'}</span>
                          <span>Grade: {kanji.grade || 'N/A'}</span>
                          <span>JLPT: {kanji.jlpt ? `N${kanji.jlpt}` : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No kanji characters found in this word.</p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Headwords */}
        {word.headwords.length > 1 && (
          <div className="mt-8">
            <div className="border-2 border-black p-6">
              <h2 className="text-xl font-bold text-black mb-4 tracking-wider">ALTERNATIVE FORMS</h2>
              <div className="flex flex-wrap gap-2">
                {word.headwords.slice(1).map((headword, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-black text-sm">
                    {headword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}