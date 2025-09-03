'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClientBrowser, ThaiConsonant, ThaiVowel, ThaiTone } from '@/lib/supabase'
import RegisterPopup from '@/app/components/elements/registerPopup'
import DetailsCard from './components/detailsCard'

// Skeleton component for Thai character grid
const ThaiSkeleton = () => {
  return (
    <div className="space-y-2">
      {/* Type skeleton */}
      <div className="flex items-center mb-2">
        <div className="flex-1 h-px bg-gray-200"></div>
        <div className="px-3 py-1 mx-3 bg-gray-200 h-6 w-24 animate-pulse"></div>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>
      
      {/* Character grid skeleton */}
      <div className="grid gap-1 grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-16">
        {Array.from({ length: 44 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square bg-gray-200 animate-pulse"
            style={{
              animationDelay: `${index * 0.05}s`,
              animationDuration: '1.5s'
            }}
          ></div>
        ))}
      </div>
    </div>
  )
}

// Shimmer effect component
const ShimmerCard = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`relative overflow-hidden bg-gray-200 ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
    </div>
  )
}

export default function ThaiScriptPoster() {
  const [consonants, setConsonants] = useState<ThaiConsonant[]>([])
  const [vowels, setVowels] = useState<ThaiVowel[]>([])
  const [tones, setTones] = useState<ThaiTone[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCharacter, setSelectedCharacter] = useState<ThaiConsonant | ThaiVowel | ThaiTone | null>(null)
  const [tooltip, setTooltip] = useState<{ character: ThaiConsonant | ThaiVowel | ThaiTone; x: number; y: number } | null>(null)
  const [viewMode, setViewMode] = useState<'type' | 'performance'>('type')
  const [userPerformance] = useState<Record<string, { totalAttempts: number; correctAttempts: number; successRate: number }>>({})
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showRegisterPopup, setShowRegisterPopup] = useState(false)
  const [isSheetExpanded, setIsSheetExpanded] = useState(false)

  // Helper functions for character properties
  const getCharacterKey = (char: ThaiConsonant | ThaiVowel | ThaiTone): string => {
    if ('letter' in char) {
      return (char as { letter: string }).letter
    }
    if ('mark' in char) {
      return (char as { mark: string }).mark
    }
    return 'Unknown'
  }

  const getCharacterName = (char: ThaiConsonant | ThaiVowel | ThaiTone): string => {
    if ('name' in char) {
      return (char as { name: string }).name
    }
    if ('tonename' in char) {
      return (char as { tonename: string }).tonename
    }
    return 'Unknown'
  }

  const getCharacterType = (char: ThaiConsonant | ThaiVowel | ThaiTone): string => {
    if ('class' in char) {
      return (char as { class: string }).class
    }
    if ('length' in char) {
      return (char as { length: string }).length
    }
    return 'tone'
  }

  const getCharacterSound = (char: ThaiConsonant | ThaiVowel | ThaiTone): string => {
    if ('sound_equiv' in char) {
      return (char as { sound_equiv: string }).sound_equiv
    }
    if ('pronunciation' in char) {
      return (char as { pronunciation: string }).pronunciation
    }
    return 'N/A'
  }

  const getCharacterExample = (char: ThaiConsonant | ThaiVowel | ThaiTone): string => {
    if ('example' in char) {
      return (char as { example: string }).example
    }
    return 'N/A'
  }

  // Fetch Thai characters from database
  useEffect(() => {
    const fetchThaiData = async () => {
      try {
        setLoading(true)
        const supabase = createClientBrowser()
        
        // Fetch consonants
        const { data: consonantsData, error: consonantsError } = await supabase
          .from('thai_consonants')
          .select('*')
          .order('idx')
        
        if (consonantsError) {
          console.error('Error fetching consonants:', consonantsError)
        } else {
          setConsonants(consonantsData || [])
        }
        
        // Fetch vowels
        const { data: vowelsData, error: vowelsError } = await supabase
          .from('thai_vowels')
          .select('*')
          .order('id')
        
        if (vowelsError) {
          console.error('Error fetching vowels:', vowelsError)
        } else {
          setVowels(vowelsData || [])
        }
        
        // Fetch tones
        const { data: tonesData, error: tonesError } = await supabase
          .from('thai_tones')
          .select('*')
          .order('id')
        
        if (tonesError) {
          console.error('Error fetching tones:', tonesError)
        } else {
          setTones(tonesData || [])
        }
        
      } catch (err) {
        console.error('Error fetching Thai data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchThaiData()
  }, [])

  // Fetch user performance data (placeholder for now)
  const fetchUserPerformance = useCallback(async () => {
    try {
      const supabase = createClientBrowser()
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setIsAuthenticated(false)
        return
      }
      
      setIsAuthenticated(true)
      console.log('Thai performance data not yet implemented')
      
      // TODO: Implement Thai performance data fetching
      // This would be similar to the kanji performance but using quiz_results_thai and quiz_answers_thai
      
    } catch (err) {
      console.error('Error fetching Thai performance data:', err)
    }
  }, [])

  useEffect(() => {
    fetchUserPerformance()
  }, [fetchUserPerformance])

  const getTypeColor = (type: string, className?: string) => {
    switch (type) {
      case 'consonant':
        if (className === 'mid') return 'bg-blue-100 border-blue-300 text-blue-800'
        if (className === 'high') return 'bg-red-100 border-red-300 text-red-800'
        if (className === 'low') return 'bg-green-100 border-green-300 text-green-800'
        return 'bg-gray-100 border-gray-300 text-gray-800'
      case 'vowel':
        if (className === 'long') return 'bg-purple-100 border-purple-300 text-purple-800'
        if (className === 'short') return 'bg-orange-100 border-orange-300 text-orange-800'
        return 'bg-gray-100 border-gray-300 text-gray-800'
      case 'tone':
        return 'bg-gray-100 border-gray-300 text-gray-800'
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }

  const getPerformanceColor = (character: string) => {
    const performance = userPerformance[character]
    
    if (!performance || performance.totalAttempts === 0) {
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
    
    const opacity = Math.min(0.3 + (performance.totalAttempts * 0.1), 1.0)
    
    const colorMap = {
      green: `bg-green-100 border-green-300 text-green-800`,
      yellow: `bg-yellow-100 border-yellow-300 text-yellow-800`,
      orange: `bg-orange-100 border-orange-300 text-orange-800`,
      red: `bg-red-100 border-red-300 text-red-800`
    }
    
    return `${colorMap[baseColor as keyof typeof colorMap]} opacity-${Math.round(opacity * 100)}`
  }

  const getCharacterColor = (character: ThaiConsonant | ThaiVowel | ThaiTone) => {
    if (viewMode === 'type') {
      if ('class' in character) {
        return getTypeColor('consonant', character.class)
      } else if ('length' in character) {
        return getTypeColor('vowel', character.length)
      } else {
        return getTypeColor('tone')
      }
    } else {
      const charKey = 'letter' in character ? character.letter : character.mark
      return getPerformanceColor(charKey)
    }
  }

  const handleViewModeChange = (mode: 'type' | 'performance') => {
    if (mode === 'performance' && !isAuthenticated) {
      setShowRegisterPopup(true)
      return
    }
    setViewMode(mode)
  }

  const handleCharacterSelect = (character: ThaiConsonant | ThaiVowel | ThaiTone) => {
    setSelectedCharacter(character)
    setIsSheetExpanded(false)
  }

  // Group characters by type
  const groupedCharacters = {
    consonants: consonants,
    vowels: vowels,
    tones: tones
  }

  if (loading) {
    return (
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          {/* Header */}
          <div className="text-center py-16">
            <div className="flex items-center justify-center space-x-4 mb-3 sm:mb-6">
              <div className="w-12 h-12 bg-black relative">
                <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}></div>
                <div className="absolute inset-0 bg-black" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }}></div>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-black tracking-wider">
                THAI SCRIPT POSTER
              </h1>
            </div>
            <div className="h-px w-32 bg-black mx-auto mb-4"></div>
            <p className="text-gray-600 tracking-wide">
              Learn the Thai alphabet with consonants, vowels, and tones.
            </p>
          </div>
          
          {/* View Toggle Skeleton */}
          <div className="flex flex-col sm:flex-row justify-center mb-6 sm:mb-8 gap-3 sm:gap-6">
            <div className="border-2 border-gray-200 p-1 inline-flex">
              <ShimmerCard className="w-32 h-12"></ShimmerCard>
              <ShimmerCard className="w-36 h-12"></ShimmerCard>
            </div>
          </div>
          
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, typeIndex) => (
              <ThaiSkeleton key={typeIndex} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center py-16">
          <div className="flex items-center justify-center space-x-4 mb-3 sm:mb-6">
            <div className="w-12 h-12 bg-black relative">
              <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}></div>
              <div className="absolute inset-0 bg-black" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }}></div>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-black tracking-wider">
              THAI SCRIPT POSTER
            </h1>
          </div>
          <div className="h-px w-32 bg-black mx-auto mb-4"></div>
          <p className="text-gray-600 tracking-wide">
            Learn the Thai alphabet with consonants, vowels, and tones.
          </p>
        </div>
        
        {/* View Toggle */}
        <div className="flex flex-col sm:flex-row justify-center mb-6 sm:mb-8 gap-3 sm:gap-6">
          {/* View Mode Toggle */}
          <div className="border-2 border-black p-1 inline-flex">
            <button
              onClick={() => handleViewModeChange('type')}
              className={`w-32 h-12 text-sm font-medium tracking-wider transition-all hover:font-fugaz flex items-center justify-center cursor-pointer ${
                viewMode === 'type'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-gray-100'
              }`}
            >
              TYPE VIEW
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
        </div>
        
        {viewMode === 'performance' && !isAuthenticated && (
          <div className="text-center mb-8 text-yellow-600 bg-yellow-50 p-4 border-2 border-yellow-200">
            <div className="text-sm tracking-wide">
              <strong>PERFORMANCE VIEW:</strong> Sign in to see your quiz performance heatmap
            </div>
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Character Grid */}
          <div className="flex-1">
            <div className="space-y-2">
              {Object.entries(groupedCharacters).map(([type, characters]) => (
                <div key={type}>
                  {/* Type Separator */}
                  <div className="flex items-center mb-2">
                    <div className="flex-1 h-px bg-black"></div>
                    <div className="px-3 py-1 mx-3 text-xs font-medium tracking-wider bg-gray-100 border border-gray-300 text-gray-800">
                      {type.toUpperCase()} ({characters.length})
                    </div>
                    <div className="flex-1 h-px bg-black"></div>
                  </div>
                  
                  {/* Character Grid */}
                  <div className="grid gap-1 grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-16">
                    {characters.map((character) => (
                      <div
                        key={'idx' in character ? character.idx : character.id}
                        className={`
                          aspect-square flex items-center justify-center 
                          cursor-pointer transition-all duration-200
                          hover:bg-gray-100
                          ${getCharacterColor(character)}
                        `}
                        onClick={() => handleCharacterSelect(character)}
                        onMouseEnter={(e) => {
                          setTooltip({ character, x: e.clientX, y: e.clientY })
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      >
                        <span className="font-bold leading-none text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px]">
                          {'letter' in character ? character.letter : character.mark}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Details Panel */}
          <DetailsCard
            selectedCharacter={selectedCharacter}
            viewMode={viewMode}
            userPerformance={userPerformance}
            getCharacterColor={getCharacterColor}
          />
        </div>
      </div>
      
      {/* Mobile Bottom Sheet */}
      {selectedCharacter && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
          <div className={`bg-white border-t-2 border-black transition-transform duration-300 ease-out ${
            isSheetExpanded ? 'transform translate-y-0' : 'transform translate-y-full'
          }`}>
            {/* Drag Handle */}
            <div 
              className="flex justify-center py-3 cursor-pointer"
              onClick={() => setIsSheetExpanded(!isSheetExpanded)}
            >
              <div className="w-12 h-1 bg-gray-400 rounded-full"></div>
            </div>
            
            {/* Collapsed View - Basic Info */}
            <div className={`px-4 pb-4 ${isSheetExpanded ? 'hidden' : 'block'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl font-bold text-black">
                    {getCharacterKey(selectedCharacter)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {getCharacterName(selectedCharacter)}
                  </div>
                </div>
                <div className={`px-3 py-1 text-xs font-medium tracking-wider ${getCharacterColor(selectedCharacter)}`}>
                  {viewMode === 'type' 
                    ? getCharacterType(selectedCharacter)
                    : `Performance: ${Math.round(userPerformance[getCharacterKey(selectedCharacter)]?.successRate || 0)}%`
                  }
                </div>
              </div>
            </div>
            
            {/* Expanded View - Full Details */}
            <div className={`px-4 pb-4 max-h-[70vh] overflow-y-auto ${isSheetExpanded ? 'block' : 'hidden'}`}>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-black mb-2">
                  {getCharacterKey(selectedCharacter)}
                </div>
                <div className={`inline-block px-4 py-2 text-sm font-medium tracking-wider ${getCharacterColor(selectedCharacter)}`}>
                  {viewMode === 'type' 
                    ? getCharacterType(selectedCharacter)
                    : `Performance: ${Math.round(userPerformance[getCharacterKey(selectedCharacter)]?.successRate || 0)}%`
                  }
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-black tracking-wider uppercase">Name</label>
                  <div className="text-lg text-black font-medium">
                    {getCharacterName(selectedCharacter)}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-black tracking-wider uppercase">Sound</label>
                  <div className="text-lg text-black font-medium">
                    {getCharacterSound(selectedCharacter)}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-black tracking-wider uppercase">Example</label>
                  <div className="text-lg text-black font-medium">
                    {getCharacterExample(selectedCharacter)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
          <div className="font-bold text-lg mb-2">
            {'letter' in tooltip.character ? tooltip.character.letter : tooltip.character.mark}
          </div>
          <div className="text-gray-300 mb-1">
            {'name' in tooltip.character ? tooltip.character.name : tooltip.character.tonename}
          </div>
          <div className="text-gray-300">
            {'sound_equiv' in tooltip.character ? tooltip.character.sound_equiv : tooltip.character.pronunciation}
          </div>
          {viewMode === 'performance' && userPerformance[('letter' in tooltip.character ? tooltip.character.letter : tooltip.character.mark)] && (
            <div className="text-gray-300 mt-2 pt-2 border-t border-gray-600">
              <div>Attempts: {userPerformance[('letter' in tooltip.character ? tooltip.character.letter : tooltip.character.mark)].totalAttempts}</div>
              <div>Success: {Math.round(userPerformance[('letter' in tooltip.character ? tooltip.character.letter : tooltip.character.mark)].successRate)}%</div>
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
