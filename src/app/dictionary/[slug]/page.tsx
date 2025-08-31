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
    <div key={entry.seq} className="bg-white rounded-lg shadow-md p-4 mb-4 border-l-4 border-blue-500">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {entry.headwords.length > 0 && (
              <span className="text-2xl font-bold text-gray-800">
                {entry.headwords[0]}
              </span>
            )}
            {entry.readings.length > 0 && (
              <span className="text-lg text-gray-600">
                {entry.readings[0]}
              </span>
            )}
            {entry.is_common && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Common
              </span>
            )}
          </div>
          
          <div className="text-gray-700 mb-2">
            {entry.glosses_en.slice(0, 3).join(', ')}
            {entry.glosses_en.length > 3 && '...'}
          </div>
          
          {entry.pos_tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {entry.pos_tags.slice(0, 5).map((pos, idx) => (
                <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                  {pos}
                </span>
              ))}
            </div>
          )}
          
          {entry.freq_tags.length > 0 && (
            <div className="text-xs text-gray-500">
              Frequency: {entry.freq_tags.join(', ')}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderKanjiResult = (entry: KanjiEntry) => (
    <div key={entry.kanji} className="bg-white rounded-lg shadow-md p-4 mb-4 border-l-4 border-purple-500">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl font-bold text-gray-800">
              {entry.kanji}
            </span>
            {entry.jouyou && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Jouyou
              </span>
            )}
          </div>
          
          <div className="text-gray-700 mb-2">
            {entry.meanings_en.slice(0, 3).join(', ')}
            {entry.meanings_en.length > 3 && '...'}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            {entry.on_readings.length > 0 && (
              <div>
                <span className="font-semibold text-gray-600">On-yomi:</span>
                <div className="text-gray-700">{entry.on_readings.slice(0, 3).join(', ')}</div>
              </div>
            )}
            
            {entry.kun_readings.length > 0 && (
              <div>
                <span className="font-semibold text-gray-600">Kun-yomi:</span>
                <div className="text-gray-700">{entry.kun_readings.slice(0, 3).join(', ')}</div>
              </div>
            )}
          </div>
          
          <div className="flex gap-4 text-xs text-gray-500 mt-2">
            {entry.grade && <span>Grade: {entry.grade}</span>}
            {entry.jlpt && <span>JLPT: N{entry.jlpt}</span>}
            {entry.strokes && <span>Strokes: {entry.strokes}</span>}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {language} Dictionary
          </h1>
          <p className="text-lg text-gray-600">
            Search for words and kanji in the {language.toLowerCase()} language
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter a word, kanji, or meaning..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !searchQuery.trim()}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
            
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="words"
                  checked={searchType === 'words'}
                  onChange={(e) => setSearchType(e.target.value as 'words' | 'kanji')}
                  className="mr-2"
                />
                <span className="text-gray-700">Words</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="kanji"
                  checked={searchType === 'kanji'}
                  onChange={(e) => setSearchType(e.target.value as 'words' | 'kanji')}
                  className="mr-2"
                />
                <span className="text-gray-700">Kanji</span>
              </label>
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Searching...</p>
            </div>
          )}
          
          {!loading && results.length > 0 && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Found {results.length} {searchType === 'words' ? 'words' : 'kanji'}
              </h2>
              <div className="space-y-4">
                {searchType === 'words' 
                  ? (results as DictionaryEntry[]).map(renderWordResult)
                  : (results as KanjiEntry[]).map(renderKanjiResult)
                }
              </div>
            </div>
          )}
          
          {!loading && results.length === 0 && searchQuery && (
            <div className="text-center py-8">
              <p className="text-gray-600">No {searchType} found for &ldquo;{searchQuery}&rdquo;</p>
              <p className="text-sm text-gray-500 mt-2">
                Try searching with different terms or check your spelling
              </p>
            </div>
          )}
          
          {!loading && !searchQuery && (
            <div className="text-center py-8">
              <p className="text-gray-600">Enter a search term to find {searchType === 'words' ? 'words' : 'kanji'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
