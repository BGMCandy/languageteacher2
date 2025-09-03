'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClientBrowser } from '@/lib/supabase'
import { Excerpt } from '@/lib/types/excerpts'

export default function ExcerptPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [excerpt, setExcerpt] = useState<Excerpt | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClientBrowser()

  const fetchExcerpt = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('excerpts')
        .select('*')
        .eq('slug', slug)
        .eq('is_public', true)
        .single()

      if (error) {
        console.error('Error fetching excerpt:', error)
        setError('Excerpt not found')
        return
      }

      setExcerpt(data)

      // Increment view count
      await supabase
        .from('excerpts')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', data.id)
    } catch (error) {
      console.error('Error:', error)
      setError('Failed to load excerpt')
    } finally {
      setLoading(false)
    }
  }, [slug, supabase])

  useEffect(() => {
    if (slug) {
      fetchExcerpt()
    }
  }, [slug, fetchExcerpt])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !excerpt) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h1 className="text-2xl font-bold text-gray-600 mb-4">Excerpt Not Found</h1>
            <p className="text-gray-500 mb-8">
              The excerpt you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/excerpts"
              className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Browse All Excerpts
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            href="/excerpts"
            className="text-gray-500 hover:text-black transition-colors"
          >
            ← Back to Excerpts
          </Link>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">{excerpt.title}</h1>
          
          {/* Word Info */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-black">{excerpt.word_text}</div>
              {excerpt.word_reading && (
                <div className="text-lg text-gray-600">{excerpt.word_reading}</div>
              )}
              {excerpt.word_meaning && (
                <div className="text-lg text-gray-700">{excerpt.word_meaning}</div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            {excerpt.difficulty_level && (
              <span className={`px-3 py-1 rounded-full ${
                excerpt.difficulty_level === 'beginner' ? 'bg-green-100 text-green-700' :
                excerpt.difficulty_level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {excerpt.difficulty_level}
              </span>
            )}
            {excerpt.content_type && (
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                {excerpt.content_type.replace('_', ' ')}
              </span>
            )}
            {excerpt.is_featured && (
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                Featured
              </span>
            )}
            <span>{excerpt.view_count} views</span>
            <span>Created {new Date(excerpt.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {excerpt.content}
            </div>
          </div>
        </div>

        {/* Related Actions */}
        <div className="mt-12 pt-8 border-t-2 border-gray-200">
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/vocabulary/japanese/${encodeURIComponent(excerpt.word_text)}`}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              View Word Details
            </Link>
            <Link
              href="/excerpts"
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors"
            >
              Browse More Excerpts
            </Link>
          </div>
        </div>

        {/* AI Attribution */}
        {excerpt.ai_model && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Generated using {excerpt.ai_model} • 
              {excerpt.generation_timestamp && (
                <span> {new Date(excerpt.generation_timestamp).toLocaleDateString()}</span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
