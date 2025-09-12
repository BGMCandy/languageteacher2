'use client'

import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ChineseHanzi } from '@/lib/supabase'
import DetailsCard from './components/detailsCard'

// Types for our optimized data
interface HanziGridItem {
  char: string
  has_definition: boolean
  has_pinyin: boolean
}

interface TileCache {
  [key: string]: HanziGridItem[]
}

// Constants
const TILE_SIZE = 2400 // Items per tile
const COLS = 40 // Grid columns
const CELL_SIZE = 40 // Cell size in pixels
const BUFFER = 5 // Extra rows to render outside viewport

// Global caches
const tileCache: TileCache = {}
const detailCache = new Map<string, ChineseHanzi>()
const preloadQueue = new Set<string>()

export default function HanziPosterOptimized() {
  const [tiles, setTiles] = useState<HanziGridItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedHanzi, setSelectedHanzi] = useState<ChineseHanzi | null>(null)
  const [tooltip, setTooltip] = useState<{ hanzi: HanziGridItem; x: number; y: number } | null>(null)
  const [viewMode, setViewMode] = useState<'definition' | 'pronunciation'>('definition')
  const [condensedView, setCondensedView] = useState<'comfortable' | 'super-condensed'>('comfortable')
  const [totalCount, setTotalCount] = useState(0)
  
  const parentRef = useRef<HTMLDivElement>(null)
  const preloadTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Load initial tile
  useEffect(() => {
    const loadInitialTile = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/hanzi/grid?offset=0&limit=${TILE_SIZE}&view=${viewMode}`)
        const data = await response.json()
        
        if (data.items) {
          setTiles(data.items)
          setTotalCount(data.total)
          tileCache['0'] = data.items
          console.log(`🚀 Loaded ${data.items.length} characters instantly!`)
        }
      } catch (error) {
        console.error('Error loading initial tile:', error)
      } finally {
        setLoading(false)
      }
    }

    loadInitialTile()
  }, [viewMode])

  // Virtualization setup
  const ROWS = Math.ceil(totalCount / COLS)
  
  const virtualizer = useVirtualizer({
    count: ROWS,
    getScrollElement: () => parentRef.current,
    estimateSize: () => CELL_SIZE,
    overscan: BUFFER,
  })

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

  // Batch prefetch neighbors
  const prefetchNeighbors = useCallback(async (char: string, index: number) => {
    const neighbors: string[] = []
    
    // Get surrounding characters (up to 20)
    const start = Math.max(0, index - 10)
    const end = Math.min(tiles.length, index + 10)
    
    for (let i = start; i < end; i++) {
      if (tiles[i] && !detailCache.has(tiles[i].char)) {
        neighbors.push(tiles[i].char)
      }
    }
    
    if (neighbors.length > 0) {
      try {
        const response = await fetch('/api/hanzi/detail-batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chars: neighbors })
        })
        const data = await response.json()
        
        Object.entries(data).forEach(([char, details]) => {
          detailCache.set(char, details as ChineseHanzi)
        })
        
        console.log(`📦 Batch cached ${Object.keys(data).length} characters`)
      } catch (error) {
        console.error('Error batch prefetching:', error)
      }
    }
  }, [tiles])

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
  const handleHanziClick = useCallback(async (item: HanziGridItem, index: number) => {
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
  const handleMouseEnter = useCallback((item: HanziGridItem, index: number, event: React.MouseEvent) => {
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
      prefetchNeighbors(item.char, index)
    }, 200) // 200ms delay
  }, [preloadCharacterDetails, prefetchNeighbors])

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

  // Memoized grid rendering
  const gridContent = useMemo(() => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
        </div>
      )
    }

    const cellSize = condensedView === 'super-condensed' ? 32 : CELL_SIZE
    const fontSize = condensedView === 'super-condensed' ? 'text-xs' : 'text-sm'

    return (
      <div
        ref={parentRef}
        className="h-96 overflow-auto border border-gray-200"
        style={{ height: '600px' }}
      >
        <div
          style={{
            height: virtualizer.getTotalSize(),
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => (
            <div
              key={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
                display: 'grid',
                gridTemplateColumns: `repeat(${COLS}, ${cellSize}px)`,
                gap: '2px',
                padding: '4px',
              }}
            >
              {Array.from({ length: COLS }).map((_, colIndex) => {
                const itemIndex = virtualRow.index * COLS + colIndex
                const item = tiles[itemIndex]
                
                if (!item) return null
                
                return (
                  <button
                    key={itemIndex}
                    onClick={() => handleHanziClick(item, itemIndex)}
                    onMouseEnter={(e) => handleMouseEnter(item, itemIndex, e)}
                    onMouseLeave={handleMouseLeave}
                    className={`
                      ${getHanziColor(item)}
                      ${fontSize}
                      font-medium flex items-center justify-center chinese-font-extended
                      border-2 transition-all duration-200 hover:scale-105 hover:z-10 relative cursor-pointer
                    `}
                    style={{
                      width: `${cellSize}px`,
                      height: `${cellSize}px`,
                    }}
                  >
                    {item.char}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }, [loading, tiles, virtualizer, condensedView, getHanziColor, handleHanziClick, handleMouseEnter, handleMouseLeave])

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
          {!loading && (
            <p className="text-sm text-gray-500 mt-2">
              Showing {tiles.length.toLocaleString()} of {totalCount.toLocaleString()} characters
            </p>
          )}
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
          <div className="flex-1">
            {gridContent}
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
