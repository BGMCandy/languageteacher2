'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClientBrowser, JapaneseKanji } from '@/lib/supabase'
import RegisterPopup from '@/app/components/elements/registerPopup'
import DetailsCard from './components/detailsCard'

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

// Skeleton component for kanji grid
const KanjiSkeleton = () => {
  return (
    <div className="space-y-2">
      {/* Level skeleton */}
      <div className="flex items-center mb-2">
        <div className="flex-1 h-px bg-gray-200"></div>
        <div className="px-3 py-1 mx-3 bg-gray-200 h-6 w-24 animate-pulse"></div>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>
      
      {/* Kanji grid skeleton */}
      <div className="grid gap-1 grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-16">
        {Array.from({ length: 80 }).map((_, index) => (
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


export default function KanjiPosterClient() {
  const [kanji, setKanji] = useState<(JapaneseKanji | null)[]>(new Array(1945).fill(null))
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [totalKanjiCount] = useState(1945) // Fixed total count
  const [selectedKanji, setSelectedKanji] = useState<JapaneseKanji | null>(null)
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
  const [isSheetExpanded, setIsSheetExpanded] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [hasMoreWords, setHasMoreWords] = useState(false)
  const [wordsOffset, setWordsOffset] = useState(0)

  // Define functions first
  const fetchPerformanceFromQuizAnswers = useCallback(async (supabase: ReturnType<typeof createClientBrowser>, userId: string) => {
    try {
      console.log('Aggregating performance data from quiz_answers table...')
      
      // Get all quiz results for this user
      const { data: quizResults, error: quizError } = await supabase
        .from('quiz_results')
        .select('id')
        .eq('user_id', userId)
        .eq('quiz_type', 'kanji')
      
      if (quizError) {
        console.error('Error fetching quiz results:', quizError)
        return
      }
      
      if (!quizResults || quizResults.length === 0) {
        console.log('No quiz results found for user')
        return
      }
      
              const quizResultIds = quizResults.map((r: { id: number }) => r.id)
      console.log('Found', quizResultIds.length, 'quiz results')
      
      // Get all answers for these quiz results
      const { data: answers, error: answersError } = await supabase
        .from('quiz_answers')
        .select('kanji_character, is_correct')
        .in('quiz_result_id', quizResultIds)
      
      if (answersError) {
        console.error('Error fetching quiz answers:', answersError)
        return
      }
      
      // Aggregate the data
      const performanceMap: Record<string, { totalAttempts: number; correctAttempts: number; successRate: number }> = {}
      
      answers?.forEach((answer: { kanji_character: string; is_correct: boolean }) => {
        const kanji = answer.kanji_character
        if (!performanceMap[kanji]) {
          performanceMap[kanji] = { totalAttempts: 0, correctAttempts: 0, successRate: 0 }
        }
        performanceMap[kanji].totalAttempts++
        if (answer.is_correct) {
          performanceMap[kanji].correctAttempts++
        }
      })
      
      // Calculate success rates
      Object.keys(performanceMap).forEach(kanji => {
        const stats = performanceMap[kanji]
        stats.successRate = stats.totalAttempts > 0 ? (stats.correctAttempts / stats.totalAttempts) * 100 : 0
      })
      
      setUserPerformance(performanceMap)
      console.log('User performance data aggregated from quiz_answers:', Object.keys(performanceMap).length, 'kanji')
      
    } catch (err) {
      console.error('Error aggregating performance from quiz_answers:', err)
    }
  }, [])

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
      console.log('Fetching performance data for user:', user.id)
      
      // First try to fetch from kanji_performance table
      const { data: performanceData, error: performanceError } = await supabase
        .from('kanji_performance')
        .select('kanji_character, total_attempts, correct_attempts')
        .eq('user_id', user.id)
      
      if (performanceError) {
        console.error('Error fetching from kanji_performance table:', performanceError)
        console.log('Falling back to quiz_answers table...')
        
        // Fallback: aggregate from quiz_answers table
        await fetchPerformanceFromQuizAnswers(supabase, user.id)
        return
      }
      
      // Process performance data from kanji_performance table
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
      console.log('User performance data loaded from kanji_performance:', Object.keys(performanceMap).length, 'kanji')
      
    } catch (err) {
      console.error('Error fetching performance data:', err)
    }
  }, [fetchPerformanceFromQuizAnswers])

  // Add a function to refresh performance data (can be called after quiz completion)
  const refreshPerformanceData = useCallback(async () => {
    console.log('Refreshing performance data...')
    await fetchUserPerformance()
  }, [fetchUserPerformance])

  // Load more kanji function with smooth loading
  const loadMoreKanji = useCallback(async () => {
    if (loadingMore || !hasMore || isLoadingMore) return

    setLoadingMore(true)
    setIsLoadingMore(true)
    
    try {
      const supabase = createClientBrowser()
      const pageSize = 100
      const offset = currentPage * pageSize

      const { data: moreKanji, error } = await supabase
        .from('japanese_kanji')
        .select('*')
        .order('level')
        .range(offset, offset + pageSize - 1)

      if (error) {
        console.error('Error fetching more kanji:', error)
        return
      }

      if (moreKanji && moreKanji.length > 0) {
        // Add kanji to the correct positions in the array
        setKanji(prev => {
          const newKanji = [...prev]
          moreKanji.forEach((k, index) => {
            const position = offset + index
            if (position < totalKanjiCount) {
              newKanji[position] = k
            }
          })
          return newKanji
        })
        setCurrentPage(prev => prev + 1)
        setHasMore(moreKanji.length === pageSize)
        console.log(`Loaded ${moreKanji.length} more kanji at positions ${offset}-${offset + moreKanji.length - 1}`)
      } else {
        setHasMore(false)
      }
    } catch (err) {
      console.error('Error loading more kanji:', err)
    } finally {
      setLoadingMore(false)
      setIsLoadingMore(false)
    }
  }, [loadingMore, hasMore, isLoadingMore, currentPage, totalKanjiCount])


  // Scroll detection for infinite loading
  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore || !hasMore) return

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.offsetHeight

      // Load more when user is 1200px from bottom for smoother experience with fixed height
      if (scrollTop + windowHeight >= docHeight - 1200) {
        loadMoreKanji()
      }
    }

    // Throttle scroll events for better performance
    let timeoutId: NodeJS.Timeout
    const throttledHandleScroll = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleScroll, 100)
    }

    window.addEventListener('scroll', throttledHandleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
      clearTimeout(timeoutId)
    }
  }, [loadMoreKanji, loadingMore, hasMore])

  useEffect(() => {
    // Initialize the grid immediately - show full 1945 grid with skeleton placeholders
    console.log('Initializing full 1945 grid with skeleton placeholders...')
    setLoading(false) // Show the grid immediately
    
    // Fetch user performance data in background
    fetchUserPerformance()
    
    // Load first batch of kanji immediately
    loadMoreKanji()
  }, [fetchUserPerformance, loadMoreKanji])

  // Listen for storage events to refresh when user completes a quiz
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'quiz-completed' && e.newValue) {
        console.log('Quiz completion detected, refreshing performance data')
        refreshPerformanceData()
        // Clear the storage event
        localStorage.removeItem('quiz-completed')
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [refreshPerformanceData])

  // Fetch words when a kanji is selected
  useEffect(() => {
    if (selectedKanji) {
      setCurrentWordIndex(0)
      setWordsOffset(0)
      fetchKanjiWords(selectedKanji.letter, 0, 2) // Load only 2 words initially
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
  const groupedKanji = kanji.filter(k => k !== null).reduce((acc, k) => {
    const level = k.level || 'Unknown'
    if (!acc[level]) acc[level] = []
    acc[level].push(k)
    return acc
  }, {} as Record<string, JapaneseKanji[]>)

  const getLevelColor = useCallback((level: string) => {
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
  }, [])

  const getPerformanceColor = useCallback((kanjiChar: string) => {
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
  }, [userPerformance])

  const getKanjiColor = useCallback((kanji: JapaneseKanji) => {
    return viewMode === 'level' ? getLevelColor(kanji.level) : getPerformanceColor(kanji.letter)
  }, [viewMode, getLevelColor, getPerformanceColor])


  // Fetch n the selected kanji
  const fetchKanjiWords = async (kanjiChar: string, offset: number = 0, limit: number = 20) => {
    if (!kanjiChar) return
    
    setLoadingWords(true)
    if (offset === 0) {
      setKanjiWords([])
    }
    
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
        .range(offset, offset + limit - 1)
      
      if (searchError) {
        console.log('Search method 1 failed, trying alternative...', searchError)
        
        // Method 2: Try searching in headwords array using text search
        const { data: headwordResults, error: headwordError } = await supabase
          .from('jmdict_entries')
          .select('*')
          .textSearch('headwords', kanjiChar)
          .range(offset, offset + limit - 1)
        
        if (headwordError) {
          console.log('Search method 2 failed, trying final method...', headwordError)
          
          // Method 3: Use raw SQL-like search in any text field
          const { data: rawResults, error: rawError } = await supabase
            .from('jmdict_entries')
            .select('*')
            .or(`headwords.cs.{${kanjiChar}},readings.cs.{${kanjiChar}}`)
            .range(offset, offset + limit - 1)
          
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
      
      if (offset === 0) {
        setKanjiWords(words)
      } else {
        setKanjiWords(prev => [...prev, ...words])
      }
      
      // Check if there are more words available
      setHasMoreWords(words.length === limit)
      setWordsOffset(offset + words.length)
      
      console.log(`Found ${words.length} words containing kanji: ${kanjiChar} (offset: ${offset})`)
      
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

  const handleKanjiSelect = useCallback((kanji: JapaneseKanji) => {
    setSelectedKanji(kanji)
    setIsSheetExpanded(false) // Reset sheet to collapsed state
  }, [])

  // Generate full 1945 grid with loaded kanji and skeleton placeholders
  const generateFullGrid = useCallback(() => {
    const items = []
    
    // Generate all 1945 slots
    for (let i = 0; i < totalKanjiCount; i++) {
      const groupSize = grouping !== 'none' ? parseInt(grouping) : 0
      const isInGroup = groupSize > 0
      const groupIndex = Math.floor(i / groupSize)
      const isAlternateGroup = groupIndex % 2 === 1
      const isGroupEnd = isInGroup && ((i + 1) % groupSize === 0)
      const isLastInRow = (i + 1) % (groupSize * Math.ceil(groupSize / 10)) === 0
      
      const loadedKanji = kanji[i]
      
      if (loadedKanji) {
        // Render loaded kanji
        items.push(
          <div
            key={loadedKanji.id}
            className={`
              aspect-square flex items-center justify-center 
              cursor-pointer transition-all duration-200
              ${condensedView === 'super-condensed' ? 'hover:bg-blue-100' : 'hover:bg-gray-100'}
              ${getKanjiColor(loadedKanji)}
              ${isInGroup && isAlternateGroup ? 'bg-gray-50/30' : ''}
              ${isInGroup && isGroupEnd ? 'mr-2' : ''}
              ${isInGroup && isLastInRow ? 'mb-2' : ''}
            `}
            onClick={() => handleKanjiSelect(loadedKanji)}
            onMouseEnter={(e) => {
              setTooltip({ kanji: loadedKanji, x: e.clientX, y: e.clientY })
            }}
            onMouseLeave={() => setTooltip(null)}
          >
            <span className={`font-bold leading-none ${
              condensedView === 'super-condensed'
                ? 'text-[8px] sm:text-[10px]'
                : 'text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px]'
            }`}>
              {loadedKanji.letter}
            </span>
          </div>
        )
      } else {
        // Render skeleton placeholder
        items.push(
          <div
            key={`skeleton-${i}`}
            className={`
              aspect-square bg-gray-50 border border-gray-100 animate-pulse
              ${isInGroup && isAlternateGroup ? 'bg-gray-100/30' : ''}
              ${isInGroup && isGroupEnd ? 'mr-2' : ''}
              ${isInGroup && isLastInRow ? 'mb-2' : ''}
            `}
            style={{
              animationDelay: `${i * 10}ms`,
              opacity: 0.3
            }}
          />
        )
      }
    }
    
    return items
  }, [kanji, totalKanjiCount, grouping, condensedView, getKanjiColor, handleKanjiSelect])

  const handleNextWord = () => {
    if (currentWordIndex < kanjiWords.length - 1) {
      // Move to next word if available
      setCurrentWordIndex(prev => prev + 1)
    } else if (hasMoreWords && selectedKanji) {
      // Load more words if we're at the end and more are available
      fetchKanjiWords(selectedKanji.letter, wordsOffset, 5).then(() => {
        // After loading, move to the next word
        setCurrentWordIndex(prev => prev + 1)
      })
    }
  }

  const handlePrevWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(prev => prev - 1)
    }
  }



  if (loading) {
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
                JAPANESE KANJI POSTER
              </h1>
            </div>
            <div className="h-px w-32 bg-black mx-auto mb-4"></div>
            <p className="text-gray-600 tracking-wide">
              If you wanna know Japanese - these are the 1945 common use Kanji you need to learn.
            </p>
          </div>
          
          {/* View Toggle Skeleton */}
          <div className="flex flex-col sm:flex-row justify-center mb-6 sm:mb-8 gap-3 sm:gap-6">
            <div className="border-2 border-gray-200 p-1 inline-flex">
              <ShimmerCard className="w-32 h-12"></ShimmerCard>
              <ShimmerCard className="w-36 h-12"></ShimmerCard>
            </div>
            <div className="border-2 border-gray-200 p-1 inline-flex">
              <ShimmerCard className="w-20 h-12"></ShimmerCard>
              <ShimmerCard className="w-24 h-12"></ShimmerCard>
            </div>
            <div className="border-2 border-gray-200 p-1 inline-flex">
              <ShimmerCard className="w-24 h-12"></ShimmerCard>
              <ShimmerCard className="w-24 h-12"></ShimmerCard>
            </div>
            <div className="border-2 border-gray-200 p-1 inline-flex">
              <ShimmerCard className="w-24 h-12"></ShimmerCard>
              <ShimmerCard className="w-28 h-12"></ShimmerCard>
              <ShimmerCard className="w-32 h-12"></ShimmerCard>
              <ShimmerCard className="w-32 h-12"></ShimmerCard>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            {/* Kanji Grid Skeleton */}
            <div className="flex-1">
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, levelIndex) => (
                  <KanjiSkeleton key={levelIndex} />
                ))}
              </div>
            </div>

            {/* Desktop Details Panel Skeleton */}
            <div className="hidden lg:block w-80 bg-white p-8 border-2 border-gray-200 h-fit sticky top-28">
              <div className="text-center mb-8">
                <ShimmerCard className="w-24 h-24 mx-auto mb-4 rounded"></ShimmerCard>
                <ShimmerCard className="w-32 h-8 mx-auto"></ShimmerCard>
              </div>
              
              <div className="space-y-4">
                <div>
                  <ShimmerCard className="w-20 h-4 mb-2"></ShimmerCard>
                  <ShimmerCard className="w-32 h-6"></ShimmerCard>
                </div>
                <div>
                  <ShimmerCard className="w-16 h-4 mb-2"></ShimmerCard>
                  <ShimmerCard className="w-40 h-6"></ShimmerCard>
                </div>
                <div>
                  <ShimmerCard className="w-24 h-4 mb-2"></ShimmerCard>
                  <ShimmerCard className="w-28 h-6"></ShimmerCard>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t-2 border-gray-200">
                <ShimmerCard className="w-48 h-6 mb-4"></ShimmerCard>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="bg-gray-50 border-2 border-gray-200 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <ShimmerCard className="w-16 h-6"></ShimmerCard>
                        <ShimmerCard className="w-20 h-4"></ShimmerCard>
                        <ShimmerCard className="w-12 h-4"></ShimmerCard>
                      </div>
                      <ShimmerCard className="w-full h-4 mb-3"></ShimmerCard>
                      <div className="flex gap-1">
                        <ShimmerCard className="w-12 h-4"></ShimmerCard>
                        <ShimmerCard className="w-16 h-4"></ShimmerCard>
                        <ShimmerCard className="w-14 h-4"></ShimmerCard>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center py-16 ">
          <div className="flex items-center justify-center space-x-4 mb-3 sm:mb-6">
            {/* Sharp geometric logo */}
            <div className="w-12 h-12 bg-black relative">
              <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}></div>
              <div className="absolute inset-0 bg-black" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }}></div>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-black tracking-wider">
              JAPANESE KANJI POSTER
            </h1>
          </div>
          <div className="h-px w-32 bg-black mx-auto mb-4"></div>
          <p className="text-gray-600 tracking-wide">
            If you wanna know Japanese - these are the 1945 common use Kanji you need to learn.
          </p>
        </div>
        
        {/* View Toggle */}
        <div className="flex flex-col sm:flex-row justify-center mb-6 sm:mb-8 gap-3 sm:gap-6">
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
        
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Kanji Grid */}
          <div className="flex-1">
            {showAllKanji ? (
              /* All Kanji View - Single condensed grid with optional grouping */
              <div>
                {/* Progress indicator */}
                <div className="mb-4 text-center">
                  <div className="text-sm text-gray-600 mb-2">
                    {kanji.filter(k => k !== null).length} of {totalKanjiCount} kanji loaded
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-black h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(kanji.filter(k => k !== null).length / totalKanjiCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className={`grid ${
                  condensedView === 'super-condensed'
                    ? 'gap-1 grid-cols-20 sm:grid-cols-30 md:grid-cols-40 lg:grid-cols-50 xl:grid-cols-60 2xl:grid-cols-80'
                    : 'gap-1 grid-cols-15 sm:grid-cols-20 md:grid-cols-25 lg:grid-cols-30 xl:grid-cols-35'
                }`}>
                  {generateFullGrid()}
                </div>
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
                            ? 'gap-1 grid-cols-15 sm:grid-cols-20 md:grid-cols-25 lg:grid-cols-30 xl:grid-cols-35 2xl:grid-cols-40'
                            : 'gap-1 grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-16'
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
                                onClick={() => handleKanjiSelect(k)}
                                onMouseEnter={(e) => {
                                  setTooltip({ kanji: k, x: e.clientX, y: e.clientY })
                                }}
                                onMouseLeave={() => setTooltip(null)}
                              >
                                <span className={`font-bold leading-none ${
                                  condensedView === 'super-condensed'
                                    ? 'text-[8px] sm:text-[10px]'
                                    : 'text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px]'
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
                                ? 'gap-1 grid-cols-15 sm:grid-cols-20 md:grid-cols-25 lg:grid-cols-30 xl:grid-cols-35 2xl:grid-cols-40'
                                : 'gap-1 grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-16'
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
                                  onClick={() => handleKanjiSelect({ letter: k, level: 'Unknown', reading: '', name: '', sound_equiv: '' } as JapaneseKanji)}
                                  onMouseEnter={(e) => {
                                    setTooltip({ kanji: { letter: k, level: 'Unknown', reading: '', name: '', sound_equiv: '' } as JapaneseKanji, x: e.clientX, y: e.clientY })
                                  }}
                                  onMouseLeave={() => setTooltip(null)}
                                >
                                  <span className={`font-bold leading-none ${
                                    condensedView === 'super-condensed'
                                      ? 'text-[8px] sm:text-[10px]'
                                      : 'text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px]'
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


          {/* Desktop Details Panel */}
          <DetailsCard
            selectedKanji={selectedKanji}
            viewMode={viewMode}
            userPerformance={userPerformance}
            kanjiWords={kanjiWords}
            loadingWords={loadingWords}
            getKanjiColor={getKanjiColor}
            hasMoreWords={hasMoreWords}
            currentWordIndex={currentWordIndex}
            onNextWord={handleNextWord}
            onPrevWord={handlePrevWord}
          />
        </div>
      </div>
      
      {/* Mobile Bottom Sheet */}
      {selectedKanji && (
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
                    {selectedKanji.letter}
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedKanji.reading}
                  </div>
                </div>
                <div className={`px-3 py-1 text-xs font-medium tracking-wider ${getKanjiColor(selectedKanji)}`}>
                  {viewMode === 'level' ? selectedKanji.level : `Performance: ${Math.round(userPerformance[selectedKanji.letter]?.successRate || 0)}%`}
                </div>
              </div>
            </div>
            
            {/* Expanded View - Full Details */}
            <div className={`px-4 pb-4 max-h-[70vh] overflow-y-auto ${isSheetExpanded ? 'block' : 'hidden'}`}>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-black mb-2">
                  {selectedKanji.letter}
                </div>
                <div className={`inline-block px-4 py-2 text-sm font-medium tracking-wider ${getKanjiColor(selectedKanji)}`}>
                  {viewMode === 'level' ? `Level ${selectedKanji.level}` : `Performance: ${Math.round(userPerformance[selectedKanji.letter]?.successRate || 0)}%`}
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
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
              <div className="pt-6 border-t-2 border-black">
                <h3 className="text-lg font-semibold text-black mb-4 tracking-wider">
                  Words containing 「{selectedKanji.letter}」
                </h3>
                
                {loadingWords ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2 tracking-wide">Finding words...</p>
                  </div>
                ) : kanjiWords.length > 0 ? (
                  <div className="space-y-3">
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
