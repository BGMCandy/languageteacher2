'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { ChineseHanzi } from '@/lib/supabase'
import DetailsCard from './components/detailsCard'

// Types for our optimized data
interface HanziGridItem {
  char: string
  has_definition: boolean
  has_pinyin: boolean
  grade_level: number | null
}

// Global caches
const detailCache = new Map<string, ChineseHanzi>()
const preloadQueue = new Set<string>()

export default function HanziPosterSimple() {
  const [tiles, setTiles] = useState<HanziGridItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedHanzi, setSelectedHanzi] = useState<ChineseHanzi | null>(null)
  const [tooltip, setTooltip] = useState<{ hanzi: HanziGridItem; x: number; y: number } | null>(null)
  const [viewMode, setViewMode] = useState<'definition' | 'pronunciation'>('definition')
  const [condensedView, setCondensedView] = useState<'comfortable' | 'super-condensed'>('comfortable')
  const [gradeFilter, setGradeFilter] = useState<number | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  
  const preloadTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Load initial tile
  useEffect(() => {
    const loadInitialTile = async () => {
      try {
        setLoading(true)
        console.log('🚀 Loading initial hanzi characters...')
        
        const response = await fetch(`/api/hanzi/grid?offset=0&limit=10000&view=${viewMode}`)
        const data = await response.json()
        
        console.log('API Response:', data)
        
        if (data.items) {
          setTiles(data.items)
          setTotalCount(data.total)
          setHasMore(data.hasMore)
          console.log(`⚡ Loaded ${data.items.length} characters! Total: ${data.total}`)
          console.log('First few characters:', data.items.slice(0, 5))
        } else {
          console.error('No items in response:', data)
        }
      } catch (error) {
        console.error('Error loading initial tile:', error)
      } finally {
        setLoading(false)
      }
    }

    loadInitialTile()
  }, [viewMode])

  // Preload character details on hover
  const preloadCharacterDetails = useCallback(async (char: string) => {
    if (detailCache.has(char) || preloadQueue.has(char)) return
    
    preloadQueue.add(char)
    
    try {
      const response = await fetch(`/api/hanzi/detail?char=${encodeURIComponent(char)}`)
      const data = await response.json()
      
      if (data && !data.error) {
        detailCache.set(char, data)
        console.log(`💾 Cached details for: ${char}`)
      }
    } catch (error) {
      console.error(`Error preloading ${char}:`, error)
    } finally {
      preloadQueue.delete(char)
    }
  }, [])

  // Load more characters
  const loadMoreCharacters = useCallback(async () => {
    if (loadingMore || !hasMore) return
    
    try {
      setLoadingMore(true)
      const response = await fetch(`/api/hanzi/grid?offset=${tiles.length}&limit=1000&view=${viewMode}`)
      const data = await response.json()
      
      if (data.items && data.items.length > 0) {
        setTiles(prev => {
          const newTiles = [...prev, ...data.items]
          console.log(`📦 Loaded ${data.items.length} more characters! Total loaded: ${newTiles.length}`)
          console.log(`📊 New characters grade distribution:`, data.items.reduce((acc: Record<string, number>, item: any) => {
            const grade = item.grade_level || 'null'
            acc[grade] = (acc[grade] || 0) + 1
            return acc
          }, {}))
          return newTiles
        })
        setHasMore(data.hasMore)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error loading more characters:', error)
    } finally {
      setLoadingMore(false)
    }
  }, [tiles.length, viewMode, loadingMore, hasMore])

  // Load characters for a specific grade
  const loadGradeCharacters = useCallback(async (grade: number) => {
    if (loadingMore) return
    
    // Check if we already have characters from this grade
    const existingGradeCharacters = tiles.filter(item => item.grade_level === grade)
    if (existingGradeCharacters.length > 0) {
      console.log(`✅ Grade ${grade} characters already loaded: ${existingGradeCharacters.length}`)
      return
    }
    
    try {
      setLoadingMore(true)
      console.log(`🔄 Loading characters for Grade ${grade}...`)
      
      // Load a larger batch to get more characters from this specific grade
      const response = await fetch(`/api/hanzi/grid?offset=${tiles.length}&limit=5000&view=${viewMode}`)
      const data = await response.json()
      
      if (data.items && data.items.length > 0) {
        setTiles(prev => {
          const newTiles = [...prev, ...data.items]
          const gradeCharacters = newTiles.filter(item => item.grade_level === grade)
          console.log(`📦 Loaded ${data.items.length} more characters! Found ${gradeCharacters.length} Grade ${grade} characters`)
          return newTiles
        })
        setHasMore(data.hasMore)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error(`Error loading Grade ${grade} characters:`, error)
    } finally {
      setLoadingMore(false)
    }
  }, [tiles, viewMode, loadingMore])


  // Get color for hanzi based on view mode
  const getHanziColor = useCallback((item: HanziGridItem) => {
    if (viewMode === 'pronunciation') {
      return item.has_pinyin 
        ? 'bg-green-100 text-green-800 border-green-200'
        : 'bg-gray-100 text-gray-600 border-gray-200'
    } else {
      return item.has_definition 
        ? 'bg-blue-100 text-blue-800 border-blue-200'
        : 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }, [viewMode])

  // Handle hanzi click with smart caching
  const handleHanziClick = useCallback(async (item: HanziGridItem) => {
    // If we have cached data, use it immediately
    if (detailCache.has(item.char)) {
      const cachedHanzi = detailCache.get(item.char)!
      setSelectedHanzi(cachedHanzi)
      return
    }
    
    // Otherwise, fetch the full data
    try {
      const response = await fetch(`/api/hanzi/detail?char=${encodeURIComponent(item.char)}`)
      const data = await response.json()
      
      if (data && !data.error) {
        detailCache.set(item.char, data)
        setSelectedHanzi(data)
      } else {
        // Fallback to basic data
        setSelectedHanzi({
          char: item.char,
          kdefinition: item.has_definition ? 'Loading...' : undefined,
          kmandarin: item.has_pinyin ? ['Loading...'] : undefined
        } as ChineseHanzi)
      }
    } catch (error) {
      console.error(`Error fetching details for ${item.char}:`, error)
      setSelectedHanzi({
        char: item.char,
        kdefinition: item.has_definition ? 'Error loading' : undefined,
        kmandarin: item.has_pinyin ? ['Error loading'] : undefined
      } as ChineseHanzi)
    }
  }, [])

  // Handle mouse enter for tooltip and preloading
  const handleMouseEnter = useCallback((item: HanziGridItem, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setTooltip({
      hanzi: item,
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    })
    
    // Preload character details after a short delay
    if (preloadTimeoutRef.current) {
      clearTimeout(preloadTimeoutRef.current)
    }
    
    preloadTimeoutRef.current = setTimeout(() => {
      preloadCharacterDetails(item.char)
    }, 200) // 200ms delay
  }, [preloadCharacterDetails])

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setTooltip(null)
    if (preloadTimeoutRef.current) {
      clearTimeout(preloadTimeoutRef.current)
    }
  }, [])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current)
      }
    }
  }, [])

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="w-full px-4 sm:px-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading characters...</p>
          </div>
        </div>
      </div>
    )
  }

  const gridCols = condensedView === 'super-condensed' 
    ? 'grid-cols-16 sm:grid-cols-20 md:grid-cols-24 lg:grid-cols-28 xl:grid-cols-32 2xl:grid-cols-40'
    : 'grid-cols-12 sm:grid-cols-16 md:grid-cols-20 lg:grid-cols-24 xl:grid-cols-28 2xl:grid-cols-32'

  const gap = condensedView === 'super-condensed' ? 'gap-0.5 sm:gap-1' : 'gap-1 sm:gap-2'
  const fontSize = condensedView === 'super-condensed' ? 'text-xs' : 'text-sm sm:text-base'

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center py-16">
          <div className="flex items-center justify-center space-x-4 mb-3 sm:mb-6">
            {/* Sharp geometric logo */}
            <div className="w-12 h-12 bg-black relative">
              <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}></div>
              <div className="absolute inset-0 bg-black" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }}></div>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-black tracking-wider">
              CHINESE HANZI POSTER
            </h1>
          </div>
          <div className="h-px w-32 bg-black mx-auto mb-4"></div>
          <p className="text-gray-600 tracking-wide">
            If you wanna know Chinese - these are the essential Hanzi characters you need to learn.
          </p>
        </div>
        
        {/* View Toggle */}
        <div className="flex flex-col sm:flex-row justify-center mb-6 sm:mb-8 gap-3 sm:gap-6">
          {/* View Mode Toggle */}
          <div className="border-2 border-black p-1 inline-flex">
            <button
              onClick={() => setViewMode('definition')}
              className={`w-32 h-12 text-sm font-medium tracking-wider transition-all hover:font-fugaz flex items-center justify-center cursor-pointer ${
                viewMode === 'definition'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-gray-100'
              }`}
            >
              DEFINITION
            </button>
            <button
              onClick={() => setViewMode('pronunciation')}
              className={`w-36 h-12 text-sm font-medium tracking-wider transition-all hover:font-fugaz flex items-center justify-center cursor-pointer ${
                viewMode === 'pronunciation'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-gray-100'
              }`}
            >
              PRONUNCIATION
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

          {/* Grade Filter Toggle */}
          <div className="border-2 border-black p-1 inline-flex">
            <button
              onClick={() => setGradeFilter(null)}
              className={`w-24 h-12 text-sm font-medium tracking-wider transition-all hover:font-fugaz flex items-center justify-center cursor-pointer ${
                gradeFilter === null
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-gray-100'
              }`}
            >
              ALL GRADES
            </button>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
              <button
                key={grade}
                onClick={() => {
                  setGradeFilter(grade)
                  loadGradeCharacters(grade)
                }}
                className={`w-12 h-12 text-sm font-medium tracking-wider transition-all hover:font-fugaz flex items-center justify-center cursor-pointer ${
                  gradeFilter === grade
                    ? 'bg-black text-white'
                    : 'text-black hover:bg-gray-100'
                }`}
              >
                G{grade}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Hanzi Grid */}
          <div className="flex-1">
            {(() => {
              const filteredTiles = tiles.filter(item => gradeFilter === null || item.grade_level === gradeFilter);
              
              // Debug logging
              console.log(`🔍 Total tiles: ${tiles.length}, Filtered tiles: ${filteredTiles.length}, Grade filter: ${gradeFilter}`);
              
              if (gradeFilter) {
                // Show single grade
                return (
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center mb-2">
                        <div className="flex-1 h-px bg-black"></div>
                        <div className="px-3 py-1 mx-3 bg-blue-100 border-blue-300 text-blue-800 text-xs font-medium tracking-wider">
                          Grade {gradeFilter}
                        </div>
                        <div className="flex-1 h-px bg-black"></div>
                      </div>
                      
                      <div className={`grid ${
                        condensedView === 'super-condensed'
                          ? 'gap-1 grid-cols-15 sm:grid-cols-20 md:grid-cols-25 lg:grid-cols-30 xl:grid-cols-35 2xl:grid-cols-40'
                          : 'gap-1 grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-16'
                      }`}>
                        {filteredTiles.map((item, index) => (
                          <div
                            key={`${item.char}-${index}`}
                            className={`aspect-square flex items-center justify-center cursor-pointer transition-all duration-200 ${
                              condensedView === 'super-condensed' ? 'hover:bg-blue-100' : 'hover:bg-gray-100'
                            } ${getHanziColor(item)}`}
                            onClick={() => handleHanziClick(item)}
                            onMouseEnter={(e) => handleMouseEnter(item, e)}
                            onMouseLeave={handleMouseLeave}
                          >
                            <span className={`font-bold leading-none chinese-font-extended ${
                              condensedView === 'super-condensed'
                                ? 'text-[8px] sm:text-[10px]'
                                : 'text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px]'
                            }`}>
                              {item.char}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              } else {
                // Show by grade levels
                const grades = [...new Set(filteredTiles.map(item => item.grade_level).filter((grade): grade is number => grade !== null))].sort((a, b) => a - b);
                const nullGradeTiles = filteredTiles.filter(item => item.grade_level === null);
                
                return (
                  <div className="space-y-2">
                    {/* Show characters with specific grades */}
                    {grades.map(grade => {
                      const gradeTiles = filteredTiles.filter(item => item.grade_level === grade);
                      
                      const getGradeColor = (grade: number) => {
                        const colors = [
                          'bg-blue-100 border-blue-300 text-blue-800',      // Grade 1
                          'bg-yellow-100 border-yellow-300 text-yellow-800', // Grade 2
                          'bg-green-100 border-green-300 text-green-800',   // Grade 3
                          'bg-purple-100 border-purple-300 text-purple-800', // Grade 4
                          'bg-red-100 border-red-300 text-red-800',         // Grade 5
                          'bg-pink-100 border-pink-300 text-pink-800',      // Grade 6
                          'bg-indigo-100 border-indigo-300 text-indigo-800', // Grade 7
                          'bg-teal-100 border-teal-300 text-teal-800',      // Grade 8
                          'bg-orange-100 border-orange-300 text-orange-800', // Grade 9
                          'bg-cyan-100 border-cyan-300 text-cyan-800',      // Grade 10
                          'bg-lime-100 border-lime-300 text-lime-800',      // Grade 11
                          'bg-amber-100 border-amber-300 text-amber-800'    // Grade 12
                        ];
                        return colors[grade - 1] || 'bg-gray-100 border-gray-300 text-gray-800';
                      };
                      
                      return (
                        <div key={grade}>
                          <div className="flex items-center mb-2">
                            <div className="flex-1 h-px bg-black"></div>
                            <div className={`px-3 py-1 mx-3 text-xs font-medium tracking-wider ${getGradeColor(grade)}`}>
                              Grade {grade}
                            </div>
                            <div className="flex-1 h-px bg-black"></div>
                          </div>
                          
                          <div className={`grid ${
                            condensedView === 'super-condensed'
                              ? 'gap-1 grid-cols-15 sm:grid-cols-20 md:grid-cols-25 lg:grid-cols-30 xl:grid-cols-35 2xl:grid-cols-40'
                              : 'gap-1 grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-16'
                          }`}>
                            {gradeTiles.map((item, index) => (
                              <div
                                key={`${item.char}-${index}`}
                                className={`aspect-square flex items-center justify-center cursor-pointer transition-all duration-200 ${
                                  condensedView === 'super-condensed' ? 'hover:bg-blue-100' : 'hover:bg-gray-100'
                                } ${getHanziColor(item)}`}
                                onClick={() => handleHanziClick(item)}
                                onMouseEnter={(e) => handleMouseEnter(item, e)}
                                onMouseLeave={handleMouseLeave}
                              >
                                <span className={`font-bold leading-none chinese-font-extended ${
                                  condensedView === 'super-condensed'
                                    ? 'text-[8px] sm:text-[10px]'
                                    : 'text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px]'
                                }`}>
                                  {item.char}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Show characters with null grade level */}
                    {nullGradeTiles.length > 0 && (
                      <div>
                        <div className="flex items-center mb-2">
                          <div className="flex-1 h-px bg-black"></div>
                          <div className="px-3 py-1 mx-3 bg-gray-100 border-gray-300 text-gray-800 text-xs font-medium tracking-wider">
                            Other Characters ({nullGradeTiles.length})
                          </div>
                          <div className="flex-1 h-px bg-black"></div>
                        </div>
                        
                        <div className={`grid ${
                          condensedView === 'super-condensed'
                            ? 'gap-1 grid-cols-15 sm:grid-cols-20 md:grid-cols-25 lg:grid-cols-30 xl:grid-cols-35 2xl:grid-cols-40'
                            : 'gap-1 grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-16'
                        }`}>
                          {nullGradeTiles.map((item, index) => (
                            <div
                              key={`${item.char}-${index}`}
                              className={`aspect-square flex items-center justify-center cursor-pointer transition-all duration-200 ${
                                condensedView === 'super-condensed' ? 'hover:bg-blue-100' : 'hover:bg-gray-100'
                              } ${getHanziColor(item)}`}
                              onClick={() => handleHanziClick(item)}
                              onMouseEnter={(e) => handleMouseEnter(item, e)}
                              onMouseLeave={handleMouseLeave}
                            >
                              <span className={`font-bold leading-none chinese-font-extended ${
                                condensedView === 'super-condensed'
                                  ? 'text-[8px] sm:text-[10px]'
                                  : 'text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px]'
                              }`}>
                                {item.char}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
            })()}
            
            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-8 mb-4">
                <button
                  onClick={loadMoreCharacters}
                  disabled={loadingMore}
                  className="px-6 py-3 bg-black text-white font-medium tracking-wider border-2 border-black hover:bg-white hover:text-black transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {loadingMore ? 'Loading...' : 'Load More Characters'}
                </button>
              </div>
            )}
          </div>

          {/* Desktop Details Panel */}
          <DetailsCard
            selectedHanzi={selectedHanzi}
            viewMode={viewMode}
            getHanziColor={(hanzi) => {
              // Convert ChineseHanzi to HanziGridItem for color calculation
              const item: HanziGridItem = {
                char: hanzi.char,
                has_definition: !!hanzi.kdefinition,
                has_pinyin: !!(hanzi.kmandarin && hanzi.kmandarin.length > 0),
                grade_level: null // DetailsCard doesn't need grade level for color calculation
              }
              return getHanziColor(item)
            }}
          />
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
            <div className="font-bold text-lg mb-2 chinese-font-extended">{tooltip.hanzi.char}</div>
            {tooltip.hanzi.grade_level && (
              <div className="text-gray-300">Grade {tooltip.hanzi.grade_level}</div>
            )}
            {viewMode === 'definition' && tooltip.hanzi.has_definition && (
              <div className="text-gray-300">Has definition</div>
            )}
            {viewMode === 'pronunciation' && tooltip.hanzi.has_pinyin && (
              <div className="text-gray-300">Has pronunciation</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
