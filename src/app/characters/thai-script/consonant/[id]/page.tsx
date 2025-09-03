'use client'

import { useState, useEffect } from 'react'
import { createClientBrowser, ThaiConsonant } from '@/lib/supabase'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function ThaiConsonantDetailPage() {
  const [consonant, setConsonant] = useState<ThaiConsonant | null>(null)
  const [loading, setLoading] = useState(true)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const params = useParams()

  useEffect(() => {
    const fetchConsonant = async () => {
      try {
        setLoading(true)
        const supabase = createClientBrowser()
        
        const { data, error } = await supabase
          .from('thai_consonants')
          .select('*')
          .eq('idx', params.id)
          .single()
        
        if (error) {
          console.error('Error fetching consonant:', error)
        } else {
          setConsonant(data)
        }
        
      } catch (err) {
        console.error('Error fetching consonant:', err)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchConsonant()
    }
  }, [params.id])

  const playAudio = () => {
    if (consonant?.wav_file) {
      setAudioPlaying(true)
      const audio = new Audio(consonant.wav_file)
      audio.onended = () => setAudioPlaying(false)
      audio.onerror = () => setAudioPlaying(false)
      audio.play()
    }
  }

  const getClassColor = (className: string) => {
    switch (className) {
      case 'mid': return 'bg-blue-100 border-blue-300 text-blue-800'
      case 'high': return 'bg-red-100 border-red-300 text-red-800'
      case 'low': return 'bg-green-100 border-green-300 text-green-800'
      default: return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-black border-t-transparent animate-spin mx-auto mb-4"></div>
            <div className="text-lg text-black tracking-wider">LOADING...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!consonant) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-black mb-4">Character Not Found</h1>
            <Link 
              href="/characters/thai-script" 
              className="inline-block px-6 py-3 bg-black text-white font-semibold tracking-wider hover:bg-gray-800 border-2 border-black transition-all cursor-pointer"
            >
              BACK TO THAI SCRIPT
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">Thai Consonant</h1>
          <div className="h-px w-24 bg-black mx-auto"></div>
        </div>

        {/* Character Card */}
        <div className="border-2 border-black p-8 mb-8">
          <div className="text-center mb-6">
            <div className="text-8xl font-bold text-black mb-4">{consonant.letter}</div>
            <div className={`inline-block px-4 py-2 border-2 rounded ${getClassColor(consonant.class)}`}>
              {consonant.class.toUpperCase()} CLASS
            </div>
          </div>

          {/* Character Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-black mb-2 tracking-wider">NAME</h3>
                <div className="text-lg font-medium text-gray-800">{consonant.name}</div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-black mb-2 tracking-wider">SOUND EQUIVALENT</h3>
                <div className="text-lg font-medium text-gray-800">{consonant.sound_equiv}</div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-black mb-2 tracking-wider">IPA</h3>
                <div className="text-lg font-medium text-gray-800">{consonant.ipa}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-black mb-2 tracking-wider">GLOSS</h3>
                <div className="text-lg font-medium text-gray-800">{consonant.gloss}</div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-black mb-2 tracking-wider">EXAMPLE</h3>
                <div className="text-lg font-medium text-gray-800">{consonant.example}</div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-black mb-2 tracking-wider">CLASS</h3>
                <div className="text-lg font-medium text-gray-800">{consonant.class}</div>
              </div>
            </div>
          </div>

          {/* Audio Player */}
          {consonant.wav_file && (
            <div className="text-center">
              <button
                onClick={playAudio}
                disabled={audioPlaying}
                className={`px-6 py-3 font-semibold tracking-wider border-2 transition-all ${
                  audioPlaying
                    ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                    : 'bg-black text-white border-black hover:bg-white hover:text-black cursor-pointer'
                }`}
              >
                {audioPlaying ? 'PLAYING...' : 'PLAY PRONUNCIATION'}
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Link 
            href="/characters/thai-script" 
            className="px-6 py-3 bg-white text-black font-semibold tracking-wider hover:bg-black hover:text-white border-2 border-black transition-all cursor-pointer"
          >
            BACK TO THAI SCRIPT
          </Link>
          
          <Link 
            href="/characters" 
            className="px-6 py-3 bg-black text-white font-semibold tracking-wider hover:bg-gray-800 border-2 border-black transition-all cursor-pointer"
          >
            ALL CHARACTER SYSTEMS
          </Link>
        </div>
      </div>
    </div>
  )
}
