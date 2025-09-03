'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClientBrowser } from '@/lib/supabase'

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

export default function KanjiPage() {
  const [kanji, setKanji] = useState<KanjiEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [gradeFilter, setGradeFilter] = useState<number | null>(null)
  const [jlptFilter, setJlptFilter] = useState<number | null>(null)

  const supabase = createClientBrowser()

  const fetchKanji = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('kanjidic2')
        .select('*')
        .order('grade', { ascending: true, nullsFirst: false })
        .order('jlpt', { ascending: true, nullsFirst: false })

      if (gradeFilter !== null) {
        query = query.eq('grade', gradeFilter)
      }

      if (jlptFilter !== null) {
        query = query.eq('jlpt', jlptFilter)
      }

      const { data, error } = await query.limit(100)

      if (error) {
        throw new Error(`Failed to fetch kanji: ${error.message}`)
      }

      setKanji(data || [])
    } catch (err) {
      console.error('Error fetching kanji:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [gradeFilter, jlptFilter, supabase])

  useEffect(() => {
    fetchKanji()
  }, [fetchKanji])

  const clearFilters = () => {
    setGradeFilter(null)
    setJlptFilter(null)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/characters" className="text-gray-600 hover:text-black transition-colors mb-4 inline-block">
            ← Back to Character Systems
          </Link>
          <h1 className="text-4xl font-bold text-black mb-4">Japanese Kanji</h1>
          <p className="text-gray-600 text-lg">
            Explore Japanese kanji characters with their readings, meanings, and stroke information.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
              <select
                value={gradeFilter || ''}
                onChange={(e) => setGradeFilter(e.target.value ? parseInt(e.target.value) : null)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none"
              >
                <option value="">All Grades</option>
                <option value="1">Grade 1</option>
                <option value="2">Grade 2</option>
                <option value="3">Grade 3</option>
                <option value="4">Grade 4</option>
                <option value="5">Grade 5</option>
                <option value="6">Grade 6</option>
                <option value="7">Grade 7</option>
                <option value="8">Grade 8</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">JLPT Level</label>
              <select
                value={jlptFilter || ''}
                onChange={(e) => setJlptFilter(e.target.value ? parseInt(e.target.value) : null)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none"
              >
                <option value="">All Levels</option>
                <option value="5">N5</option>
                <option value="4">N4</option>
                <option value="3">N3</option>
                <option value="2">N2</option>
                <option value="1">N1</option>
              </select>
            </div>

            {(gradeFilter !== null || jlptFilter !== null) && (
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Kanji Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="bg-gray-100 border-2 border-gray-200 rounded-lg p-4 animate-pulse">
                <div className="h-8 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Error Loading Kanji</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchKanji}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : kanji.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Kanji Found</h3>
            <p className="text-gray-500">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {kanji.map((k) => (
              <Link
                key={k.kanji}
                href={`/characters/kanji/${k.kanji}`}
                className="block bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-black hover:shadow-lg transition-all duration-200"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-black mb-2">{k.kanji}</div>
                  <div className="text-xs text-gray-600 mb-1">
                    {k.meanings_en.slice(0, 1).join(', ')}
                  </div>
                  <div className="flex justify-center gap-1 text-xs text-gray-500">
                    {k.grade && (
                      <span className="px-1 py-0.5 bg-blue-100 text-blue-700 rounded">
                        G{k.grade}
                      </span>
                    )}
                    {k.jlpt && (
                      <span className="px-1 py-0.5 bg-green-100 text-green-700 rounded">
                        N{k.jlpt}
                      </span>
                    )}
                    {k.strokes && (
                      <span className="px-1 py-0.5 bg-gray-100 text-gray-700 rounded">
                        {k.strokes}s
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Load More */}
        {kanji.length > 0 && kanji.length >= 100 && (
          <div className="text-center mt-8">
            <button
              onClick={fetchKanji}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors"
            >
              Load More Kanji
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
