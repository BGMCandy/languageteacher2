'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import { createClient } from '@supabase/supabase-js'

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

export default function DictionaryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<'words' | 'kanji'>('words')
  const [results, setResults] = useState<DictionaryEntry[] | KanjiEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState('')

  useEffect(() => {
    // Set language based on slug
    const langMap: { [key: string]: string } = {
      'japanese': 'Japanese',
      'chinese': 'Chinese',
      'korean': 'Korean'
    }
    setLanguage(langMap[slug] || slug)
  }, [slug])

  const searchDictionary = async () => {
    if (!searchQuery.trim()) return
    
    setLoading(true)
    setResults([])

    try {
      if (searchType === 'words') {
        // Search JMdict entries
        const { data, error } = await supabase
          .from('jmdict_entries')
          .select('*')
          .or(`search_text.ilike.%${searchQuery}%,headwords.cs.{${searchQuery}},readings.cs.{${searchQuery}}`)
          .limit(50)

        if (error) throw error
        setResults(data || [])
      } else {
        // Search kanji
        const { data, error } = await supabase
          .from('kanjidic2')
          .select('*')
          .or(`kanji.eq.${searchQuery},meanings_en.cs.{${searchQuery}}`)
          .limit(50)

        if (error) throw error
        setResults(data || [])
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchDictionary()
  }

  const renderWordResult = (entry: DictionaryEntry) => (
    <div key={entry.seq} className="border-2 border-black bg-white p-6 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            {entry.headwords.length > 0 && (
              <span className="text-3xl font-bold text-black">
                {entry.headwords[0]}
              </span>
            )}
            {entry.readings.length > 0 && (
              <span className="text-xl text-gray-600">
                {entry.readings[0]}
              </span>
            )}
            {entry.is_common && (
              <span className="bg-green-100 text-green-800 text-xs px-3 py-2 border-2 border-green-300 tracking-wider font-medium">
                COMMON
              </span>
            )}
          </div>
          
          <div className="text-black mb-4 text-lg">
            {entry.glosses_en.slice(0, 3).join(', ')}
            {entry.glosses_en.length > 3 && '...'}
          </div>
          
          {entry.pos_tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {entry.pos_tags.slice(0, 5).map((pos, idx) => (
                <span key={idx} className="bg-gray-100 text-black text-xs px-3 py-2 border-2 border-gray-300 tracking-wider font-medium">
                  {pos}
                </span>
              ))}
            </div>
          )}
          
          {entry.freq_tags.length > 0 && (
            <div className="text-sm text-gray-600 tracking-wide">
              <span className="font-medium">FREQUENCY:</span> {entry.freq_tags.join(', ')}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderKanjiResult = (entry: KanjiEntry) => (
    <div key={entry.kanji} className="border-2 border-black bg-white p-6 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl font-bold text-black">
              {entry.kanji}
            </span>
            {entry.jouyou && (
              <span className="bg-blue-100 text-blue-800 text-xs px-3 py-2 border-2 border-blue-300 tracking-wider font-medium">
                JOUYOU
              </span>
            )}
          </div>
          
          <div className="text-black mb-4 text-lg">
            {entry.meanings_en.slice(0, 3).join(', ')}
            {entry.meanings_en.length > 3 && '...'}
          </div>
          
          <div className="grid grid-cols-2 gap-6 text-base mb-4">
            {entry.on_readings.length > 0 && (
              <div>
                <span className="font-semibold text-black tracking-wider uppercase">ON-YOMI:</span>
                <div className="text-black mt-1">{entry.on_readings.slice(0, 3).join(', ')}</div>
              </div>
            )}
            
            {entry.kun_readings.length > 0 && (
              <div>
                <span className="font-semibold text-black tracking-wider uppercase">KUN-YOMI:</span>
                <div className="text-black mt-1">{entry.kun_readings.slice(0, 3).join(', ')}</div>
              </div>
            )}
          </div>
          
          <div className="flex gap-6 text-sm text-gray-600 mt-4">
            {entry.grade && <span className="tracking-wider"><span className="font-medium">GRADE:</span> {entry.grade}</span>}
            {entry.jlpt && <span className="tracking-wider"><span className="font-medium">JLPT:</span> N{entry.jlpt}</span>}
            {entry.strokes && <span className="tracking-wider"><span className="font-medium">STROKES:</span> {entry.strokes}</span>}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-4 mb-8">
            {/* Sharp geometric logo */}
            <div className="w-12 h-12 bg-black relative">
              <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}></div>
              <div className="absolute inset-0 bg-black" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }}></div>
            </div>
            <h1 className="text-4xl font-bold text-black tracking-wider">
              {language.toUpperCase()} DICTIONARY
            </h1>
          </div>
          <div className="h-px w-32 bg-black mx-auto mb-6"></div>
          <p className="text-gray-600 tracking-wide">
            Search for words and kanji in the {language.toLowerCase()} language
          </p>
        </div>

        {/* Search Form */}
        <div className="border-2 border-black bg-white p-8 mb-12">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter a word, kanji, or meaning..."
                  className="w-full px-6 py-4 border-2 border-black bg-white text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors duration-200 text-lg"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !searchQuery.trim()}
                className="px-8 py-4 bg-black text-white border-2 border-black hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold tracking-wider transition-all duration-200"
              >
                {loading ? 'SEARCHING...' : 'SEARCH'}
              </button>
            </div>
            
            <div className="flex gap-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="words"
                  checked={searchType === 'words'}
                  onChange={(e) => setSearchType(e.target.value as 'words' | 'kanji')}
                  className="mr-3 w-4 h-4 text-black border-2 border-black focus:ring-black"
                />
                <span className="text-black font-medium tracking-wider">WORDS</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="kanji"
                  checked={searchType === 'kanji'}
                  onChange={(e) => setSearchType(e.target.value as 'words' | 'kanji')}
                  className="mr-3 w-4 h-4 text-black border-2 border-black focus:ring-black"
                />
                <span className="text-black font-medium tracking-wider">KANJI</span>
              </label>
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-2 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 tracking-wide">SEARCHING...</p>
            </div>
          )}
          
          {!loading && results.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-black mb-6 tracking-wider">
                FOUND {results.length} {searchType === 'words' ? 'WORDS' : 'KANJI'}
              </h2>
              <div className="space-y-6">
                {searchType === 'words' 
                  ? (results as DictionaryEntry[]).map(renderWordResult)
                  : (results as KanjiEntry[]).map(renderKanjiResult)
                }
              </div>
            </div>
          )}
          
          {!loading && results.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-gray-600 tracking-wide">NO {searchType.toUpperCase()} FOUND FOR &ldquo;{searchQuery}&rdquo;</p>
              <p className="text-sm text-gray-500 mt-3 tracking-wide">
                Try searching with different terms or check your spelling
              </p>
            </div>
          )}
          
          {!loading && !searchQuery && (
            <div className="text-center py-12">
              <p className="text-gray-600 tracking-wide">ENTER A SEARCH TERM TO FIND {searchType === 'words' ? 'WORDS' : 'KANJI'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
