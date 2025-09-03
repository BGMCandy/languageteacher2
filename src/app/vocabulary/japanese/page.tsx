'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
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

export default function JapaneseVocabularyPage() {
  const [words, setWords] = useState<DictionaryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [commonOnly, setCommonOnly] = useState(false)

  const fetchWords = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('jmdict_entries')
        .select('*')
        .order('seq', { ascending: true })

      if (commonOnly) {
        query = query.eq('is_common', true)
      }

      const { data, error } = await query.limit(50)

      if (error) {
        throw new Error(`Failed to fetch words: ${error.message}`)
      }

      setWords(data || [])
    } catch (err) {
      console.error('Error fetching words:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [commonOnly])

  useEffect(() => {
    fetchWords()
  }, [fetchWords])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('jmdict_entries')
        .select('*')
        .ilike('search_text', `%${searchQuery}%`)
        .limit(20)

      if (error) {
        throw new Error(`Search failed: ${error.message}`)
      }

      setWords(data || [])
    } catch (err) {
      console.error('Error searching words:', err)
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    fetchWords()
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/vocabulary" className="text-gray-600 hover:text-black transition-colors mb-4 inline-block">
            ← Back to Vocabulary
          </Link>
          <h1 className="text-4xl font-bold text-black mb-4">Japanese Vocabulary</h1>
          <p className="text-gray-600 text-lg">
            Explore Japanese words and phrases with detailed information.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Japanese words..."
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Search
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors"
              >
                Clear
              </button>
            )}
          </form>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCommonOnly(!commonOnly)}
              className={`px-3 py-1 rounded-full text-sm border-2 transition-colors ${
                commonOnly
                  ? 'bg-green-100 border-green-500 text-green-700'
                  : 'bg-gray-100 border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              Common Words Only
            </button>
          </div>
        </div>

        {/* Words Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-gray-100 border-2 border-gray-200 rounded-lg p-4 animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Error Loading Words</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchWords}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : words.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Words Found</h3>
            <p className="text-gray-500">
              {searchQuery ? 'Try a different search term.' : 'No words match your current filters.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {words.map((word) => (
              <Link
                key={word.seq}
                href={`/vocabulary/japanese/${word.seq}`}
                className="block bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-black hover:shadow-lg transition-all duration-200"
              >
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-black mb-1">
                    {word.headwords[0]}
                  </h3>
                  {word.readings[0] && (
                    <div className="text-sm text-gray-600 mb-2">
                      {word.readings[0]}
                    </div>
                  )}
                  <div className="text-sm text-gray-700">
                    {word.glosses_en.slice(0, 2).join(', ')}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    {word.is_common && (
                      <span className="px-2 py-1 rounded-full bg-green-100 text-green-700">
                        Common
                      </span>
                    )}
                    {word.pos_tags && word.pos_tags.length > 0 && (
                      <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                        {word.pos_tags[0]}
                      </span>
                    )}
                  </div>
                  <span>#{word.seq}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Load More */}
        {words.length > 0 && words.length >= 50 && !searchQuery && (
          <div className="text-center mt-8">
            <button
              onClick={fetchWords}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors"
            >
              Load More Words
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
