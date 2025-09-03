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

  const getCharacterKey = (char: ThaiConsonant | ThaiVowel | ThaiTone): string => {
    if ('letter' in char) {
      return (char as { letter: string }).letter
    }
    if ('mark' in char) {
      return (char as { mark: string }).mark
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

  const getCharacterName = (char: ThaiConsonant | ThaiVowel | ThaiTone): string => {
    if ('name' in char) {
      return (char as { name: string }).name
    }
    if ('tonename' in char) {
      return (char as { tonename: string }).tonename
    }
    return 'Unknown'
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

  const getCharacterIPA = (char: ThaiConsonant | ThaiVowel | ThaiTone): string => {
    if ('ipa' in char) {
      return (char as { ipa: string }).ipa
    }
    return 'N/A'
  }

  const getCharacterExample = (char: ThaiConsonant | ThaiVowel | ThaiTone): string => {
    if ('example' in char) {
      return (char as { example: string }).example
    }
    return 'N/A'
  }

  const getCharacterGloss = (char: ThaiConsonant | ThaiVowel | ThaiTone): string => {
    if ('gloss' in char) {
      return (char as { gloss: string }).gloss
    }
    return 'N/A'
  }

  const getCharacterWavFile = (char: ThaiConsonant | ThaiVowel | ThaiTone): string | null => {
    if ('wav_file' in char) {
      return (char as { wav_file: string }).wav_file
    }
    return null
  }

  const getCharacterClass = (char: ThaiConsonant | ThaiVowel | ThaiTone): string | null => {
    if ('class' in char) {
      return (char as { class: string }).class
    }
    return null
  }

  const getCharacterLength = (char: ThaiConsonant | ThaiVowel | ThaiTone): string | null => {
    if ('length' in char) {
      return (char as { length: string }).length
    }
    return null
  }

  const getCharacterForm = (char: ThaiConsonant | ThaiVowel | ThaiTone): string | null => {
    if ('form' in char) {
      return (char as { form: string }).form
    }
    return null
  }

  const getCharacterFunction = (char: ThaiConsonant | ThaiVowel | ThaiTone): string | null => {
    if ('function' in char) {
      return (char as { function: string }).function
    }
    return null
  }

  const characterKey = getCharacterKey(selectedCharacter)
  const performance = userPerformance[characterKey]

  return (
    <div className="hidden lg:block w-80 bg-white p-8 border-2 border-black h-fit sticky top-28">
      <div className="text-center mb-8">
        <div className="text-6xl font-bold text-black mb-4">
          {characterKey}
        </div>
        <div className={`inline-block px-4 py-2 text-sm font-medium tracking-wider ${getCharacterColor(selectedCharacter)}`}>
          {viewMode === 'type' 
            ? getCharacterType(selectedCharacter)
            : `Performance: ${Math.round(performance?.successRate || 0)}%`
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
          <label className="text-sm font-medium text-black tracking-wider uppercase">IPA</label>
          <div className="text-lg text-black font-medium">
            {getCharacterIPA(selectedCharacter)}
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-black tracking-wider uppercase">Example</label>
          <div className="text-lg text-black font-medium">
            {getCharacterExample(selectedCharacter)}
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-black tracking-wider uppercase">Gloss</label>
          <div className="text-lg text-black font-medium">
            {getCharacterGloss(selectedCharacter)}
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
      {getCharacterWavFile(selectedCharacter) && (
        <div className="pt-6 border-t-2 border-black">
          <h3 className="text-lg font-semibold text-black mb-4 tracking-wider">
            Pronunciation
          </h3>
          <button
            onClick={() => {
              const audio = new Audio(getCharacterWavFile(selectedCharacter)!)
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
              <span className="font-medium text-black">{getCharacterClass(selectedCharacter)}</span>
            </div>
          )}
          {'length' in selectedCharacter && (
            <div className="flex justify-between">
              <span className="text-gray-600">Length:</span>
              <span className="font-medium text-black">{getCharacterLength(selectedCharacter)}</span>
            </div>
          )}
          {'form' in selectedCharacter && (
            <div className="flex justify-between">
              <span className="text-gray-600">Form:</span>
              <span className="font-medium text-black">{getCharacterForm(selectedCharacter)}</span>
            </div>
          )}
          {'function' in selectedCharacter && (
            <div className="flex justify-between">
              <span className="text-gray-600">Function:</span>
              <span className="font-medium text-black">{getCharacterFunction(selectedCharacter)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
