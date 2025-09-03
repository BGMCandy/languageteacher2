'use client'

import { useState, useEffect } from 'react'
import { createClientBrowser, ThaiConsonant, ThaiVowel, ThaiTone } from '@/lib/supabase'
import Link from 'next/link'

// Skeleton component for loading states
const SkeletonCard = () => (
  <div className="border-2 border-gray-200 p-6 animate-pulse">
    <div className="text-center">
      <div className="w-16 h-16 bg-gray-300 rounded mx-auto mb-4"></div>
      <div className="h-6 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
    </div>
  </div>
)

export default function ThaiScriptPage() {
  const [loading, setLoading] = useState(true)
  const [consonants, setConsonants] = useState<ThaiConsonant[]>([])
  const [vowels, setVowels] = useState<ThaiVowel[]>([])
  const [tones, setTones] = useState<ThaiTone[]>([])
  const [activeTab, setActiveTab] = useState<'consonants' | 'vowels' | 'tones'>('consonants')

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

  const getClassColor = (className: string) => {
    switch (className) {
      case 'mid': return 'bg-blue-100 border-blue-300 text-blue-800'
      case 'high': return 'bg-red-100 border-red-300 text-red-800'
      case 'low': return 'bg-green-100 border-green-300 text-green-800'
      default: return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }

  const getLengthColor = (length: string) => {
    switch (length) {
      case 'long': return 'bg-purple-100 border-purple-300 text-purple-800'
      case 'short': return 'bg-orange-100 border-orange-300 text-orange-800'
      default: return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mx-auto animate-pulse"></div>
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            {Array.from({ length: 24 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">Thai Script Characters</h1>
          <p className="text-gray-600 text-lg">
            Learn the Thai alphabet with consonants, vowels, and tones
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 border-2 border-black">
            <button
              onClick={() => setActiveTab('consonants')}
              className={`px-6 py-3 font-semibold tracking-wider transition-all cursor-pointer ${
                activeTab === 'consonants'
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              CONSONANTS ({consonants.length})
            </button>
            <button
              onClick={() => setActiveTab('vowels')}
              className={`px-6 py-3 font-semibold tracking-wider transition-all cursor-pointer ${
                activeTab === 'vowels'
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              VOWELS ({vowels.length})
            </button>
            <button
              onClick={() => setActiveTab('tones')}
              className={`px-6 py-3 font-semibold tracking-wider transition-all cursor-pointer ${
                activeTab === 'tones'
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              TONES ({tones.length})
            </button>
          </div>
        </div>

        {/* Character Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {activeTab === 'consonants' && consonants.map((consonant) => (
            <Link
              key={consonant.idx}
              href={`/characters/thai-script/consonant/${consonant.idx}`}
              className={`border-2 p-4 text-center transition-all hover:shadow-lg cursor-pointer ${getClassColor(consonant.class)}`}
            >
              <div className="text-4xl mb-2">{consonant.letter}</div>
              <div className="text-sm font-medium">{consonant.name}</div>
              <div className="text-xs opacity-80">{consonant.sound_equiv}</div>
              <div className="text-xs opacity-60 mt-1">{consonant.class}</div>
            </Link>
          ))}
          
          {activeTab === 'vowels' && vowels.map((vowel) => (
            <Link
              key={vowel.id}
              href={`/characters/thai-script/vowel/${vowel.id}`}
              className={`border-2 p-4 text-center transition-all hover:shadow-lg cursor-pointer ${getLengthColor(vowel.length)}`}
            >
              <div className="text-4xl mb-2">{vowel.letter}</div>
              <div className="text-sm font-medium">{vowel.name}</div>
              <div className="text-xs opacity-80">{vowel.sound_equiv}</div>
              <div className="text-xs opacity-60 mt-1">{vowel.length}</div>
            </Link>
          ))}
          
          {activeTab === 'tones' && tones.map((tone) => (
            <Link
              key={tone.id}
              href={`/characters/thai-script/tone/${tone.id}`}
              className="border-2 border-gray-300 p-4 text-center transition-all hover:shadow-lg hover:border-black hover:bg-gray-100 cursor-pointer bg-gray-50"
            >
              <div className="text-4xl mb-2">{tone.mark}</div>
              <div className="text-sm font-medium">{tone.tonename}</div>
              <div className="text-xs opacity-80">{tone.function}</div>
              <div className="text-xs opacity-60 mt-1">{tone.example}</div>
            </Link>
          ))}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Link 
            href="/characters" 
            className="inline-block px-6 py-3 bg-black text-white font-semibold tracking-wider hover:bg-gray-800 border-2 border-black transition-all cursor-pointer"
          >
            BACK TO CHARACTER SYSTEMS
          </Link>
        </div>
      </div>
    </div>
  )
}
