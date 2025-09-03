'use client'

import { ThaiConsonant, ThaiVowel, ThaiTone } from '@/lib/supabase'

interface DetailsCardProps {
  selectedCharacter: ThaiConsonant | ThaiVowel | ThaiTone | null
  viewMode: 'type' | 'performance'
  userPerformance: Record<string, { totalAttempts: number; correctAttempts: number; successRate: number }>
  getCharacterColor: (character: ThaiConsonant | ThaiVowel | ThaiTone) => string
}

export default function DetailsCard({ 
  selectedCharacter, 
  viewMode, 
  userPerformance, 
  getCharacterColor 
}: DetailsCardProps) {
  if (!selectedCharacter) {
    return (
      <div className="hidden lg:block w-80 bg-white p-8 border-2 border-gray-200 h-fit sticky top-28">
        <div className="text-center">
          <div className="text-6xl font-bold text-gray-300 mb-4">ไทย</div>
          <h3 className="text-xl font-semibold text-gray-500 mb-2">Thai Script</h3>
          <p className="text-gray-400 text-sm">
            Click on any character to see details
          </p>
        </div>
      </div>
    )
  }

  const characterKey = 'letter' in selectedCharacter ? selectedCharacter.letter : selectedCharacter.mark
  const performance = userPerformance[characterKey]

  return (
    <div className="hidden lg:block w-80 bg-white p-8 border-2 border-black h-fit sticky top-28">
      <div className="text-center mb-8">
        <div className="text-6xl font-bold text-black mb-4">
          {characterKey}
        </div>
        <div className={`inline-block px-4 py-2 text-sm font-medium tracking-wider ${getCharacterColor(selectedCharacter)}`}>
          {viewMode === 'type' 
            ? ('class' in selectedCharacter ? selectedCharacter.class : 'length' in selectedCharacter ? selectedCharacter.length : 'tone')
            : `Performance: ${Math.round(performance?.successRate || 0)}%`
          }
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="text-sm font-medium text-black tracking-wider uppercase">Name</label>
          <div className="text-lg text-black font-medium">
            {'name' in selectedCharacter ? selectedCharacter.name : selectedCharacter.tonename}
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-black tracking-wider uppercase">Sound</label>
          <div className="text-lg text-black font-medium">
            {'sound_equiv' in selectedCharacter ? selectedCharacter.sound_equiv : selectedCharacter.pronunciation}
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-black tracking-wider uppercase">IPA</label>
          <div className="text-lg text-black font-medium">
            {'ipa' in selectedCharacter ? selectedCharacter.ipa : 'N/A'}
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-black tracking-wider uppercase">Example</label>
          <div className="text-lg text-black font-medium">
            {'example' in selectedCharacter ? selectedCharacter.example : selectedCharacter.example}
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-black tracking-wider uppercase">Gloss</label>
          <div className="text-lg text-black font-medium">
            {'gloss' in selectedCharacter ? selectedCharacter.gloss : selectedCharacter.gloss}
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      {viewMode === 'performance' && performance && (
        <div className="pt-6 border-t-2 border-black">
          <h3 className="text-lg font-semibold text-black mb-4 tracking-wider">
            Performance Stats
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Attempts:</span>
              <span className="text-sm font-medium text-black">{performance.totalAttempts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Correct Answers:</span>
              <span className="text-sm font-medium text-black">{performance.correctAttempts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Success Rate:</span>
              <span className="text-sm font-medium text-black">{Math.round(performance.successRate)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Audio Player */}
      {'wav_file' in selectedCharacter && selectedCharacter.wav_file && (
        <div className="pt-6 border-t-2 border-black">
          <h3 className="text-lg font-semibold text-black mb-4 tracking-wider">
            Pronunciation
          </h3>
          <button
            onClick={() => {
              const audio = new Audio(selectedCharacter.wav_file)
              audio.play()
            }}
            className="w-full px-4 py-2 bg-black text-white font-semibold tracking-wider hover:bg-gray-800 border-2 border-black transition-all cursor-pointer"
          >
            PLAY PRONUNCIATION
          </button>
        </div>
      )}

      {/* Character Type Info */}
      <div className="pt-6 border-t-2 border-black">
        <h3 className="text-lg font-semibold text-black mb-4 tracking-wider">
          Character Info
        </h3>
        <div className="space-y-2 text-sm">
          {'class' in selectedCharacter && (
            <div className="flex justify-between">
              <span className="text-gray-600">Class:</span>
              <span className="font-medium text-black">{selectedCharacter.class}</span>
            </div>
          )}
          {'length' in selectedCharacter && (
            <div className="flex justify-between">
              <span className="text-gray-600">Length:</span>
              <span className="font-medium text-black">{selectedCharacter.length}</span>
            </div>
          )}
          {'form' in selectedCharacter && (
            <div className="flex justify-between">
              <span className="text-gray-600">Form:</span>
              <span className="font-medium text-black">{selectedCharacter.form}</span>
            </div>
          )}
          {'function' in selectedCharacter && (
            <div className="flex justify-between">
              <span className="text-gray-600">Function:</span>
              <span className="font-medium text-black">{selectedCharacter.function}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
