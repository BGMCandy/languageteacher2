'use client'

import { useState } from 'react'
import { LanguageCard } from '@/lib/supabase'

interface FlashcardProps {
  card: LanguageCard
  onFlip?: () => void
  className?: string
}

export default function Flashcard({ card, onFlip, className = '' }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
    onFlip?.()
  }

  const playAudio = async () => {
    if (isPlaying) return
    
    // Check if we have a WAV file URL (for Thai characters)
    if ('wav_file' in card && card.wav_file && typeof card.wav_file === 'string') {
      try {
        setIsPlaying(true)
        
        // Create audio element for WAV file
        const audio = new Audio(card.wav_file)
        
        audio.onended = () => setIsPlaying(false)
        audio.onerror = () => setIsPlaying(false)
        
        await audio.play()
        
      } catch (error) {
        console.error('Error playing WAV file:', error)
        setIsPlaying(false)
      }
    } else {
      // Fallback to text-to-speech for Japanese characters
      try {
        setIsPlaying(true)
        
        // Create speech synthesis utterance
        const utterance = new SpeechSynthesisUtterance(card.sound_equiv)
        
        // Configure speech settings for better pronunciation
        utterance.lang = 'ja-JP' // Japanese language
        utterance.rate = 0.8 // Slightly slower for clarity
        utterance.pitch = 1.0
        utterance.volume = 1.0
        
        // Handle speech events
        utterance.onstart = () => setIsPlaying(true)
        utterance.onend = () => setIsPlaying(false)
        utterance.onerror = () => setIsPlaying(false)
        
        // Speak the pronunciation
        window.speechSynthesis.speak(utterance)
        
      } catch (error) {
        console.error('Error playing audio:', error)
        setIsPlaying(false)
      }
    }
  }

  const stopAudio = () => {
    // Stop text-to-speech
    window.speechSynthesis.cancel()
    
    // Stop WAV file playback by reloading the page (simplest way)
    // In a more sophisticated app, you'd track audio elements
    setIsPlaying(false)
  }

  return (
    <div 
      className={`relative w-64 h-80 cursor-pointer perspective-1000 ${className}`}
      onClick={handleFlip}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front of card */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className="w-full h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              {card.letter}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Click to reveal
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg border border-blue-200 dark:border-gray-600 p-6 flex flex-col">
            <div className="text-2xl font-bold text-gray-800 dark:text-white mb-3 text-center">
              {card.letter}
            </div>
            
            <div className="space-y-3 flex-1">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Meaning</div>
                <div className="text-sm font-medium text-gray-800 dark:text-white">{card.name}</div>
              </div>
              
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Reading</div>
                <div className="text-sm font-medium text-gray-800 dark:text-white">{card.reading}</div>
              </div>
              
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Pronunciation</div>
                <div className="flex items-center space-x-2">
                  <div className="text-sm font-medium text-gray-800 dark:text-white flex-1">
                    {card.sound_equiv}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (isPlaying) {
                        stopAudio()
                      } else {
                        playAudio()
                      }
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isPlaying 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                    title={isPlaying ? 'Stop audio' : 'Play pronunciation'}
                  >
                    {isPlaying ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Level</div>
                <div className="text-sm font-medium text-gray-800 dark:text-white">{card.level}</div>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
              Click to flip back
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

