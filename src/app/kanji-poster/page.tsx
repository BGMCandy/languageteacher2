'use client'

import { useState, useEffect } from 'react'
import { supabase, JapaneseKanji } from '@/lib/supabase'
import Flashcard from '../components/layout/study/flashcard'

export default function KanjiPoster() {
  const [kanji, setKanji] = useState<JapaneseKanji[]>([])
  const [loading, setLoading] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [selectedKanji, setSelectedKanji] = useState<JapaneseKanji | null>(null)

  useEffect(() => {
    fetchAllKanji()
  }, [])

  const fetchAllKanji = async () => {
    try {
      setLoading(true)
      console.log('Fetching all kanji characters...')
      
      // First, get the total count
      const { count, error: countError } = await supabase
        .from('japanese_kanji')
        .select('*', { count: 'exact', head: true })
      
      if (countError) {
        console.error('Error getting count:', countError)
        throw countError
      }
      
      if (!count) {
        console.error('No count returned from database')
        return
      }
      
      console.log(`Total characters in database: ${count}`)
      
      // Fetch all characters using pagination (Supabase default limit is 1000)
      const allKanji: JapaneseKanji[] = []
      const pageSize = 1000
      let offset = 0
      
      while (offset < count) {
        console.log(`Fetching page: offset ${offset}, limit ${pageSize}`)
        
        const { data, error } = await supabase
          .from('japanese_kanji')
          .select('*')
          .order('level', { ascending: true })
          .range(offset, offset + pageSize - 1)

        if (error) throw error
        
        if (data) {
          allKanji.push(...data)
          console.log(`Fetched ${data.length} characters in this page`)
        }
        
        offset += pageSize
      }
      
      console.log(`Total characters fetched: ${allKanji.length}`)
      console.log('First few characters:', allKanji.slice(0, 5))
      console.log('Last few characters:', allKanji.slice(-5))
      
      if (allKanji.length !== count) {
        console.warn(`Warning: Expected ${count} characters but got ${allKanji.length}`)
      }
      
      setKanji(allKanji)
    } catch (err) {
      console.error('Error fetching kanji:', err)
    } finally {
      setLoading(false)
    }
  }

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'level 1':
        return 'bg-emerald-500 hover:bg-emerald-600'
      case 'level 2':
        return 'bg-blue-500 hover:bg-blue-600'
      case 'level 3':
        return 'bg-amber-500 hover:bg-amber-600'
      case 'level 4':
        return 'bg-orange-500 hover:bg-orange-600'
      case 'level 5':
        return 'bg-red-500 hover:bg-red-600'
      case 'level 6':
        return 'bg-purple-500 hover:bg-purple-600'
      case 'secondary':
        return 'bg-slate-500 hover:bg-slate-600'
      default:
        return 'bg-slate-400 hover:bg-slate-500'
    }
  }

  const handleKanjiClick = (kanji: JapaneseKanji) => {
    setSelectedKanji(kanji)
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.3))
  }

  const handleResetZoom = () => {
    setZoom(1)
  }

  const downloadAllKanji = () => {
    if (kanji.length === 0) return

    try {
      // Get all column names from the first kanji object
      const columns = Object.keys(kanji[0])
      
      // Create CSV header
      const csvHeader = columns.join(',')
      
      // Create CSV rows
      const csvRows = kanji.map(kanji => {
        return columns.map(column => {
          const value = kanji[column as keyof JapaneseKanji]
          // Escape commas and quotes in CSV values
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value || ''
        }).join(',')
      })
      
      // Combine header and rows
      const csvContent = [csvHeader, ...csvRows].join('\n')
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      link.setAttribute('href', url)
      link.setAttribute('download', `kanji_database_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up
      URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Error downloading CSV:', error)
      alert('Error downloading CSV file. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading kanji characters...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Kanji Poster
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                {kanji.length.toLocaleString()} characters • Click any character to see details
                {kanji.length > 0 && (
                  <span className="block text-xs text-slate-500 mt-1">
                    Showing characters 1-{kanji.length} • Total in database: {kanji.length}
                  </span>
                )}
              </p>
            </div>
            
            {/* Zoom Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleZoomOut}
                className="p-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-all duration-200 shadow-sm"
                title="Zoom Out"
              >
                <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              
              <span className="text-sm font-mono bg-white dark:bg-slate-700 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 shadow-sm">
                {Math.round(zoom * 100)}%
              </span>
              
              <button
                onClick={handleZoomIn}
                className="p-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-all duration-200 shadow-sm"
                title="Zoom In"
              >
                <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              
              <button
                onClick={handleResetZoom}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md font-medium"
              >
                Reset
              </button>

              {/* Download Button */}
              <button
                onClick={downloadAllKanji}
                className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm font-medium flex items-center gap-2"
                title="Download all kanji data as CSV"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center gap-6 text-sm">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Level Legend:</span>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-sm"></div>
                <span className="text-slate-600 dark:text-slate-400">Level 1</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
                <span className="text-slate-600 dark:text-slate-400">Level 2</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full shadow-sm"></div>
                <span className="text-slate-600 dark:text-slate-400">Level 3</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full shadow-sm"></div>
                <span className="text-slate-600 dark:text-slate-400">Level 4</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                <span className="text-slate-600 dark:text-slate-400">Level 5</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full shadow-sm"></div>
                <span className="text-slate-600 dark:text-slate-400">Level 6</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-500 rounded-full shadow-sm"></div>
                <span className="text-slate-600 dark:text-slate-400">Secondary</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-140px)]">
        {/* Kanji Grid Container */}
        <div className="flex-1 overflow-auto p-6">
          <div 
            className="inline-block min-h-full"
            style={{ 
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              transition: 'transform 0.3s ease-out'
            }}
          >
            <div className="grid grid-cols-30 gap-2 max-w-none">
              {kanji.map((char, index) => (
                <button
                  key={`${char.letter}-${index}`}
                  onClick={() => handleKanjiClick(char)}
                  className={`
                    w-14 h-14 flex items-center justify-center text-xl font-bold text-white
                    ${getLevelColor(char.level)}
                    transition-all duration-200 cursor-pointer
                    border-2 border-white/20 dark:border-slate-700/20
                    hover:scale-110 hover:shadow-lg hover:border-white/40
                    active:scale-95
                    rounded-lg
                    flex-shrink-0
                  `}
                  title={`${char.letter} - ${char.name} (${char.level})`}
                >
                  {char.letter}
                </button>
              ))}
            </div>
            
            {/* Debug Info */}
            <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg border border-yellow-300 dark:border-yellow-700">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Debug Information:</h3>
              <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <div>Total characters in state: {kanji.length}</div>
                <div>Characters rendered in grid: {kanji.length}</div>
                <div>Expected from database: 1,945</div>
                <div>Grid columns: 30</div>
                <div>Grid rows: {Math.ceil(kanji.length / 30)}</div>
                <div>First character: {kanji[0]?.letter || 'None'}</div>
                <div>Last character: {kanji[kanji.length - 1]?.letter || 'None'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Panel for Selected Card */}
        <div className="w-96 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-l border-slate-200 dark:border-slate-700 p-6 overflow-y-auto">
          {selectedKanji ? (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Selected Character
                </h2>
                <div className="text-6xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                  {selectedKanji.letter}
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white ${getLevelColor(selectedKanji.level)}`}>
                  {selectedKanji.level}
                </div>
              </div>
              
              <Flashcard card={selectedKanji} />
              
              <div className="text-center">
                <button
                  onClick={() => setSelectedKanji(null)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 dark:text-slate-400 mt-20">
              <div className="text-6xl mb-4">👆</div>
              <h3 className="text-lg font-medium mb-2">No Character Selected</h3>
              <p className="text-sm">Click on any kanji character in the grid to see its details here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
