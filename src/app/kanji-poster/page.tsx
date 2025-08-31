'use client'

import { useEffect, useState } from 'react'
import { createClientBrowser, JapaneseKanji } from '@/lib/supabase'

interface DictionaryEntry {
  seq: number
  headwords: string[]
  readings: string[]
  glosses_en: string[]
  is_common: boolean
  pos_tags: string[]
  freq_tags: string[]
  search_text: string
  raw: Record<string, unknown>
}

export default function KanjiPoster() {
  const [kanji, setKanji] = useState<JapaneseKanji[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedKanji, setSelectedKanji] = useState<JapaneseKanji | null>(null)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [tooltip, setTooltip] = useState<{ kanji: JapaneseKanji; x: number; y: number } | null>(null)
  const [viewMode, setViewMode] = useState<'level' | 'performance'>('level')
  const [userPerformance, setUserPerformance] = useState<Record<string, { totalAttempts: number; correctAttempts: number; successRate: number }>>({})
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [condensedView, setCondensedView] = useState<'comfortable' | 'super-condensed'>('comfortable')
  const [showAllKanji, setShowAllKanji] = useState(false)
  const [grouping, setGrouping] = useState<'none' | '5' | '10' | '20'>('none')
  const [kanjiWords, setKanjiWords] = useState<DictionaryEntry[]>([])
  const [loadingWords, setLoadingWords] = useState(false)

  useEffect(() => {
    const fetchKanji = async () => {
      try {
        const supabase = createClientBrowser()
        
        // First get the total count
        const { count, error: countError } = await supabase
          .from('japanese_kanji')
          .select('*', { count: 'exact', head: true })
        
        if (countError) {
          console.error('Error getting count:', countError)
          return
        }
        
        console.log(`Total kanji in database: ${count}`)
        setTotalCount(count || 0)
        
        // Fetch all data in chunks to bypass any limits
        let allKanji: JapaneseKanji[] = []
        const chunkSize = 1000
        let offset = 0
        
        while (offset < (count || 0)) {
          const { data: chunk, error: chunkError } = await supabase
            .from('japanese_kanji')
            .select('*')
            .order('level')
            .range(offset, offset + chunkSize - 1)
          
          if (chunkError) {
            console.error('Error fetching chunk:', chunkError)
            break
          }
          
          if (chunk && chunk.length > 0) {
            allKanji = [...allKanji, ...chunk]
            console.log(`Fetched chunk: ${chunk.length} kanji (total: ${allKanji.length})`)
          }
          
          offset += chunkSize
        }
        
        console.log(`Total fetched: ${allKanji.length} kanji characters`)
        setKanji(allKanji)
        
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    const fetchUserPerformance = async () => {
      try {
        const supabase = createClientBrowser()
        
        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setIsAuthenticated(false)
          return
        }
        
        setIsAuthenticated(true)
        
        // Fetch user's kanji performance data
        const { data: performanceData, error } = await supabase
          .from('kanji_performance')
          .select('kanji_character, total_attempts, correct_attempts')
          .eq('user_id', user.id)
        
        if (error) {
          console.error('Error fetching performance data:', error)
          return
        }
        
        // Process performance data
        const performanceMap: Record<string, { totalAttempts: number; correctAttempts: number; successRate: number }> = {}
        
        performanceData?.forEach((item: { kanji_character: string; total_attempts: number; correct_attempts: number }) => {
          const successRate = item.total_attempts > 0 ? (item.correct_attempts / item.total_attempts) * 100 : 0
          performanceMap[item.kanji_character] = {
            totalAttempts: item.total_attempts,
            correctAttempts: item.correct_attempts,
            successRate
          }
        })
        
        setUserPerformance(performanceMap)
        console.log('User performance data loaded:', Object.keys(performanceMap).length, 'kanji')
        
      } catch (err) {
        console.error('Error fetching performance data:', err)
      }
    }

    fetchKanji()
    fetchUserPerformance()
  }, [])

  // Fetch words when a kanji is selected
  useEffect(() => {
    if (selectedKanji) {
      fetchKanjiWords(selectedKanji.letter)
    }
  }, [selectedKanji])

  // Helper function to create grouped kanji with borders
  const createGroupedKanji = (kanjiList: string[], groupSize: number) => {
    const groups: string[][] = []
    for (let i = 0; i < kanjiList.length; i += groupSize) {
      groups.push(kanjiList.slice(i, i + groupSize))
    }
    return groups
  }

  // Group kanji by level for level view
  const groupedKanji = kanji.reduce((acc, k) => {
    const level = k.level || 'Unknown'
    if (!acc[level]) acc[level] = []
    acc[level].push(k)
    return acc
  }, {} as Record<string, JapaneseKanji[]>)

  const getLevelColor = (level: string) => {
    // Extract the number from "Level X" format
    const levelMatch = level.match(/Level (\d+)/)
    const levelNum = levelMatch ? parseInt(levelMatch[1]) : 0
    
    const colors = [
      'bg-green-100 border-green-300 text-green-800',
      'bg-blue-100 border-blue-300 text-blue-800', 
      'bg-yellow-100 border-yellow-300 text-yellow-800',
      'bg-orange-100 border-orange-300 text-orange-800',
      'bg-red-100 border-red-300 text-red-800',
      'bg-purple-100 border-purple-300 text-purple-800',
      'bg-pink-100 border-pink-300 text-pink-800',
      'bg-indigo-100 border-indigo-300 text-indigo-800',
      'bg-teal-100 border-teal-300 text-teal-800',
      'bg-amber-100 border-amber-300 text-amber-800'
    ]
    
    return colors[levelNum % colors.length] || 'bg-gray-100 border-gray-300 text-gray-800'
  }

  const getPerformanceColor = (kanjiChar: string) => {
    const performance = userPerformance[kanjiChar]
    
    if (!performance || performance.totalAttempts === 0) {
      // No data - use neutral gray with low opacity
      return 'bg-gray-100 border-gray-200 text-gray-600 opacity-40'
    }
    
    // Color based on success rate
    let baseColor: string
    if (performance.successRate >= 80) {
      baseColor = 'green'
    } else if (performance.successRate >= 60) {
      baseColor = 'yellow'
    } else if (performance.successRate >= 40) {
      baseColor = 'orange'
    } else {
      baseColor = 'red'
    }
    
    // Opacity based on attempt frequency (more attempts = more opaque)
    const opacity = Math.min(0.3 + (performance.totalAttempts * 0.1), 1.0)
    
    const colorMap = {
      green: `bg-green-100 border-green-300 text-green-800`,
      yellow: `bg-yellow-100 border-yellow-300 text-yellow-800`,
      orange: `bg-orange-100 border-orange-300 text-orange-800`,
      red: `bg-red-100 border-red-300 text-red-800`
    }
    
    return `${colorMap[baseColor as keyof typeof colorMap]} opacity-${Math.round(opacity * 100)}`
  }

  const getKanjiColor = (kanji: JapaneseKanji) => {
    return viewMode === 'level' ? getLevelColor(kanji.level) : getPerformanceColor(kanji.letter)
  }

  // Fetch words containing the selected kanji
  const fetchKanjiWords = async (kanjiChar: string) => {
    if (!kanjiChar) return
    
    setLoadingWords(true)
    setKanjiWords([])
    
    try {
      const supabase = createClientBrowser()
      
      // Try multiple search methods to find words containing this kanji
              let words: DictionaryEntry[] = []
        let error: Error | null = null
      
      // Method 1: Search in search_text field (most reliable)
      const { data: searchResults, error: searchError } = await supabase
        .from('jmdict_entries')
        .select('*')
        .ilike('search_text', `%${kanjiChar}%`)
        .limit(20)
      
      if (searchError) {
        console.log('Search method 1 failed, trying alternative...', searchError)
        
        // Method 2: Try searching in headwords array using text search
        const { data: headwordResults, error: headwordError } = await supabase
          .from('jmdict_entries')
          .select('*')
          .textSearch('headwords', kanjiChar)
          .limit(20)
        
        if (headwordError) {
          console.log('Search method 2 failed, trying final method...', headwordError)
          
          // Method 3: Use raw SQL-like search in any text field
          const { data: rawResults, error: rawError } = await supabase
            .from('jmdict_entries')
            .select('*')
            .or(`headwords.cs.{${kanjiChar}},readings.cs.{${kanjiChar}}`)
            .limit(20)
          
          if (rawError) {
            error = rawError
          } else {
            words = rawResults || []
          }
        } else {
          words = headwordResults || []
        }
      } else {
        words = searchResults || []
      }
      
      if (error) {
        console.error('All search methods failed:', error)
        return
      }
      
      setKanjiWords(words)
      console.log(`Found ${words.length} words containing kanji: ${kanjiChar}`)
      
    } catch (err) {
      console.error('Error fetching kanji words:', err)
    } finally {
      setLoadingWords(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-2xl text-gray-600">Loading kanji...</div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Japanese Kanji Poster
        </h1>
        
        {/* Debug Info */}
        <div className="text-center mb-4 text-gray-600">
          Displaying {kanji.length} of {totalCount || 'unknown'} kanji characters
        </div>
        
        {/* View Toggle */}
        <div className="flex justify-center mb-6 gap-4">
          {/* View Mode Toggle */}
          <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
            <button
              onClick={() => setViewMode('level')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'level'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              Level View
            </button>
            <button
              onClick={() => setViewMode('performance')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'performance'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
              disabled={!isAuthenticated}
            >
              Performance View
            </button>
          </div>

          {/* Density View Toggle */}
          <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
            <button
              onClick={() => setCondensedView('comfortable')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                condensedView === 'comfortable'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              Large
            </button>
            <button
              onClick={() => setCondensedView('super-condensed')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                condensedView === 'super-condensed'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              Compact
            </button>
          </div>

          {/* Show All Toggle */}
          <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
            <button
              onClick={() => setShowAllKanji(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                !showAllKanji
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              By Level
            </button>
            <button
              onClick={() => setShowAllKanji(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                showAllKanji
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              Show All
            </button>
          </div>

          {/* Grouping Toggle */}
          <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
            <button
              onClick={() => setGrouping('none')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                grouping === 'none'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              No Groups
            </button>
            <button
              onClick={() => setGrouping('5')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                grouping === '5'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              Groups of 5
            </button>
            <button
              onClick={() => setGrouping('10')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                grouping === '10'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              Groups of 10
            </button>
            <button
              onClick={() => setGrouping('20')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                grouping === '20'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              Groups of 20
            </button>
          </div>
        </div>
        
        {viewMode === 'performance' && !isAuthenticated && (
          <div className="text-center mb-4 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
            <div className="text-sm">
              <strong>Performance View:</strong> Sign in to see your quiz performance heatmap
            </div>
          </div>
        )}
        
        
        <div className="flex gap-8">
          {/* Kanji Grid */}
          <div className="flex-1">
            {showAllKanji ? (
              /* All Kanji View - Single condensed grid with optional grouping */
              <div className={`grid ${
                condensedView === 'super-condensed'
                  ? 'gap-1 grid-cols-40 md:grid-cols-50 lg:grid-cols-60 xl:grid-cols-80 2xl:grid-cols-100'
                  : 'gap-1 grid-cols-25 md:grid-cols-30 lg:grid-cols-35 xl:grid-cols-40'
              }`}>
                {kanji.map((k, index) => {
                  const groupSize = grouping !== 'none' ? parseInt(grouping) : 0
                  const isInGroup = groupSize > 0
                  const groupIndex = Math.floor(index / groupSize)
                  const isAlternateGroup = groupIndex % 2 === 1
                  const isGroupEnd = isInGroup && ((index + 1) % groupSize === 0)
                  const isLastInRow = (index + 1) % (groupSize * Math.ceil(groupSize / 10)) === 0
                  
                  return (
                    <div
                      key={k.id}
                      className={`
                        aspect-square flex items-center justify-center 
                        cursor-pointer transition-all duration-200
                        ${condensedView === 'super-condensed' ? 'hover:bg-blue-100' : 'hover:bg-gray-100'}
                        ${getKanjiColor(k)}
                        ${isInGroup && isAlternateGroup ? 'bg-gray-50/30' : ''}
                        ${isInGroup && isGroupEnd ? 'mr-2' : ''}
                        ${isInGroup && isLastInRow ? 'mb-2' : ''}
                      `}
                      onClick={() => setSelectedKanji(k)}
                      onMouseEnter={(e) => {
                        setTooltip({ kanji: k, x: e.clientX, y: e.clientY })
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    >
                      <span className={`font-bold leading-none ${
                        condensedView === 'super-condensed'
                          ? 'text-[10px]'
                          : 'text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px]'
                      }`}>
                        {k.letter}
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              /* Level View - Grouped by level */
              <div className="space-y-2">
                {Object.entries(groupedKanji).map(([level, levelKanji]) => (
                  <div key={level}>
                    {/* Level Separator */}
                    <div className="flex items-center mb-2">
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <div className={`px-3 py-1 mx-3 rounded-full text-xs font-medium ${getLevelColor(level)}`}>
                        {level}
                      </div>
                      <div className="flex-1 h-px bg-gray-300"></div>
                    </div>
                    
                    {/* Kanji Grid for this level with optional grouping */}
                    <div className="space-y-2">
                      {grouping === 'none' ? (
                        /* No grouping - show all kanji for this level */
                        <div className={`grid ${
                          condensedView === 'super-condensed'
                            ? 'gap-1 grid-cols-30 md:grid-cols-35 lg:grid-cols-40 xl:grid-cols-50 2xl:grid-cols-60'
                            : 'gap-1 grid-cols-8 md:grid-cols-12 lg:grid-cols-16 xl:grid-cols-20'
                        }`}>
                          {levelKanji.map((k, index) => {
                            const groupSize = grouping !== 'none' ? parseInt(grouping) : 0
                            const isInGroup = groupSize > 0
                            const groupIndex = Math.floor(index / groupSize)
                            const isAlternateGroup = groupIndex % 2 === 1
                            const isGroupEnd = isInGroup && ((index + 1) % groupSize === 0)
                            const isLastInRow = (index + 1) % (groupSize * Math.ceil(groupSize / 10)) === 0
                            
                            return (
                              <div
                                key={k.id}
                                className={`
                                  aspect-square flex items-center justify-center 
                                  cursor-pointer transition-all duration-200
                                  ${condensedView === 'super-condensed' ? 'hover:bg-blue-100' : 'hover:bg-gray-100'}
                                  ${getKanjiColor(k)}
                                  ${isInGroup && isAlternateGroup ? 'bg-gray-50/30' : ''}
                                  ${isInGroup && isGroupEnd ? 'mr-2' : ''}
                                  ${isInGroup && isLastInRow ? 'mb-2' : ''}
                                `}
                                onClick={() => setSelectedKanji(k)}
                                onMouseEnter={(e) => {
                                  setTooltip({ kanji: k, x: e.clientX, y: e.clientY })
                                }}
                                onMouseLeave={() => setTooltip(null)}
                              >
                                <span className={`font-bold leading-none ${
                                  condensedView === 'super-condensed'
                                    ? 'text-[10px]'
                                    : 'text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px]'
                                }`}>
                                  {k.letter}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        /* With grouping - show kanji in groups for this level */
                        createGroupedKanji(levelKanji.map(k => k.letter), parseInt(grouping)).map((group, groupIndex) => (
                          <div key={groupIndex} className="border border-gray-200 rounded p-1">
                            <div className={`grid ${
                              condensedView === 'super-condensed'
                                ? 'gap-1 grid-cols-30 md:grid-cols-35 lg:grid-cols-40 xl:grid-cols-50 2xl:grid-cols-60'
                                : 'gap-1 grid-cols-8 md:grid-cols-12 lg:grid-cols-16 xl:grid-cols-20'
                            }`}>
                              {group.map((k) => (
                                <div
                                  key={k}
                                  className={`
                                    aspect-square flex items-center justify-center 
                                    cursor-pointer transition-all duration-200
                                    ${condensedView === 'super-condensed' ? 'hover:bg-blue-100' : 'hover:bg-gray-100'}
                                    ${getKanjiColor({ letter: k, level: 'Unknown', reading: '', name: '', sound_equiv: '' } as JapaneseKanji)}
                                  `}
                                  onClick={() => setSelectedKanji({ letter: k, level: 'Unknown', reading: '', name: '', sound_equiv: '' } as JapaneseKanji)}
                                  onMouseEnter={(e) => {
                                    setTooltip({ kanji: { letter: k, level: 'Unknown', reading: '', name: '', sound_equiv: '' } as JapaneseKanji, x: e.clientX, y: e.clientY })
                                  }}
                                  onMouseLeave={() => setTooltip(null)}
                                >
                                  <span className={`font-bold leading-none ${
                                    condensedView === 'super-condensed'
                                      ? 'text-[10px]'
                                      : 'text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px]'
                                  }`}>
                                    {k}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className="text-center mt-1 text-xs text-gray-400">
                              Group {groupIndex + 1} ({group.length} kanji)
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Panel */}
          <div className="w-80 bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500 h-fit sticky top-28">
            {selectedKanji ? (
              <>
                <div className="text-center mb-4">
                  <div className="text-6xl font-bold text-gray-800 mb-2">
                    {selectedKanji.letter}
                  </div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getKanjiColor(selectedKanji)}`}>
                    {viewMode === 'level' ? `Level ${selectedKanji.level}` : `Performance: ${Math.round(userPerformance[selectedKanji.letter]?.successRate || 0)}%`}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Reading</label>
                    <div className="text-lg text-gray-800">{selectedKanji.reading}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Meaning</label>
                    <div className="text-lg text-gray-800">{selectedKanji.name}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Sound Equivalent</label>
                    <div className="text-lg text-gray-800">{selectedKanji.sound_equiv}</div>
                  </div>
                </div>

                {/* Words containing this kanji */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Words containing 「{selectedKanji.letter}」
                  </h3>
                  
                  {loadingWords ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">Finding words...</p>
                    </div>
                  ) : kanjiWords.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {kanjiWords.map((word, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-2 mb-2">
                            {word.headwords && word.headwords.length > 0 && (
                              <span className="text-lg font-bold text-gray-800">
                                {word.headwords[0]}
                              </span>
                            )}
                            {word.readings && word.readings.length > 0 && (
                              <span className="text-sm text-gray-600">
                                {word.readings[0]}
                              </span>
                            )}
                            {word.is_common && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                Common
                              </span>
                            )}
                          </div>
                          
                          <div className="text-sm text-gray-700 mb-2">
                            {word.glosses_en && word.glosses_en.length > 0 
                              ? word.glosses_en.slice(0, 2).join(', ')
                              : 'No English definition'
                            }
                          </div>
                          
                          {word.pos_tags && word.pos_tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {word.pos_tags.slice(0, 3).map((pos: string, idx: number) => (
                                <span key={idx} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                                  {pos}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">No words found containing this kanji</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500">
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Tooltip */}
      {tooltip && (
        <div 
          className="fixed z-50 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm pointer-events-none"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y + 20,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="font-bold text-lg mb-1">{tooltip.kanji.letter}</div>
          <div className="text-gray-300">{tooltip.kanji.reading}</div>
          <div className="text-gray-300">{tooltip.kanji.name}</div>
          {viewMode === 'performance' && userPerformance[tooltip.kanji.letter] && (
            <div className="text-gray-300 mt-1 pt-1 border-t border-gray-600">
              <div>Attempts: {userPerformance[tooltip.kanji.letter].totalAttempts}</div>
              <div>Success: {Math.round(userPerformance[tooltip.kanji.letter].successRate)}%</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
