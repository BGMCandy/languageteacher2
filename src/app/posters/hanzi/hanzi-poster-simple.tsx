'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { ChineseHanzi } from '@/lib/supabase'
import DetailsCard from './components/detailsCard'

// Types for our optimized data
interface HanziGridItem {
  char: string
  has_definition: boolean
  has_pinyin: boolean
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
  const [totalCount, setTotalCount] = useState(0)
  
  const preloadTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Load initial tile
  useEffect(() => {
    const loadInitialTile = async () => {
      try {
        setLoading(true)
        console.log('🚀 Loading initial hanzi characters...')
        
        const response = await fetch(`/api/hanzi/grid?offset=0&limit=2400&view=${viewMode}`)
        const data = await response.json()
        
        console.log('API Response:', data)
        
        if (data.items) {
          setTiles(data.items)
          setTotalCount(data.total)
          console.log(`⚡ Loaded ${data.items.length} characters!`)
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
    <div className="bg-white min-h-screen">
      <div className="w-full px-4 sm:px-8">
        {/* Header */}
        <div className="text-center py-16">
          <div className="flex items-center justify-center space-x-4 mb-3 sm:mb-6">
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
            Explore Chinese characters with definitions and pronunciations.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Showing {tiles.length.toLocaleString()} of {totalCount.toLocaleString()} characters
          </p>
        </div>
        
        {/* View Toggle */}
        <div className="flex flex-col sm:flex-row justify-center mb-6 sm:mb-8 gap-3 sm:gap-6">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setViewMode('definition')}
              className={`px-4 py-2 text-sm font-medium tracking-wider border-2 transition-colors ${
                viewMode === 'definition'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-black hover:bg-gray-50'
              }`}
            >
              DEFINITION
            </button>
            <button
              onClick={() => setViewMode('pronunciation')}
              className={`px-4 py-2 text-sm font-medium tracking-wider border-2 transition-colors ${
                viewMode === 'pronunciation'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-black hover:bg-gray-50'
              }`}
            >
              PRONUNCIATION
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-center items-center mb-6 sm:mb-8 gap-3 sm:gap-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-black tracking-wider">VIEW:</span>
            <button
              onClick={() => setCondensedView('comfortable')}
              className={`px-3 py-1 text-xs font-medium tracking-wider border transition-colors ${
                condensedView === 'comfortable'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-black hover:bg-gray-50'
              }`}
            >
              COMFORTABLE
            </button>
            <button
              onClick={() => setCondensedView('super-condensed')}
              className={`px-3 py-1 text-xs font-medium tracking-wider border transition-colors ${
                condensedView === 'super-condensed'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-black hover:bg-gray-50'
              }`}
            >
              CONDENSED
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Hanzi Grid */}
          <div className="flex-1 overflow-x-auto">
            <div className={`grid ${gridCols} ${gap} w-max mx-auto`}>
              {tiles.map((item, index) => (
                <button
                  key={`${item.char}-${index}`}
                  onClick={() => handleHanziClick(item)}
                  onMouseEnter={(e) => handleMouseEnter(item, e)}
                  onMouseLeave={handleMouseLeave}
                  className={`
                    aspect-square border-2 transition-all duration-200 hover:scale-105 hover:z-10 relative cursor-pointer
                    ${getHanziColor(item)}
                    ${fontSize}
                    font-medium flex items-center justify-center chinese-font-extended
                  `}
                >
                  {item.char}
                </button>
              ))}
            </div>
          </div>

          {/* Details Card */}
          <DetailsCard
            selectedHanzi={selectedHanzi}
            viewMode={viewMode}
            getHanziColor={(hanzi) => {
              // Convert ChineseHanzi to HanziGridItem for color calculation
              const item: HanziGridItem = {
                char: hanzi.char,
                has_definition: !!hanzi.kdefinition,
                has_pinyin: !!(hanzi.kmandarin && hanzi.kmandarin.length > 0)
              }
              return getHanziColor(item)
            }}
          />
        </div>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="fixed z-50 bg-black text-white text-xs px-2 py-1 rounded pointer-events-none"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: 'translateX(-50%) translateY(-100%)'
            }}
          >
            <div className="font-bold">{tooltip.hanzi.char}</div>
            {viewMode === 'definition' && tooltip.hanzi.has_definition && (
              <div>Has definition</div>
            )}
            {viewMode === 'pronunciation' && tooltip.hanzi.has_pinyin && (
              <div>Has pronunciation</div>
            )}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-black"></div>
          </div>
        )}
      </div>
    </div>
  )
}
