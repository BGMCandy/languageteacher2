'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClientBrowser, ChineseHanzi } from '@/lib/supabase'
import DetailsCard from './components/detailsCard'

// Skeleton component for hanzi grid
const HanziSkeleton = () => (
  <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-20 xl:grid-cols-24 gap-1 sm:gap-2">
    {Array.from({ length: 200 }).map((_, i) => (
      <div key={i} className="aspect-square bg-gray-100 border border-gray-200 animate-pulse"></div>
    ))}
  </div>
)



export default function HanziPoster() {
  const [hanzi, setHanzi] = useState<ChineseHanzi[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedHanzi, setSelectedHanzi] = useState<ChineseHanzi | null>(null)
  const [tooltip, setTooltip] = useState<{ hanzi: ChineseHanzi; x: number; y: number } | null>(null)
  const [viewMode, setViewMode] = useState<'definition' | 'pronunciation'>('definition')
  const [condensedView, setCondensedView] = useState<'comfortable' | 'super-condensed'>('comfortable')



  // Fetch hanzi data with pagination
  useEffect(() => {
    const fetchHanzi = async () => {
      try {
        setLoading(true)
        const supabase = createClientBrowser()
        
        console.log('Fetching hanzi characters...')
        
        // First, get the total count
        const { count, error: countError } = await supabase
          .from('hanzi_characters')
          .select('*', { count: 'exact', head: true })
          .not('kdefinition', 'is', null)
        
        if (countError) {
          console.error('Error getting count:', countError)
          return
        }
        
        console.log(`Total characters with definitions: ${count}`)
        
        // Fetch all records in chunks
        const allData: ChineseHanzi[] = []
        const pageSize = 1000
        const totalPages = Math.ceil((count || 0) / pageSize)
        
        for (let page = 0; page < totalPages; page++) {
          const { data, error } = await supabase
            .from('hanzi_characters')
            .select('*')
            .not('kdefinition', 'is', null)
            .order('char')
            .range(page * pageSize, (page + 1) * pageSize - 1)
          
          if (error) {
            console.error(`Error fetching page ${page}:`, error)
            break
          }
          
          if (data) {
            allData.push(...data)
            console.log(`Loaded page ${page + 1}/${totalPages}: ${data.length} characters`)
          }
        }

        setHanzi(allData)
        console.log(`Total loaded: ${allData.length} hanzi characters`)
        
        // Debug: Check for problematic characters (CJK Extension A)
        const extensionAChars = allData.filter(h => 
          h.char.length === 1 && 
          h.char.charCodeAt(0) >= 0x3400 && 
          h.char.charCodeAt(0) <= 0x4DBF
        ).slice(0, 10)
        
        console.log('CJK Extension A characters (likely the "4 lines" ones):', extensionAChars.map(h => ({
          char: h.char,
          unicode: `U+${h.char.charCodeAt(0).toString(16).toUpperCase()}`,
          definition: h.kdefinition
        })))
        
        // Also check for any characters that might be rendering as boxes
        const allUnicodeRanges = allData.reduce((acc, h) => {
          if (h.char.length === 1) {
            const code = h.char.charCodeAt(0)
            const range = Math.floor(code / 0x1000) * 0x1000
            acc[range] = (acc[range] || 0) + 1
          }
          return acc
        }, {} as Record<number, number>)
        
        console.log('Unicode ranges in data:', Object.entries(allUnicodeRanges)
          .map(([range, count]) => `U+${parseInt(range).toString(16).toUpperCase()}: ${count} chars`)
          .slice(0, 10))
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHanzi()
  }, [])

  // Get color for hanzi based on view mode
  const getHanziColor = useCallback((hanzi: ChineseHanzi) => {
    if (viewMode === 'pronunciation') {
      if (hanzi.kmandarin && hanzi.kmandarin.length > 0) {
        return 'bg-green-100 text-green-800 border-green-200'
      }
      return 'bg-gray-100 text-gray-600 border-gray-200'
    } else {
      if (hanzi.kdefinition) {
        return 'bg-blue-100 text-blue-800 border-blue-200'
      }
      return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }, [viewMode])

  // Handle hanzi click
  const handleHanziClick = (hanzi: ChineseHanzi) => {
    setSelectedHanzi(hanzi)
  }

  // Handle mouse enter for tooltip
  const handleMouseEnter = (hanzi: ChineseHanzi, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setTooltip({
      hanzi,
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    })
  }

  // Handle mouse leave
  const handleMouseLeave = () => {
    setTooltip(null)
  }



  // Render hanzi grid
  const renderHanziGrid = () => {
    if (loading) {
      return <HanziSkeleton />
    }

    const gridCols = condensedView === 'super-condensed' 
      ? 'grid-cols-16 sm:grid-cols-20 md:grid-cols-24 lg:grid-cols-28 xl:grid-cols-32 2xl:grid-cols-40'
      : 'grid-cols-12 sm:grid-cols-16 md:grid-cols-20 lg:grid-cols-24 xl:grid-cols-28 2xl:grid-cols-32'

    const gap = condensedView === 'super-condensed' ? 'gap-0.5 sm:gap-1' : 'gap-1 sm:gap-2'

    return (
      <div className={`grid ${gridCols} ${gap} w-max mx-auto`}>
        {hanzi.map((h) => (
          <button
            key={h.char}
            onClick={() => handleHanziClick(h)}
            onMouseEnter={(e) => handleMouseEnter(h, e)}
            onMouseLeave={handleMouseLeave}
            className={`
              aspect-square border-2 transition-all duration-200 hover:scale-105 hover:z-10 relative cursor-pointer
              ${getHanziColor(h)}
              ${condensedView === 'super-condensed' ? 'text-xs' : 'text-sm sm:text-base'}
              font-medium flex items-center justify-center chinese-font-extended
            `}
          >
            {h.char}
          </button>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gray-200 animate-pulse mx-auto mb-4"></div>
            <div className="h-8 bg-gray-200 animate-pulse w-64 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 animate-pulse w-96 mx-auto"></div>
          </div>
          <HanziSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="w-full px-4 sm:px-8">
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
            Explore Chinese characters with definitions and pronunciations.
          </p>
          {!loading && (
            <p className="text-sm text-gray-500 mt-2">
              Showing {hanzi.length.toLocaleString()} characters
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
          <div className="flex-1 overflow-x-auto">
            {renderHanziGrid()}
          </div>

          {/* Details Card */}
          <DetailsCard
            selectedHanzi={selectedHanzi}
            viewMode={viewMode}
            getHanziColor={getHanziColor}
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
            {viewMode === 'definition' && tooltip.hanzi.kdefinition && (
              <div>{tooltip.hanzi.kdefinition}</div>
            )}
            {viewMode === 'pronunciation' && tooltip.hanzi.kmandarin && tooltip.hanzi.kmandarin.length > 0 && (
              <div>{tooltip.hanzi.kmandarin[0]}</div>
            )}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-black"></div>
          </div>
        )}
      </div>


    </div>
  )
}
