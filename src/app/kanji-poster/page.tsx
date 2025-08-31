'use client'

import { useEffect, useState } from 'react'
import { createClientBrowser, JapaneseKanji } from '@/lib/supabase'

export default function KanjiPoster() {
  const [kanji, setKanji] = useState<JapaneseKanji[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedKanji, setSelectedKanji] = useState<JapaneseKanji | null>(null)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [tooltip, setTooltip] = useState<{ kanji: JapaneseKanji; x: number; y: number } | null>(null)
  const [viewMode, setViewMode] = useState<'level' | 'performance'>('level')
  const [userPerformance, setUserPerformance] = useState<Record<string, { totalAttempts: number; correctAttempts: number; successRate: number }>>({})
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [condensedView, setCondensedView] = useState<'comfortable' | 'condensed' | 'super-condensed'>('comfortable')
  const [showAllKanji, setShowAllKanji] = useState(false)

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
        
        performanceData?.forEach(item => {
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

  // Group kanji by level for rendering separators
  const groupedKanji = kanji.reduce((groups, k) => {
    const level = k.level
    if (!groups[level]) {
      groups[level] = []
    }
    groups[level].push(k)
    return groups
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

          {/* Condensed View Toggle */}
          <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
            <button
              onClick={() => setCondensedView('comfortable')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                condensedView === 'comfortable'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              Comfortable
            </button>
            <button
              onClick={() => setCondensedView('condensed')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                condensedView === 'condensed'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              Condensed
            </button>
            <button
              onClick={() => setCondensedView('super-condensed')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                condensedView === 'super-condensed'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              Super Condensed
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
        </div>
        
        {viewMode === 'performance' && !isAuthenticated && (
          <div className="text-center mb-4 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
            <div className="text-sm">
              <strong>Performance View:</strong> Sign in to see your quiz performance heatmap
            </div>
          </div>
        )}
        
        {viewMode === 'performance' && isAuthenticated && (
          <div className="text-center mb-4 text-blue-600 bg-blue-50 p-3 rounded-lg">
            <div className="text-sm">
              <strong>Performance Legend:</strong> 
              <span className="text-green-600"> Green = Good</span> | 
              <span className="text-yellow-600"> Yellow = Okay</span> | 
              <span className="text-orange-600"> Orange = Needs Work</span> | 
              <span className="text-red-600"> Red = Struggling</span>
              <br />
              <span className="text-gray-600">Brighter = More practice attempts</span>
            </div>
          </div>
        )}
        
        <div className="flex gap-8">
          {/* Kanji Grid */}
          <div className="flex-1">
            {showAllKanji ? (
              /* All Kanji View - Single condensed grid */
              <div className={`grid ${
                condensedView === 'super-condensed'
                  ? 'gap-1 grid-cols-40 md:grid-cols-50 lg:grid-cols-60 xl:grid-cols-80 2xl:grid-cols-100'
                  : condensedView === 'condensed'
                    ? 'gap-0.5 grid-cols-45 md:grid-cols-55 lg:grid-cols-70 xl:grid-cols-85 2xl:grid-cols-110'
                    : 'gap-1 grid-cols-25 md:grid-cols-30 lg:grid-cols-35 xl:grid-cols-40'
              }`}>
                {kanji.map((k) => (
                  <div
                    key={k.id}
                    className={`
                      aspect-square flex items-center justify-center 
                      cursor-pointer transition-all duration-200
                      ${condensedView === 'super-condensed' ? 'hover:bg-blue-100' : 'hover:bg-gray-100'}
                      ${getKanjiColor(k)}
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
                        : condensedView === 'condensed'
                          ? 'text-[11px] md:text-[12px] lg:text-[13px] xl:text-[14px]'
                          : 'text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px]'
                    }`}>
                      {k.letter}
                    </span>
                  </div>
                ))}
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
                    
                    {/* Kanji Grid for this level */}
                    <div className={`grid ${
                      condensedView === 'super-condensed'
                        ? 'gap-1 grid-cols-30 md:grid-cols-35 lg:grid-cols-40 xl:grid-cols-50 2xl:grid-cols-60'
                        : condensedView === 'condensed'
                          ? 'gap-0.5 grid-cols-35 md:grid-cols-40 lg:grid-cols-45 xl:grid-cols-55 2xl:grid-cols-70'
                          : 'gap-1 grid-cols-8 md:grid-cols-12 lg:grid-cols-16 xl:grid-cols-20'
                    }`}>
                      {levelKanji.map((k) => (
                        <div
                          key={k.id}
                          className={`
                            aspect-square flex items-center justify-center 
                            cursor-pointer transition-all duration-200
                            ${condensedView === 'super-condensed' ? 'hover:bg-blue-100' : 'hover:bg-gray-100'}
                            ${getKanjiColor(k)}
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
                              : condensedView === 'condensed'
                                ? 'text-[11px] md:text-[12px] lg:text-[13px] xl:text-[14px]'
                                : 'text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px]'
                          }`}>
                            {k.letter}
                          </span>
                        </div>
                      ))}
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
              </>
            ) : (
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">👆</div>
                <div className="text-sm">Hover over a kanji to see details</div>
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
