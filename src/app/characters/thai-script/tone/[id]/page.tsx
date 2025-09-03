'use client'

import { useState, useEffect } from 'react'
import { createClientBrowser, ThaiTone } from '@/lib/supabase'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function ThaiToneDetailPage() {
  const [tone, setTone] = useState<ThaiTone | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()

  useEffect(() => {
    const fetchTone = async () => {
      try {
        setLoading(true)
        const supabase = createClientBrowser()
        
        const { data, error } = await supabase
          .from('thai_tones')
          .select('*')
          .eq('id', params.id)
          .single()
        
        if (error) {
          console.error('Error fetching tone:', error)
        } else {
          setTone(data)
        }
        
      } catch (err) {
        console.error('Error fetching tone:', err)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchTone()
    }
  }, [params.id])

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

  if (!tone) {
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
          <h1 className="text-4xl font-bold text-black mb-4">Thai Tone Mark</h1>
          <div className="h-px w-24 bg-black mx-auto"></div>
        </div>

        {/* Character Card */}
        <div className="border-2 border-black p-8 mb-8">
          <div className="text-center mb-6">
            <div className="text-8xl font-bold text-black mb-4">{tone.mark}</div>
            <div className="inline-block px-4 py-2 border-2 border-gray-300 rounded bg-gray-50">
              {tone.tonename.toUpperCase()} TONE
            </div>
          </div>

          {/* Character Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-black mb-2 tracking-wider">TONE NAME</h3>
                <div className="text-lg font-medium text-gray-800">{tone.tonename}</div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-black mb-2 tracking-wider">FUNCTION</h3>
                <div className="text-lg font-medium text-gray-800">{tone.function}</div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-black mb-2 tracking-wider">UNICODE</h3>
                <div className="text-lg font-medium text-gray-800 font-mono">{tone.unicode}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-black mb-2 tracking-wider">PRONUNCIATION</h3>
                <div className="text-lg font-medium text-gray-800">{tone.pronunciation}</div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-black mb-2 tracking-wider">GLOSS</h3>
                <div className="text-lg font-medium text-gray-800">{tone.gloss}</div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-black mb-2 tracking-wider">EXAMPLE</h3>
                <div className="text-lg font-medium text-gray-800">{tone.example}</div>
              </div>
            </div>
          </div>

          {/* Tone Information */}
          <div className="bg-gray-50 border-2 border-gray-200 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-black mb-4 tracking-wider">TONE INFORMATION</h3>
            <p className="text-gray-700 leading-relaxed">
              Thai is a tonal language with five distinct tones: mid, low, falling, high, and rising. 
              Tone marks like <span className="font-bold">{tone.mark}</span> are used to indicate the 
              {tone.tonename} tone, which affects the meaning of words. The same consonant-vowel combination 
              can have completely different meanings depending on the tone used.
            </p>
          </div>
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
