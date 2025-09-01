'use client'

import { useEffect, useState } from 'react'
import { createClientBrowser, JapaneseKanji } from '@/lib/supabase'
import RegisterPopup from '@/app/components/elements/registerPopup'

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
  const [showRegisterPopup, setShowRegisterPopup] = useState(false)

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

  const handleViewModeChange = (mode: 'level' | 'performance') => {
    if (mode === 'performance' && !isAuthenticated) {
      setShowRegisterPopup(true)
      return
    }
    setViewMode(mode)
  }

  if (loading) {
    return (
      <div className="bg-white flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-12 h-12 bg-black relative mb-6">
            <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}></div>
            <div className="absolute inset-0 bg-black" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }}></div>
          </div>
          <h2 className="text-xl font-bold text-black tracking-wider">
            LOADING KANJI...
          </h2>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            {/* Sharp geometric logo */}
            <div className="w-12 h-12 bg-black relative">
              <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}></div>
              <div className="absolute inset-0 bg-black" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }}></div>
            </div>
            <h1 className="text-4xl font-bold text-black tracking-wider">
              JAPANESE KANJI POSTER
            </h1>
          </div>
          <div className="h-px w-32 bg-black mx-auto mb-4"></div>
          <p className="text-gray-600 tracking-wide">
            Interactive visual learning with comprehensive character coverage
          </p>
        </div>
        
        {/* View Toggle */}
        <div className="flex justify-center mb-8 gap-6">
          {/* View Mode Toggle */}
          <div className="border-2 border-black p-1 inline-flex">
            <button
              onClick={() => handleViewModeChange('level')}
              className={`w-32 h-12 text-sm font-medium tracking-wider transition-all hover:font-fugaz flex items-center justify-center cursor-pointer ${
                viewMode === 'level'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-gray-100'
              }`}
            >
              LEVEL VIEW
            </button>
            <button
              onClick={() => handleViewModeChange('performance')}
              className={`w-36 h-12 text-sm font-medium tracking-wider transition-all hover:font-fugaz flex items-center justify-center cursor-pointer ${
                viewMode === 'performance'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-gray-100'
              }`}
            >
              PERFORMANCE VIEW
            </button>
          </div>

          {/* Density View Toggle */}
          <div className="border-2 border-black p-1 inline-flex">
            <button
              onClick={() => setCondensedView('comfortable')}
              className={`w-20 h-12 text-sm font-medium tracking-wider transition-all hover:font-fugaz flex items-center justify-center cursor-pointer ${
                condensedView === 'comfortable'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-gray-100'
              }`}
            >
              LARGE
            </button>
            <button
              onClick={() => setCondensedView('super-condensed')}
              className={`w-24 h-12 text-sm font-medium tracking-wider transition-all hover:font-fugaz flex items-center justify-center cursor-pointer ${
                condensedView === 'super-condensed'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-gray-100'
              }`}
            >
              COMPACT
            </button>
          </div>

          {/* Show All Toggle */}
          <div className="border-2 border-black p-1 inline-flex">
            <button
              onClick={() => setShowAllKanji(false)}
              className={`w-24 h-12 text-sm font-medium tracking-wider transition-all hover:font-fugaz flex items-center justify-center cursor-pointer ${
                !showAllKanji
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-gray-100'
              }`}
            >
              BY LEVEL
            </button>
            <button
              onClick={() => setShowAllKanji(true)}
              className={`w-24 h-12 text-sm font-medium tracking-wider transition-all hover:font-fugaz flex items-center justify-center cursor-pointer ${
                showAllKanji
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-gray-100'
              }`}
            >
              SHOW ALL
            </button>
          </div>

          {/* Grouping Toggle */}
          <div className="border-2 border-black p-1 inline-flex">
            <button
              onClick={() => setGrouping('none')}
              className={`w-24 h-12 text-sm font-medium tracking-wider transition-all hover:font-fugaz flex items-center justify-center cursor-pointer ${
                grouping === 'none'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-gray-100'
              }`}
            >
              NO GROUPS
            </button>
            <button
              onClick={() => setGrouping('5')}
              className={`w-28 h-12 text-sm font-medium tracking-wider transition-all hover:font-fugaz flex items-center justify-center cursor-pointer ${
                grouping === '5'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-gray-100'
              }`}
            >
              GROUPS OF 5
            </button>
            <button
              onClick={() => setGrouping('10')}
              className={`w-32 h-12 text-sm font-medium tracking-wider transition-all hover:font-fugaz flex items-center justify-center cursor-pointer ${
                grouping === '10'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-gray-100'
              }`}
            >
              GROUPS OF 10
            </button>
            <button
              onClick={() => setGrouping('20')}
              className={`w-32 h-12 text-sm font-medium tracking-wider transition-all hover:font-fugaz flex items-center justify-center cursor-pointer ${
                grouping === '20'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-gray-100'
              }`}
            >
              GROUPS OF 20
            </button>
          </div>
        </div>
        
        {viewMode === 'performance' && !isAuthenticated && (
          <div className="text-center mb-8 text-yellow-600 bg-yellow-50 p-4 border-2 border-yellow-200">
            <div className="text-sm tracking-wide">
              <strong>PERFORMANCE VIEW:</strong> Sign in to see your quiz performance heatmap
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
                      <div className="flex-1 h-px bg-black"></div>
                      <div className={`px-3 py-1 mx-3 text-xs font-medium tracking-wider ${getLevelColor(level)}`}>
                        {level}
                      </div>
                      <div className="flex-1 h-px bg-black"></div>
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
                          <div key={groupIndex} className="border-2 border-black p-1">
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
                            <div className="text-center mt-1 text-xs text-gray-400 tracking-wide">
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
          <div className="w-80 bg-white p-8 border-2 border-black h-fit sticky top-28">
            {selectedKanji ? (
              <>
                <div className="text-center mb-8">
                  <div className="text-6xl font-bold text-black mb-4">
                    {selectedKanji.letter}
                  </div>
                  <div className={`inline-block px-4 py-2 text-sm font-medium tracking-wider ${getKanjiColor(selectedKanji)}`}>
                    {viewMode === 'level' ? `Level ${selectedKanji.level}` : `Performance: ${Math.round(userPerformance[selectedKanji.letter]?.successRate || 0)}%`}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-black tracking-wider uppercase">Reading</label>
                    <div className="text-lg text-black font-medium">{selectedKanji.reading}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-black tracking-wider uppercase">Meaning</label>
                    <div className="text-lg text-black font-medium">{selectedKanji.name}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-black tracking-wider uppercase">Sound Equivalent</label>
                    <div className="text-lg text-black font-medium">{selectedKanji.sound_equiv}</div>
                  </div>
                </div>

                {/* Words containing this kanji */}
                <div className="mt-8 pt-8 border-t-2 border-black">
                  <h3 className="text-lg font-semibold text-black mb-4 tracking-wider">
                    Words containing 「{selectedKanji.letter}」
                  </h3>
                  
                  {loadingWords ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2 tracking-wide">Finding words...</p>
                    </div>
                  ) : kanjiWords.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {kanjiWords.map((word, index) => (
                        <div key={index} className="bg-gray-50 border-2 border-gray-200 p-4 hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-2 mb-3">
                            {word.headwords && word.headwords.length > 0 && (
                              <span className="text-lg font-bold text-black">
                                {word.headwords[0]}
                              </span>
                            )}
                            {word.readings && word.readings.length > 0 && (
                              <span className="text-sm text-gray-600">
                                {word.readings[0]}
                              </span>
                            )}
                            {word.is_common && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 border border-green-200 tracking-wide">
                                Common
                              </span>
                            )}
                          </div>
                          
                          <div className="text-sm text-gray-700 mb-3">
                            {word.glosses_en && word.glosses_en.length > 0 
                              ? word.glosses_en.slice(0, 2).join(', ')
                              : 'No English definition'
                            }
                          </div>
                          
                          {word.pos_tags && word.pos_tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {word.pos_tags.slice(0, 3).map((pos: string, idx: number) => (
                                <span key={idx} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 border border-blue-200 tracking-wide">
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
                      <p className="text-sm tracking-wide">No words found containing this kanji</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500">
                <div className="w-16 h-16 bg-gray-100 border-2 border-gray-200 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl text-gray-400">字</span>
                </div>
                <p className="text-sm tracking-wide">Select a kanji to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Tooltip */}
      {tooltip && (
        <div 
          className="fixed z-50 bg-black text-white px-4 py-3 border-2 border-white shadow-lg text-sm pointer-events-none"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y + 30,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="font-bold text-lg mb-2">{tooltip.kanji.letter}</div>
          <div className="text-gray-300 mb-1">{tooltip.kanji.reading}</div>
          <div className="text-gray-300">{tooltip.kanji.name}</div>
          {viewMode === 'performance' && userPerformance[tooltip.kanji.letter] && (
            <div className="text-gray-300 mt-2 pt-2 border-t border-gray-600">
              <div>Attempts: {userPerformance[tooltip.kanji.letter].totalAttempts}</div>
              <div>Success: {Math.round(userPerformance[tooltip.kanji.letter].successRate)}%</div>
            </div>
          )}
        </div>
      )}

      {/* Register Popup */}
      <RegisterPopup 
        isOpen={showRegisterPopup} 
        onClose={() => setShowRegisterPopup(false)} 
      />
    </div>
  )
}
