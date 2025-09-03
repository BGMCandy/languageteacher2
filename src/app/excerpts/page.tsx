'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClientBrowser } from '@/lib/supabase'
import { Excerpt, ExcerptFilters } from '@/lib/types/excerpts'

export default function ExcerptsPage() {
  const [excerpts, setExcerpts] = useState<Excerpt[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<ExcerptFilters>({})
  const [searchQuery, setSearchQuery] = useState('')

  const supabase = createClientBrowser()

  const fetchExcerpts = useCallback(async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('excerpts')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters.difficulty_level) {
        query = query.eq('difficulty_level', filters.difficulty_level)
      }
      if (filters.content_type) {
        query = query.eq('content_type', filters.content_type)
      }
      if (filters.is_featured) {
        query = query.eq('is_featured', true)
      }
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,word_text.ilike.%${searchQuery}%`)
      }

      const { data, error } = await query.limit(50)

      if (error) {
        console.error('Error fetching excerpts:', error)
        return
      }

      setExcerpts(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }, [filters, searchQuery, supabase])

  useEffect(() => {
    fetchExcerpts()
  }, [fetchExcerpts])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters(prev => ({ ...prev, search: searchQuery }))
  }

  const clearFilters = () => {
    setFilters({})
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">Learning Excerpts</h1>
          <p className="text-gray-600 text-lg">
            AI-generated contextual texts to help you learn vocabulary in real-world situations.
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
              placeholder="Search excerpts, words, or content..."
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilters(prev => ({ ...prev, difficulty_level: prev.difficulty_level === 'beginner' ? undefined : 'beginner' }))}
              className={`px-3 py-1 rounded-full text-sm border-2 transition-colors ${
                filters.difficulty_level === 'beginner'
                  ? 'bg-green-100 border-green-500 text-green-700'
                  : 'bg-gray-100 border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              Beginner
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, difficulty_level: prev.difficulty_level === 'intermediate' ? undefined : 'intermediate' }))}
              className={`px-3 py-1 rounded-full text-sm border-2 transition-colors ${
                filters.difficulty_level === 'intermediate'
                  ? 'bg-yellow-100 border-yellow-500 text-yellow-700'
                  : 'bg-gray-100 border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              Intermediate
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, difficulty_level: prev.difficulty_level === 'advanced' ? undefined : 'advanced' }))}
              className={`px-3 py-1 rounded-full text-sm border-2 transition-colors ${
                filters.difficulty_level === 'advanced'
                  ? 'bg-red-100 border-red-500 text-red-700'
                  : 'bg-gray-100 border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              Advanced
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, is_featured: !prev.is_featured }))}
              className={`px-3 py-1 rounded-full text-sm border-2 transition-colors ${
                filters.is_featured
                  ? 'bg-blue-100 border-blue-500 text-blue-700'
                  : 'bg-gray-100 border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              Featured
            </button>
            {(filters.difficulty_level || filters.is_featured || searchQuery) && (
              <button
                onClick={clearFilters}
                className="px-3 py-1 rounded-full text-sm border-2 border-gray-300 text-gray-700 hover:border-gray-400 bg-gray-100"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Excerpts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 border-2 border-gray-200 rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-300 rounded w-4/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : excerpts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No excerpts found</h3>
            <p className="text-gray-500">
              {searchQuery || Object.keys(filters).length > 0
                ? 'Try adjusting your search or filters.'
                : 'Be the first to create an excerpt!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {excerpts.map((excerpt) => (
              <Link
                key={excerpt.id}
                href={`/excerpts/${excerpt.slug}`}
                className="block bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-black hover:shadow-lg transition-all duration-200"
              >
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-black mb-2 line-clamp-2">
                    {excerpt.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">{excerpt.word_text}</span>
                    {excerpt.word_reading && (
                      <>
                        <span>•</span>
                        <span>{excerpt.word_reading}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                  {excerpt.content}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    {excerpt.difficulty_level && (
                      <span className={`px-2 py-1 rounded-full ${
                        excerpt.difficulty_level === 'beginner' ? 'bg-green-100 text-green-700' :
                        excerpt.difficulty_level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {excerpt.difficulty_level}
                      </span>
                    )}
                    {excerpt.is_featured && (
                      <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                        Featured
                      </span>
                    )}
                  </div>
                  <span>{excerpt.view_count} views</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
