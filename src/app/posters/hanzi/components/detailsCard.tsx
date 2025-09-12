'use client'

import Link from 'next/link'
import { ChineseHanzi } from '@/lib/supabase'

interface DetailsCardProps {
  selectedHanzi: ChineseHanzi | null
  viewMode: 'definition' | 'pronunciation'
  getHanziColor: (hanzi: ChineseHanzi) => string
}

export default function DetailsCard({
  selectedHanzi,
  viewMode,
  getHanziColor
}: DetailsCardProps) {
  if (!selectedHanzi) {
    return (
      <div className="hidden lg:block w-80 bg-white border-2 border-black">
        <div className="p-8">
          <div className="text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-100 border-2 border-gray-200 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl text-gray-400 chinese-font-extended">字</span>
            </div>
            <p className="text-sm tracking-wide">Select a character to view details</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="hidden lg:block w-80 bg-white border-2 border-black">
      <div className="p-8">
        {/* Header with clickable character */}
        <div className="text-center mb-6">
          <Link 
            href={`/characters/hanzi/${selectedHanzi.char}`}
            className="block hover:bg-gray-50 transition-colors p-2 border-2 border-transparent hover:border-black cursor-pointer"
          >
                      <div className="text-5xl font-bold text-black mb-2 transition-colors chinese-font-extended">
            {selectedHanzi.char}
          </div>
          </Link>
          <div className={`inline-block px-3 py-1 text-xs font-medium tracking-wider ${getHanziColor(selectedHanzi)}`}>
            {viewMode === 'definition' ? 'Definition Available' : 'Pronunciation Available'}
          </div>
        </div>
        
        {/* Basic Information */}
        <div className="space-y-4">
          {/* Definition */}
          {selectedHanzi.kdefinition && (
            <div>
              <label className="text-xs font-medium text-black tracking-wider uppercase block mb-1">Definition</label>
              <div className="text-base text-black font-medium">{selectedHanzi.kdefinition}</div>
            </div>
          )}

          {/* Mandarin Pronunciation */}
          {selectedHanzi.kmandarin && selectedHanzi.kmandarin.length > 0 && (
            <div>
              <label className="text-xs font-medium text-black tracking-wider uppercase block mb-1">Mandarin (Pinyin)</label>
              <div className="text-base text-black font-medium">
                {selectedHanzi.kmandarin.join(', ')}
              </div>
            </div>
          )}

          {/* Cantonese Pronunciation */}
          {selectedHanzi.kcantonese && selectedHanzi.kcantonese.length > 0 && (
            <div>
              <label className="text-xs font-medium text-black tracking-wider uppercase block mb-1">Cantonese (Jyutping)</label>
              <div className="text-base text-black font-medium">
                {selectedHanzi.kcantonese.join(', ')}
              </div>
            </div>
          )}

          {/* Stroke Count */}
          {selectedHanzi.ktotalstrokes && (
            <div>
              <label className="text-xs font-medium text-black tracking-wider uppercase block mb-1">Stroke Count</label>
              <div className="text-base text-black font-medium">{selectedHanzi.ktotalstrokes} strokes</div>
            </div>
          )}
        </div>

        {/* Variants Section */}
        {(selectedHanzi.ksimplifiedvariant || selectedHanzi.ktraditionalvariant) && (
          <div className="px-4 pt-6 border-t-2 border-black">
            <h3 className="text-sm font-semibold text-black mb-2 tracking-wider">
              Character Variants
            </h3>
            
            {/* Simplified Variants */}
            {selectedHanzi.ksimplifiedvariant && selectedHanzi.ksimplifiedvariant.length > 0 && (
              <div className="mb-3">
                <label className="text-xs font-medium text-gray-600 tracking-wider uppercase block mb-1">Simplified</label>
                <div className="flex flex-wrap gap-1">
                  {selectedHanzi.ksimplifiedvariant.slice(0, 3).map((variant, idx) => (
                    <span key={idx} className="bg-red-100 text-red-700 text-sm px-2 py-1 border border-red-200 tracking-wide rounded">
                      {variant}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Traditional Variants */}
            {selectedHanzi.ktraditionalvariant && selectedHanzi.ktraditionalvariant.length > 0 && (
              <div className="mb-3">
                <label className="text-xs font-medium text-gray-600 tracking-wider uppercase block mb-1">Traditional</label>
                <div className="flex flex-wrap gap-1">
                  {selectedHanzi.ktraditionalvariant.slice(0, 3).map((variant, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-700 text-sm px-2 py-1 border border-blue-200 tracking-wide rounded">
                      {variant}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Technical Information - Collapsed by default */}
        {selectedHanzi.properties && Object.keys(selectedHanzi.properties).length > 0 && (
          <div className="px-4 pt-6 border-t-2 border-black">
            <details className="group">
              <summary className="text-sm font-semibold text-black mb-2 tracking-wider cursor-pointer hover:text-gray-600 transition-colors">
                Technical Information
                <span className="ml-2 text-xs text-gray-500 group-open:hidden">(click to expand)</span>
              </summary>
              <div className="space-y-2 mt-3">
                {/* Grade Level */}
                {selectedHanzi.properties.kGradeLevel != null && (
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Grade Level:</span>
                    <span className="ml-1 text-blue-600 font-semibold">Grade {String(selectedHanzi.properties.kGradeLevel)}</span>
                  </div>
                )}

                {/* KangXi Dictionary */}
                {selectedHanzi.properties.kKangXi != null && (
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">KangXi:</span>
                    <span className="ml-1">{String(selectedHanzi.properties.kKangXi)}</span>
                  </div>
                )}

                {/* Four Corner Code */}
                {selectedHanzi.properties.kFourCornerCode != null && (
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Four Corner:</span>
                    <span className="ml-1 font-mono">{String(selectedHanzi.properties.kFourCornerCode)}</span>
                  </div>
                )}

                {/* Cangjie Input Method */}
                {selectedHanzi.properties.kCangjie != null && (
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Cangjie:</span>
                    <span className="ml-1 font-mono">{String(selectedHanzi.properties.kCangjie)}</span>
                  </div>
                )}

                {/* Japanese Readings */}
                {selectedHanzi.properties.kJapanese != null && (
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Japanese:</span>
                    <span className="ml-1">{String(selectedHanzi.properties.kJapanese)}</span>
                  </div>
                )}

                {/* Korean Readings */}
                {selectedHanzi.properties.kKorean != null && (
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Korean:</span>
                    <span className="ml-1">{String(selectedHanzi.properties.kKorean)}</span>
                  </div>
                )}

                {/* Vietnamese Readings */}
                {selectedHanzi.properties.kVietnamese != null && (
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Vietnamese:</span>
                    <span className="ml-1">{String(selectedHanzi.properties.kVietnamese)}</span>
                  </div>
                )}

                {/* Big Five Encoding */}
                {selectedHanzi.properties.kBigFive != null && (
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Big Five:</span>
                    <span className="ml-1 font-mono">{String(selectedHanzi.properties.kBigFive)}</span>
                  </div>
                )}

                {/* CNS Encoding */}
                {selectedHanzi.properties.kCNS1986 != null && (
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">CNS 1986:</span>
                    <span className="ml-1 font-mono">{String(selectedHanzi.properties.kCNS1986)}</span>
                  </div>
                )}

                {/* GB Encoding */}
                {selectedHanzi.properties.kGB0 != null && (
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">GB 2312:</span>
                    <span className="ml-1 font-mono">{String(selectedHanzi.properties.kGB0)}</span>
                  </div>
                )}

                {/* Hanyu Pinyin */}
                {selectedHanzi.properties.kHanyuPinyin != null && (
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Hanyu Pinyin:</span>
                    <span className="ml-1">{String(selectedHanzi.properties.kHanyuPinyin)}</span>
                  </div>
                )}

                {/* Tang Dynasty Pronunciation */}
                {selectedHanzi.properties.kTang != null && (
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Tang Dynasty:</span>
                    <span className="ml-1">{String(selectedHanzi.properties.kTang)}</span>
                  </div>
                )}

                {/* Fanqie (Traditional Chinese Phonetic System) */}
                {selectedHanzi.properties.kFanqie != null && (
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Fanqie:</span>
                    <span className="ml-1">{String(selectedHanzi.properties.kFanqie)}</span>
                  </div>
                )}

                {/* Unicode info */}
                {selectedHanzi.codepoint && (
                  <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                    <span className="font-medium">Unicode:</span>
                    <span className="ml-1 font-mono">U+{selectedHanzi.codepoint.toString(16).toUpperCase()}</span>
                  </div>
                )}

                {/* Show count of total properties */}
                <div className="text-xs text-gray-400 pt-1 italic">
                  Showing {Math.min(12, Object.keys(selectedHanzi.properties).length)} of {Object.keys(selectedHanzi.properties).length} properties
                </div>
              </div>
            </details>
          </div>
        )}

        {/* Action Buttons */}
        <div className="px-4 pt-6 border-t-2 border-black">
          <div className="space-y-2">
            <Link
              href={`/characters/hanzi/${selectedHanzi.char}`}
              className="block w-full text-center px-4 py-2 bg-black text-white text-sm font-medium tracking-wider hover:bg-gray-800 transition-colors cursor-pointer"
            >
              VIEW FULL DETAILS
            </Link>
            
            {selectedHanzi.kdefinition && (
              <button
                onClick={() => {
                  // Copy definition to clipboard
                  navigator.clipboard.writeText(`${selectedHanzi.char}: ${selectedHanzi.kdefinition}`)
                }}
                className="block w-full text-center px-4 py-2 bg-gray-100 text-black text-sm font-medium tracking-wider hover:bg-gray-200 transition-colors border border-gray-300 cursor-pointer"
              >
                COPY DEFINITION
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
