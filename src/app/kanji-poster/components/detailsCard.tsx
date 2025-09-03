'use client'

import Link from 'next/link'
import { JapaneseKanji } from '@/lib/supabase'

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

interface DetailsCardProps {
  selectedKanji: JapaneseKanji | null
  viewMode: 'level' | 'performance'
  userPerformance: Record<string, { totalAttempts: number; correctAttempts: number; successRate: number }>
  kanjiWords: DictionaryEntry[]
  loadingWords: boolean
  getKanjiColor: (kanji: JapaneseKanji) => string
  hasMoreWords?: boolean
  currentWordIndex?: number
  onNextWord?: () => void
  onPrevWord?: () => void
}

export default function DetailsCard({
  selectedKanji,
  viewMode,
  userPerformance,
  kanjiWords,
  loadingWords,
  getKanjiColor,
  hasMoreWords = false,
  currentWordIndex = 0,
  onNextWord,
  onPrevWord
}: DetailsCardProps) {
  if (!selectedKanji) {
    return (
      <div className="hidden lg:block w-80 bg-white border-2 border-black h-[80vh] sticky top-22 overflow-y-auto">
        <div className="p-8">
          <div className="text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-100 border-2 border-gray-200 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl text-gray-400">字</span>
            </div>
            <p className="text-sm tracking-wide">Select a kanji to view details</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="hidden lg:block w-80 bg-white border-2 border-black h-[80vh] sticky top-22">
      <div className="p-8">
        {/* Header with clickable kanji */}
        <div className="text-center mb-6">
        <Link 
          href={`/characters/${selectedKanji.letter}`}
          className="block hover:bg-gray-50 transition-colors p-2  border-2 border-transparent hover:border-black"
        >
          <div className="text-5xl font-bold text-black mb-2 transition-colors">
            {selectedKanji.letter}
          </div>
        </Link>
        <div className={`inline-block px-3 py-1 text-xs font-medium tracking-wider  ${getKanjiColor(selectedKanji)}`}>
          {viewMode === 'level' ? `Level ${selectedKanji.level}` : `Performance: ${Math.round(userPerformance[selectedKanji.letter]?.successRate || 0)}%`}
        </div>
      </div>
      
      {/* Basic Information */}
      <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-black tracking-wider uppercase block mb-1">Reading</label>
            <div className="text-base text-black font-medium">{selectedKanji.reading}</div>
          </div>
        
          <div>
            <label className="text-xs font-medium text-black tracking-wider uppercase block mb-1">Meaning</label>
            <div className="text-base text-black font-medium">{selectedKanji.name}</div>
          </div>
        
          <div>
            <label className="text-xs font-medium text-black tracking-wider uppercase block mb-1">Sound Equivalent</label>
            <div className="text-base text-black font-medium">{selectedKanji.sound_equiv}</div>
          </div>
      </div>
      </div>

      {/* Performance Section */}
      <div className="px-4 pt-4 pb-4 border-t-2 border-black">
        <h3 className="text-sm font-semibold text-black mb-2 tracking-wider">
          Quiz Performance
        </h3>
        {userPerformance[selectedKanji.letter] ? (
          /* Logged-in user with data */
          <div className="bg-gray-50 border-2 border-gray-200 p-2 rounded-lg">
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="text-lg font-bold text-black">
                  {userPerformance[selectedKanji.letter].totalAttempts}
                </div>
                <div className="text-xs text-gray-600 tracking-wide uppercase">
                  Attempts
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-black">
                  {Math.round(userPerformance[selectedKanji.letter].successRate)}%
                </div>
                <div className="text-xs text-gray-600 tracking-wide uppercase">
                  Accuracy
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-black">
                  {userPerformance[selectedKanji.letter].correctAttempts}
                </div>
                <div className="text-xs text-gray-600 tracking-wide uppercase">
                  Correct
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Non-logged-in user - grayed out with tooltip */
          <div 
            className="bg-gray-100 border-2 border-gray-300 p-2 rounded-lg opacity-50 cursor-pointer relative group"
            title="Get personal stats by creating an account or logging in"
          >
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-400">
                  --
                </div>
                <div className="text-xs text-gray-400 tracking-wide uppercase">
                  Attempts
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-400">
                  --%
                </div>
                <div className="text-xs text-gray-400 tracking-wide uppercase">
                  Accuracy
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-400">
                  --
                </div>
                <div className="text-xs text-gray-400 tracking-wide uppercase">
                  Correct
                </div>
              </div>
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
              Get personal stats by creating an account or logging in
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
            </div>
          </div>
        )}
      </div>

      {/* Words containing this kanji */}
      <div className="px-4 pt-6 border-t-2 border-black">
        
        {loadingWords ? (
          <div className="space-y-3">
            {/* Navigation Controls - always visible */}
            <div className="flex items-center justify-between">
              <button
                disabled
                className="flex items-center justify-center w-8 h-8 bg-gray-100 border-2 border-gray-300 rounded opacity-50 cursor-not-allowed"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="text-center">
                <h3 className="text-sm font-semibold text-black tracking-wider">
                  Words containing 「{selectedKanji.letter}」
                </h3>
              </div>
              
              <button
                disabled
                className="flex items-center justify-center w-8 h-8 bg-gray-100 border-2 border-gray-300 rounded opacity-50 cursor-not-allowed"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Shimmer effect for word content only */}
            <div className="bg-gray-50 border-2 border-gray-200 p-3 rounded-lg animate-pulse">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 bg-gray-300 rounded w-20"></div>
                <div className="h-4 bg-gray-300 rounded w-16"></div>
                <div className="h-4 bg-gray-300 rounded w-12"></div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div className="flex gap-1">
                <div className="h-4 bg-gray-300 rounded w-16"></div>
                <div className="h-4 bg-gray-300 rounded w-12"></div>
              </div>
            </div>
          </div>
        ) : kanjiWords.length > 0 ? (
          <div className="space-y-3">
            {/* Navigation Controls with title in center */}
            <div className="flex items-center justify-between">
              <button
                onClick={onPrevWord}
                disabled={currentWordIndex === 0}
                className="flex items-center justify-center w-8 h-8 bg-gray-100 border-2 border-gray-300 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <svg className="w-4 h-4 text-gray-600 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="text-center">
                <h3 className="text-sm font-semibold text-black tracking-wider">
                  Words containing 「{selectedKanji.letter}」
                </h3>
              </div>
              
              <button
                onClick={onNextWord}
                disabled={currentWordIndex >= kanjiWords.length - 1 && !hasMoreWords}
                className="flex items-center justify-center w-8 h-8 bg-gray-100 border-2 border-gray-300 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <svg className="w-4 h-4 text-gray-600 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Current Word Display */}
            <div className="bg-gray-50 border-2 border-gray-200 p-3 hover:bg-gray-100 transition-colors rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {kanjiWords[currentWordIndex]?.headwords && kanjiWords[currentWordIndex].headwords.length > 0 && (
                  <Link 
                    href={`/vocabulary/${encodeURIComponent(kanjiWords[currentWordIndex].headwords[0])}`}
                    className="text-lg font-bold text-black hover:text-blue-600 transition-colors hover:underline"
                  >
                    {kanjiWords[currentWordIndex].headwords[0]}
                  </Link>
                )}
                {kanjiWords[currentWordIndex]?.readings && kanjiWords[currentWordIndex].readings.length > 0 && (
                  <span className="text-sm text-gray-600">
                    {kanjiWords[currentWordIndex].readings[0]}
                  </span>
                )}
                {kanjiWords[currentWordIndex]?.is_common && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 border border-green-200 tracking-wide rounded">
                    Common
                  </span>
                )}
              </div>
              
              <div className="text-sm text-gray-700 mb-2">
                {kanjiWords[currentWordIndex]?.glosses_en && kanjiWords[currentWordIndex].glosses_en.length > 0 
                  ? kanjiWords[currentWordIndex].glosses_en.slice(0, 2).join(', ')
                  : 'No English definition'
                }
              </div>
              
              {kanjiWords[currentWordIndex]?.pos_tags && kanjiWords[currentWordIndex].pos_tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {kanjiWords[currentWordIndex].pos_tags.slice(0, 3).map((pos: string, idx: number) => (
                    <span key={idx} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 border border-blue-200 tracking-wide rounded">
                      {pos}
                    </span>
                  ))}
                </div>
              )}
            </div>


          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm tracking-wide">No words found containing this kanji</p>
          </div>
        )}
      </div>

      </div>
  )
}